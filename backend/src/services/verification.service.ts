import { ApiError } from '../utils/ApiError';
import { prisma } from '../utils/prisma';
import { createVerificationToken, hashToken } from '../utils/verification';

export const generateVerificationToken = async (userId: number) => {
    const { token, hashedToken } = await createVerificationToken();

    const link = `${process.env.FRONTEND_BASE_URL}/verify-email?token=${token}`;

    await prisma.verificationToken.create({
        data: {
            userId,
            token: hashedToken,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60)
        }
    });

    return link;
};

export const verifyToken = async (token: string) => {
    const hashedToken = hashToken(token);

    const tokenRecord = await prisma.verificationToken.findUnique({
        where: {
            token: hashedToken
        }
    });

    if (!tokenRecord) throw new ApiError(401, 'Invalid Token provided');

    if (tokenRecord.expiresAt < new Date()) {
        await prisma.verificationToken.delete({
            where: { id: tokenRecord.id }
        });
        throw new ApiError(401, 'Token has Expired');
    }

    await prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { isVerified: true }
    });

    await prisma.verificationToken.delete({
        where: { id: tokenRecord.id }
    });

    return tokenRecord.userId;
};
