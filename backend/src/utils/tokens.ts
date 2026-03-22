import jwt from 'jsonwebtoken';

export const generateAccessToken = async (userId: number) => {
    const accessToken = await jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: '60m'
    });
    return accessToken;
};

export const generateRefreshToken = async (userId: number) => {
    const refreshToken = await jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: '7d'
    });

    return refreshToken;
};
