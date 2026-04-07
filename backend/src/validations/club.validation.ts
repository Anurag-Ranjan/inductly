import { z } from 'zod';

export const clubSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Club name must be at least 2 characters')
        .max(100, 'Club name is too long'),

    description: z
        .string()
        .trim()
        .max(500, 'Description cannot exceed 500 characters')
        .optional()
        .or(z.literal('')),

    website: z.url('Invalid website URL').trim().optional().or(z.literal('')),

    instagram: z
        .url('Invalid Instagram URL')
        .trim()
        .optional()
        .or(z.literal('')),

    logo: z.url('Invalid logo image URL').trim().optional().or(z.literal('')),

    linkedin: z.url('Invalid LinkedIn URL').trim().optional().or(z.literal('')),

    formed_on: z.coerce
        .date()
        .max(new Date(), 'Foundation date cannot be in the future')
        .optional()
});

export type ClubInput = z.infer<typeof clubSchema>;
