import { QUESTION_TYPES } from "../constants/forms.constants";

export type SyncStatus =
	| "pending_create"
	| "pending_update"
	| "pending_delete"
	| "synced";

export type QuestionType = (typeof QUESTION_TYPES)[number]["value"];

export interface QuestionOption {
	label: string;
	value: string;
}

export interface Question {
	clientId: string;

	id?: number;

	syncStatus: SyncStatus;

	version: number;

	question_text: string;

	question_type: QuestionType;

	is_required: boolean;

	order_index: number;

	metadata: Record<string, any> | null;
}
