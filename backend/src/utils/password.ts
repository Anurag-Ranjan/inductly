import bcrypt from 'bcrypt';

export const hasher = async (password: string) => bcrypt.hash(password, 10);
