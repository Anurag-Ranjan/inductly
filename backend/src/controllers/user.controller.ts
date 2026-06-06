import { Request, Response, RequestHandler } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import { prisma } from '../utils/prisma';
import { hasher, verifyPass } from '../utils/password';
import {
    generateVerificationToken,
    verifyToken
} from '../services/verification.service';
import { sendVerificationEmail } from '../services/email/mailer';
import { generateAccessToken, generateRefreshToken } from '../utils/authTokens';
import {
    accessTokenCookieOptions,
    refreshTokenCookieOptions
} from '../utils/cookieOptions';
import { tokenPayload } from '../types/jwt.types';
import {
    gitHubSchema,
    branchSchema,
    batchSchema,
    linkedInSchema,
    phoneSchema
} from '../validations/profile.validations';
import jwt, { JwtPayload } from 'jsonwebtoken';

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const data = registerSchema.parse(req.body);

    const hashedPassword = await hasher(data.password);

    const user = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword
        },
        select: {
            id: true,
            name: true,
            email: true
        }
    });

    if (user === null) throw new ApiError(500, 'Internal Server Error');

    const verificationLink = await generateVerificationToken(user.id);

    if (!verificationLink)
        throw new ApiError(500, 'Error creating the verification link');

    await sendVerificationEmail(user.email, user.name, verificationLink);

    return res
        .status(201)
        .json(new ApiResponse(201, user, 'User created successfully'));
});

const verifyUser: RequestHandler<{ token: string }> = asyncHandler(
    async (req, res) => {
        const { token } = req.params;

        const user = await verifyToken(token);

        if (!user) {
            throw new ApiError(400, 'Invalid or Expired token');
        }

        // const refreshToken = generateRefreshToken(user);
        // const accessToken = generateAccessToken(user);

        // res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        // res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { ...user, isProfileComplete: false },
                    'Email Verified successfully'
                )
            );
    }
);

const loginUser: RequestHandler = asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (!user || !user.isVerified || !user.password)
        throw new ApiError(401, 'Invalid email or password');

    const isValid = await verifyPass(password, user.password);

    if (isValid === false) throw new ApiError(401, 'Invalid email or password');

    const accessToken = await generateAccessToken({
        id: user.id,
        name: user.name,
        email: user.email
    });
    const refreshToken = await generateRefreshToken({
        id: user.id,
        name: user.name,
        email: user.email
    });

    const updatedUser = await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            refreshToken: await hasher(refreshToken)
        },
        select: {
            id: true,
            name: true,
            email: true,
            isVerified: true,
            isProfileComplete: true,
            profile_picture: true,
            isOnboarded: true,
            isPictureUploaded: true
        }
    });

    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, 'Logged in successfully'));
});

const logoutUser: RequestHandler = asyncHandler(async (req, res) => {
    if (req.user)
        await prisma.user.update({
            where: { id: req.user.id },
            data: { refreshToken: null }
        });

    res.clearCookie('accessToken', accessTokenCookieOptions);
    res.clearCookie('refreshToken', refreshTokenCookieOptions);

    return res
        .status(200)
        .json(new ApiResponse(200, null, 'Logged out successfully'));
});

const onboardUser: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = req.user as tokenPayload;
    if (!id) throw new ApiError(401, 'Unauthorized access');
    const { branch, batch } = req.body;

    branchSchema.parse(branch);
    batchSchema.parse(batch);

    const user = await prisma.user.update({
        where: {
            id
        },
        data: {
            branch,
            batch,
            isOnboarded: true
        },
        select: {
            id: true,
            name: true,
            email: true,
            isVerified: true
        }
    });

    if (!user) throw new ApiError(500, 'Internal Server Error');

    return res
        .status(200)
        .json(new ApiResponse(200, null, 'Onboarding done successfully'));
});

