import { z } from 'zod';

export const createStageSchema = z.object({
    name: z.string().min(3).max(100),

    description: z.string().max(500).nullable().optional(),
    order_index: z.number()
});

export const updateStageSchema = z
    .object({
        name: z.string().min(3).max(100),

        description: z.string().max(500).nullable().optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field is required'
    });
