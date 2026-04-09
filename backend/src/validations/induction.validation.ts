import { z } from 'zod';

export const createInductionSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(3, 'Title must be at least 3 characters long')
            .max(100, 'Title cannot exceed 100 characters'),

        description: z
            .string()
            .trim()
            .max(1000, 'Description cannot exceed 1000 characters')
            .optional()
    })
    .transform((data) => ({
        ...data,
        description: data.description === '' ? null : data.description
    }));
