import { ApiError } from '../utils/ApiError';
import { prisma } from '../utils/prisma';
import { createVerificationToken, hashToken } from '../utils/verification';

export const generateVerificationToken = async (userId: number) => {
    const { token, hashedToken } = await createVerificationToken();

    const link = `${process.env.FRONTEND_BASE_URL}/verify-email?token=${token}`;

    const temp = await prisma.verificationToken.create({
        data: {
            userId,
            token: hashedToken,
            expires_at: new Date(Date.now() + 1000 * 60 * 60)
        }
    });

    console.log(temp);

    return link;
};

export const verifyToken = async (token: string) => {
    const hashedToken = hashToken(token);
    const tokenRecord = await prisma.verificationToken.findFirst({
        where: {
            token: hashedToken
        }
    });

    if (!tokenRecord) throw new ApiError(401, 'Invalid Token provided');

    if (tokenRecord.expires_at < new Date()) {
        await prisma.verificationToken.delete({
            where: { id: tokenRecord.id }
        });
        throw new ApiError(401, 'Token has Expired');
    }

    const user = await prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { isVerified: true },
        select: {
            id: true,
            name: true,
            email: true
        }
    });

    await prisma.verificationToken.delete({
        where: { id: tokenRecord.id }
    });

    return user;
};