const updateProfile: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = req.user as tokenPayload;
    const { gitHub, linkedIn, mobile_number } = req.body;

    const normalize = (val?: string) => val?.trim() || undefined;

    const cleanGithub = normalize(gitHub);
    const cleanLinkedIn = normalize(linkedIn);
    const cleanMobile = normalize(mobile_number);

    if (cleanGithub) gitHubSchema.parse(cleanGithub);
    if (cleanLinkedIn) linkedInSchema.parse(cleanLinkedIn);
    if (cleanMobile) phoneSchema.parse(cleanMobile);

    const existingUser = await prisma.user.findUnique({
        where: { id },
        select: {
            github: true,
            linkedin: true,
            mobile_number: true
        }
    });

    if (!existingUser) throw new ApiError(404, 'User not found');

    const finalGithub = cleanGithub ?? existingUser.github;
    const finalLinkedIn = cleanLinkedIn ?? existingUser.linkedin;
    const finalMobile = cleanMobile ?? existingUser.mobile_number;

    const data: any = {
        isVerified: !!(finalGithub && finalLinkedIn && finalMobile)
    };

    if (cleanGithub !== undefined) data.github = cleanGithub;
    if (cleanLinkedIn !== undefined) data.linkedin = cleanLinkedIn;
    if (cleanMobile !== undefined) data.mobile_number = cleanMobile;

    const updatedUser = await prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            github: true,
            linkedin: true,
            mobile_number: true,
            batch: true,
            branch: true,
            isVerified: true,
            isProfileComplete: true,
            isPictureUploaded: true,
            profile_picture: true,
            created_at: true,
            updated_at: true
        }
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { updatedUser },
                'Profile Updated Successfully'
            )
        );
});

const refreshAccessToken: RequestHandler = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) throw new ApiError(401, 'Unauthorized access');

    const user: tokenPayload = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET!
    ) as tokenPayload;

    if (!user) throw new ApiError(401, 'Invalid Token');

    const payload: tokenPayload = {
        id: user.id,
        name: user.name,
        email: user.email
    };

    const newAccessToken = await generateAccessToken(payload);
    const newRefreshToken = await generateRefreshToken(payload);
    const hashedRefreshToken = await hasher(refreshToken);

    const result = await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            refreshToken: hashedRefreshToken
        },
        select: {
            id: true,
            name: true,
            email: true,
            isVerified: true,
            isProfileComplete: true,
            profile_picture: true,
            isOnboarded: true,
            isPictureUploaded: true
        }
    });

    res.cookie('accessToken', newAccessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions);

    return res
        .status(200)
        .json(new ApiResponse(200, result, 'Token refreshed successfully'));
});

const getUserProfile: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = req.user as tokenPayload;

    if (!id) throw new ApiError(401, 'Unauthorized');

    const user = await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            email: true,
            profile_picture: true,
            branch: true,
            batch: true,
            github: true,
            linkedin: true,
            mobile_number: true,
            created_at: true,
            updated_at: true
        }
    });

    if (!user) throw new ApiError(500, 'Internal Server Error');

    const profileFields: (keyof typeof user)[] = [
        'name',
        'email',
        'profile_picture',
        'branch',
        'batch',
        'github',
        'linkedin',
        'mobile_number'
    ];
    const completedFields = profileFields.filter(
        (f) => user[f] != null && user[f] !== ''
    ).length;

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { ...user, totalFields: profileFields.length, completedFields },
                'Profile fetched successfully'
            )
        );
});

const updateGithub: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthenticated');

    const { gitHub }: { gitHub: string } = req.body;

    const github = gitHubSchema.parse(gitHub);

    const updatedSocials = await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            github: github
        },
        select: {
            github: true
        }
    });

    if (!updatedSocials) throw new ApiError(404, 'User not found');

    return res
        .status(201)
        .json(
            new ApiResponse(201, updatedSocials, 'Github updated successfully')
        );
});

const updateLinkedIn: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthenticated');

    const { linkedIn }: { linkedIn: string } = req.body;
    console.log(linkedIn);

    const linkedin = linkedInSchema.parse(linkedIn);

    const updatedSocials = await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            linkedin: linkedin
        },
        select: {
            linkedin: true
        }
    });

    if (!updatedSocials) throw new ApiError(404, 'User not found');

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                updatedSocials,
                'LinkedIn updated successfully'
            )
        );
});

export {
    registerUser,
    verifyUser,
    loginUser,
    logoutUser,
    onboardUser,
    updateProfile,
    refreshAccessToken,
    getUserProfile,
    updateGithub,
    updateLinkedIn
};
