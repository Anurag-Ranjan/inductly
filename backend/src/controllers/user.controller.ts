import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { registerSchema } from '../validations/auth.validation';
import { prisma } from '../utils/prisma';
import { hasher } from '../utils/password';
import { generateVerificationToken } from '../services/verification.service';
import { sendVerificationEmail } from '../services/email/mailer';

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

const verifyUser = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.query;
});

export { registerUser, verifyUser };
