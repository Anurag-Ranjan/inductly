import { Branches, Batches, Branch, Batch } from '../types/enums';
import { z } from 'zod';

const branchSchema = z.enum(Branches, { error: 'Invalid branch' });
const batchSchema = z.enum(Batches, { error: 'Invalid Batch' });

const linkedInSchema = z
    .url('Invalid Url')
    .regex(
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
        'Invalid LinkedIn profile URL. Expected format: https://www.linkedin.com'
    );

const gitHubSchema = z
    .url('Invalid Url')
    .regex(
        /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/,
        'Invalid GitHub profile URL. Expected format: https://github.com'
    );

const phoneSchema = z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile number');

export { linkedInSchema, gitHubSchema, branchSchema, batchSchema, phoneSchema };
