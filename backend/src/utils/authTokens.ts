import jwt from 'jsonwebtoken';
import { tokenPayload } from '../types/jwt.types';

export const generateAccessToken = async (payload: tokenPayload) => {
    const accessToken = await jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '60m'
    });
    return accessToken;
};

export const generateRefreshToken = async (payload: tokenPayload) => {
    const refreshToken = await jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '7d'
    });

    return refreshToken;
};
