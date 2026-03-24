export const Branches = ['CSE', 'ECE', 'ME', 'CE'] as const;
export type Branch = (typeof Branches)[number];

export const Batches = ['2023', '2024', '2025'] as const;
export type Batch = (typeof Batches)[number];
