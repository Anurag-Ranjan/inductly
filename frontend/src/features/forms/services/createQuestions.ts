import type { Question } from "../types/forms.types";

export function createEmptyQuestion(order_index: number): Question {
	return {
		clientId: crypto.randomUUID(),

		syncStatus: "pending_create",

		version: 0,

		question_text: "Title",

		question_type: "TEXT",

		is_required: false,

		order_index,

		metadata: null,
	};
}
