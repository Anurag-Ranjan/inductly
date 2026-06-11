export const QUESTION_TYPES = [
	{ value: "TEXT", label: "Short Answer" },
	{ value: "TEXTAREA", label: "Paragraph" },
	{ value: "SELECT", label: "Single Select" },
	{ value: "MULTI_SELECT", label: "Multi Select" },
	{ value: "CHECKBOX", label: "Checkbox" },
	{ value: "FILE", label: "File Upload" },
] as const;
