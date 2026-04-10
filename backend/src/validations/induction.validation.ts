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

export const updateInductionSchema = z
    .object({
        opened_on: z.iso.datetime(),
        closing_on: z.iso.datetime()
    })
    .transform((data) => ({
        opened_on: new Date(data.opened_on),
        closing_on: new Date(data.closing_on)
    }))
    .refine((data) => data.closing_on > data.opened_on, {
        message: 'Closing date must be after opening date',
        path: ['closing_on']
    });
