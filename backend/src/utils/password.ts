import bcrypt from 'bcrypt';

export const hasher = async (password: string) => bcrypt.hash(password, 10);

export const verifyPass = async (password: string, hashedPassword: string) =>
    await bcrypt.compare(password, hashedPassword);
