export const Branches = [
    'CSE',
    'CS',
    'IT',
    'ECE',
    'EE',
    'ME',
    'CE',
    'CHE',
    'MET',
    'MIN',
    'PROD'
] as const;
export type Branch = (typeof Branches)[number];

export const Batches = ['2023', '2024', '2025', '2026'] as const;
export type Batch = (typeof Batches)[number];
