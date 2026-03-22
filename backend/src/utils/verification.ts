import crypto from 'crypto';

export const createVerificationToken = async () => {
    const token = crypto.randomBytes(32).toString();
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    return { token, hashedToken };
};

export const hashToken = (token: string) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    return hashedToken;
};
