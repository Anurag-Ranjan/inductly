import crypto from 'crypto';

const createHashedToken = (token: string) =>
    crypto.createHash('sha256').update(token).digest('hex');

export const createVerificationToken = async () => {
    const token = crypto.randomBytes(32).toString('base64url');
    const hashedToken = createHashedToken(token);
    console.log(token);
    console.log(hashedToken);
    return { token, hashedToken };
};

export const hashToken = (token: string) => {
    const hashedToken = createHashedToken(token);
    return hashedToken;
};
