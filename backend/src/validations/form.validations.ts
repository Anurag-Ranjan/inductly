import { z } from 'zod';

export const formSchema = z.object({
    title: z.string("Title must be a string").min(1, "Title cannot be an empty string").max(15, "Title can only have 15 characters"),
    description: z.string("description must be a string").max(50, "Description can be maximum 50 characters long").optional()
})

export const QuestionTypeEnum = z.enum([
  "TEXT",
  "TEXTAREA",
  "SELECT",
  "MULTI_SELECT",
  "CHECKBOX",
  "FILE",
]);

const optionSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const createQuestionSchema = z.discriminatedUnion("question_type", [
  // TEXT
  z.object({
    question_text: z
      .string()
      .trim()
      .min(3, "Question must be at least 3 characters"),

    question_type: z.literal("TEXT"),

    order_index: z.number().int().min(0),

    is_required: z.boolean().optional(),

    metadata: z
      .object({
        minLength: z.number().int().positive().optional(),
        maxLength: z.number().int().positive().optional(),
        placeholder: z.string().optional(),
      })
      .optional(),
  }),

  // TEXTAREA
  z.object({
    question_text: z.string().trim().min(3),
    question_type: z.literal("TEXTAREA"),
    order_index: z.number().int().min(0),
    is_required: z.boolean().optional(),

    metadata: z
      .object({
        minLength: z.number().int().positive().optional(),
        maxLength: z.number().int().positive().optional(),
        placeholder: z.string().optional(),
      })
      .optional(),
  }),

  // SELECT
  z.object({
    question_text: z.string().trim().min(3),
    question_type: z.literal("SELECT"),
    order_index: z.number().int().min(0),
    is_required: z.boolean().optional(),

    metadata: z.object({
      options: z
        .array(optionSchema)
        .min(1, "At least one option is required"),
    }),
  }),

  // MULTI_SELECT
  z.object({
    question_text: z.string().trim().min(3),
    question_type: z.literal("MULTI_SELECT"),
    order_index: z.number().int().min(0),
    is_required: z.boolean().optional(),

    metadata: z.object({
      options: z
        .array(optionSchema)
        .min(1, "At least one option is required"),
    }),
  }),

  // CHECKBOX
  z.object({
    question_text: z.string().trim().min(3),
    question_type: z.literal("CHECKBOX"),
    order_index: z.number().int().min(0),
    is_required: z.boolean().optional(),

    metadata: z
      .object({
        label: z.string().optional(),
      })
      .optional(),
  }),

  // FILE
  z.object({
    question_text: z.string().trim().min(3),
    question_type: z.literal("FILE"),
    order_index: z.number().int().min(0),
    is_required: z.boolean().optional(),

    metadata: z
      .object({
        maxSizeMB: z.number().positive().optional(),
        allowedTypes: z.array(z.string()).optional(),
      })
      .optional(),
  }),
]);