import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().trim().min(1, 'Name is required'),

    email: z.email('Invalid email address'),

    password: z
        .string()
        .min(6, 'Password should be at least 6 characters')
        .max(20, 'Password should be at most 20 characters')
});

const loginSchema = z.object({
    email: z.email('Invalid email address'),

    password: z
        .string()
        .min(6, 'Password should be at least 6 characters')
        .max(20, 'Password should be at most 20 characters')
});

export { registerSchema, loginSchema };
