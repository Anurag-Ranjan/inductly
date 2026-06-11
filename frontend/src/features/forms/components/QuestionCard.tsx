import type { Question, QuestionType } from "../types/forms.types";
import QuestionMetadataFields from "./QuestionMetadataFields";

export interface QuestionCardProps {
	questions: Question[];
	questionTypes: { label: string; value: string }[];
	addQuestion: () => void;
	removeQuestion: (clientId: string) => void;
	updateQuestion: (clientId: string, updates: Partial<Question>) => void;
	onSaveForm?: () => void;
}

export default function QuestionCard({
	questions,
	questionTypes,
	addQuestion,
	removeQuestion,
	updateQuestion,
	onSaveForm,
}: QuestionCardProps) {
	// 2. Handle the empty state
	if (questions.length === 0) {
		return (
			<div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
				<div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
					<span className="material-symbols-outlined text-3xl text-slate-400">
						quiz
					</span>
				</div>
				<h4 className="text-lg font-semibold text-slate-900 mb-1">
					No questions yet
				</h4>
				<p className="text-sm text-slate-500 mb-4">
					Add your first question to start building the form.
				</p>
				<button
					type="button"
					onClick={addQuestion}
					className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
				>
					<span className="material-symbols-outlined text-[18px]">add</span>
					Add Question
				</button>
			</div>
		);
	}

	// 3. Wrap the mapped array in a return statement and a parent container
	return (
		<div className="flex flex-col gap-6">
			{questions.map((q, idx) => (
				<div
					key={q.clientId}
					className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative overflow-hidden group"
				>
					<div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400" />

					<div className="flex flex-col gap-6">
						{/* Question header */}
						<div className="flex justify-between items-start">
							<div className="flex items-center gap-2">
								<span className="material-symbols-outlined text-slate-400 text-[20px] cursor-grab">
									drag_indicator
								</span>
								<span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
									Question {q.order_index ?? idx + 1}
								</span>
							</div>
							<button
								type="button"
								onClick={() => removeQuestion(q.clientId)}
								className="text-red-600 hover:bg-red-100/50 p-1 rounded-lg transition-colors"
							>
								<span className="material-symbols-outlined text-[20px]">
									delete
								</span>
							</button>
						</div>

						{/* Question fields */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="flex flex-col gap-2 md:col-span-2">
								<label className="text-sm font-medium text-slate-900">
									Question Text
								</label>
								<input
									className="w-full p-3 border border-slate-300 rounded-lg text-base text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-shadow"
									type="text"
									placeholder="e.g. What is your primary skill?"
									value={q.question_text}
									onChange={(e) =>
										updateQuestion(q.clientId, {
											question_text: e.target.value || "Title",
										})
									}
									onBlur={onSaveForm}
								/>
							</div>

							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium text-slate-900">
									Question Type
								</label>
								<div className="relative">
									<select
										value={q.question_type}
										onChange={(e) =>
											updateQuestion(q.clientId, {
												question_type: e.target.value as QuestionType,
												metadata: null, // Reset metadata when type changes
											})
										}
										onBlur={onSaveForm}
										className="w-full p-3 border border-slate-300 rounded-lg text-base text-slate-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-shadow cursor-pointer"
									>
										{questionTypes.map((t) => (
											<option key={t.value} value={t.value}>
												{t.label}
											</option>
										))}
									</select>
									<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
										expand_more
									</span>
								</div>
							</div>

							<div className="flex items-end justify-end">
								<label className="flex items-center gap-2 cursor-pointer group/check pb-3">
									<input
										type="checkbox"
										checked={q.is_required}
										onChange={(e) =>
											updateQuestion(q.clientId, {
												is_required: e.target.checked,
											})
										}
										onBlur={onSaveForm}
										className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
									/>
									<span className="text-sm text-slate-600 group-hover/check:text-slate-900 transition-colors">
										Required
									</span>
								</label>
							</div>
						</div>

						{/* Metadata fields */}
						<div className="bg-white border border-slate-200 rounded-lg p-4">
							<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
								Metadata / Validation
							</label>
							<QuestionMetadataFields
								question_type={q.question_type}
								metadata={q.metadata}
								onChange={(meta) =>
									updateQuestion(q.clientId, { metadata: meta })
								}
								onBlur={onSaveForm}
							/>
						</div>
					</div>
				</div>
			))}

			{questions.length > 0 && (
				<button
					type="button"
					onClick={addQuestion}
					className="w-full py-6 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 text-indigo-600 text-sm font-semibold hover:bg-slate-50 hover:border-indigo-600 transition-all group active:scale-[0.98]"
				>
					<span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">
						add_circle
					</span>
					Add Question
				</button>
			)}
		</div>
	);
}
