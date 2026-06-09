import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { QUESTION_TYPES } from "./constants";

type QuestionType = (typeof QUESTION_TYPES)[number]["value"];

interface QuestionOption {
	label: string;
	value: string;
}

interface Question {
	clientId: number;
	question_text: string;
	question_type: QuestionType;
	is_required: boolean;
	order_index: number;
	metadata: Record<string, any> | null;
}

let nextClientId = 1;

function createEmptyQuestion(order_index: number): Question {
	return {
		clientId: nextClientId++,
		question_text: "",
		question_type: "TEXT",
		is_required: false,
		order_index,
		metadata: null,
	};
}

function QuestionMetadataFields({
	question_type,
	metadata,
	onChange,
}: {
	question_type: QuestionType;
	metadata: Record<string, any> | null;
	onChange: (meta: Record<string, any> | null) => void;
}) {
	const m = metadata ?? {};

	const set = (key: string, value: any) => {
		const next = { ...m, [key]: value };
		onChange(Object.keys(next).length === 0 ? null : next);
	};

	switch (question_type) {
		case "TEXT":
		case "TEXTAREA":
			return (
				<div className="grid grid-cols-3 gap-4">
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
							Min Length
						</label>
						<input
							type="number"
							min={0}
							placeholder="0"
							value={(m as any).minLength ?? ""}
							onChange={(e) =>
								set(
									"minLength",
									e.target.value ? Number(e.target.value) : undefined,
								)
							}
							className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
							Max Length
						</label>
						<input
							type="number"
							min={0}
							placeholder="—"
							value={(m as any).maxLength ?? ""}
							onChange={(e) =>
								set(
									"maxLength",
									e.target.value ? Number(e.target.value) : undefined,
								)
							}
							className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
							Placeholder
						</label>
						<input
							type="text"
							placeholder="e.g. Your answer…"
							value={(m as any).placeholder ?? ""}
							onChange={(e) => set("placeholder", e.target.value || undefined)}
							className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
						/>
					</div>
				</div>
			);

		case "SELECT":
		case "MULTI_SELECT":
			return (
				<div className="space-y-3">
					<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
						Options
					</label>
					{((m as any).options as QuestionOption[] | undefined)?.map(
						(opt, idx) => (
							<div key={idx} className="flex items-center gap-3">
								<span className="text-xs font-semibold text-slate-400 w-5">
									{idx + 1}.
								</span>
								<input
									type="text"
									placeholder="Label"
									value={opt.label}
									onChange={(e) => {
										const next = [...((m as any).options ?? [])];
										next[idx] = { ...next[idx], label: e.target.value };
										set("options", next);
									}}
									className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
								/>
								<input
									type="text"
									placeholder="Value"
									value={opt.value}
									onChange={(e) => {
										const next = [...((m as any).options ?? [])];
										next[idx] = { ...next[idx], value: e.target.value };
										set("options", next);
									}}
									className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
								/>
								<button
									type="button"
									onClick={() => {
										const next = ((m as any).options ?? []).filter(
											(_: any, i: number) => i !== idx,
										);
										set("options", next.length ? next : undefined);
									}}
									className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
								>
									<span className="material-symbols-outlined text-[18px]">
										close
									</span>
								</button>
							</div>
						),
					)}
					<button
						type="button"
						onClick={() => {
							const next = [
								...((m as any).options ?? []),
								{ label: "", value: "" },
							];
							set("options", next);
						}}
						className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
					>
						<span className="material-symbols-outlined text-[18px]">add</span>
						Add Option
					</button>
				</div>
			);

		case "CHECKBOX":
			return (
				<div className="flex flex-col gap-1.5 max-w-xs">
					<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
						Label
					</label>
					<input
						type="text"
						placeholder="e.g. I agree to the terms"
						value={(m as any).label ?? ""}
						onChange={(e) => set("label", e.target.value || undefined)}
						className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
					/>
				</div>
			);

		case "FILE":
			return (
				<div className="grid grid-cols-2 gap-4">
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
							Max Size (MB)
						</label>
						<input
							type="number"
							min={0}
							step={0.5}
							placeholder="10"
							value={(m as any).maxSizeMB ?? ""}
							onChange={(e) =>
								set(
									"maxSizeMB",
									e.target.value ? Number(e.target.value) : undefined,
								)
							}
							className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
							Allowed Types
						</label>
						<input
							type="text"
							placeholder="pdf, doc, png"
							value={((m as any).allowedTypes ?? []).join(", ")}
							onChange={(e) => {
								const types = e.target.value
									.split(",")
									.map((s) => s.trim())
									.filter(Boolean);
								set("allowedTypes", types.length ? types : undefined);
							}}
							className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
						/>
					</div>
				</div>
			);
	}
}

export default function CreateForm() {
	const { clubId, inductionId } = useParams();
	const navigate = useNavigate();
	const { isAdmin } = useOutletContext<any>();

	const [progress, setProgress] = useState(0);
	const [formTitle, setFormTitle] = useState("");
	const [formDescription, setFormDescription] = useState("");
	const [questions, setQuestions] = useState<Question[]>([]);

	useEffect(() => {
		if (!isAdmin) navigate(`my-clubs/${clubId}`);
		const timer = setTimeout(() => setProgress(75), 100);
		return () => clearTimeout(timer);
	}, []);

	const addQuestion = () => {
		setQuestions((prev) => [...prev, createEmptyQuestion(prev.length + 1)]);
	};

	const removeQuestion = (clientId: number) => {
		setQuestions((prev) => {
			const next = prev
				.filter((q) => q.clientId !== clientId)
				.map((q, i) => ({ ...q, order_index: i + 1 }));
			return next;
		});
	};

	const updateQuestion = (clientId: number, patch: Partial<Question>) => {
		setQuestions((prev) =>
			prev.map((q) => (q.clientId === clientId ? { ...q, ...patch } : q)),
		);
	};

	const handleSave = (publish = false) => {
		const payload = {
			form: {
				title: formTitle,
				description: formDescription || null,
			},
			questions: questions.map(({ clientId: _cid, order_index, ...q }) => ({
				...q,
				order_index,
				metadata:
					q.metadata && Object.keys(q.metadata).length > 0 ? q.metadata : null,
			})),
		};
		console.log("Form payload:", JSON.stringify(payload, null, 2));
		if (publish) {
			navigate(`/my-clubs/${clubId}/${inductionId}/publish`);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center py-12 px-4 md:px-6 bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
			<style
				dangerouslySetInnerHTML={{
					__html: `
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            vertical-align: middle;
        }
      `,
				}}
			/>

			<main className="w-full max-w-[800px]">
				{/* Progress Stepper */}
				<div className="mb-8 px-2">
					<div className="flex justify-between items-center mb-2">
						<span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">
							Step 3 of 4
						</span>
						<span className="text-xs font-semibold text-slate-500">
							75% Complete
						</span>
					</div>
					<div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
						<div
							className="h-full bg-indigo-600 rounded-full transition-all duration-700 ease-out"
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>

				{/* Form Builder Card */}
				<div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 md:p-8 space-y-8">
					{/* Header */}
					<section className="space-y-6">
						<div>
							<h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
								Build Your Induction Form
							</h2>
							<p className="text-base text-slate-600">
								Define the fields and requirements for new member registration.
							</p>
						</div>

						<div className="grid grid-cols-1 gap-6">
							<div className="flex flex-col gap-2 group">
								<label className="text-sm font-medium text-slate-900 group-focus-within:text-indigo-600 transition-colors">
									Form Title
								</label>
								<input
									className="w-full p-4 border border-slate-300 rounded-lg text-base text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-shadow"
									placeholder="e.g., Chess Club Annual Membership"
									type="text"
									value={formTitle}
									onChange={(e) => setFormTitle(e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-2 group">
								<label className="text-sm font-medium text-slate-900 group-focus-within:text-indigo-600 transition-colors">
									Form Description
								</label>
								<textarea
									className="w-full p-4 border border-slate-300 rounded-lg text-base text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-shadow resize-none"
									placeholder="Provide instructions for applicants..."
									rows={3}
									value={formDescription}
									onChange={(e) => setFormDescription(e.target.value)}
								/>
							</div>
						</div>
					</section>

					{/* Questions */}
					<section className="space-y-6">
						<div className="flex justify-between items-center">
							<h3 className="text-xl font-semibold text-slate-900">
								Questions
							</h3>
							<span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
								{questions.length} Question{questions.length !== 1 ? "s" : ""}{" "}
								Added
							</span>
						</div>

						{questions.length === 0 && (
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
									<span className="material-symbols-outlined text-[18px]">
										add
									</span>
									Add Question
								</button>
							</div>
						)}

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
												Question {q.order_index}
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
														question_text: e.target.value,
													})
												}
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
															metadata: null,
														})
													}
													className="w-full p-3 border border-slate-300 rounded-lg text-base text-slate-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-shadow cursor-pointer"
												>
													{QUESTION_TYPES.map((t) => (
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
					</section>

					{/* Footer */}
					<footer className="pt-6 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-100">
						<button
							type="button"
							onClick={() =>
								navigate(`/my-clubs/${clubId}/${inductionId}/add-stages`)
							}
							className="order-2 md:order-1 flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium px-4 py-2 rounded-lg transition-colors active:scale-95"
						>
							<span className="material-symbols-outlined text-[20px]">
								arrow_back
							</span>
							Back to Step 2
						</button>
						<div className="order-1 md:order-2 flex items-center gap-4 w-full md:w-auto">
							<button
								type="button"
								onClick={() => handleSave(false)}
								className="flex-1 md:flex-none px-6 py-2.5 text-slate-700 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors active:scale-95"
							>
								Save as Draft
							</button>
							<button
								type="button"
								onClick={() => handleSave(true)}
								className="flex-1 md:flex-none bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:opacity-95 transition-all active:scale-95"
							>
								Continue to Step 4
								<span className="material-symbols-outlined text-[20px]">
									arrow_forward
								</span>
							</button>
						</div>
					</footer>
				</div>

				<div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
					<span className="material-symbols-outlined text-[16px]">info</span>
					<p className="text-[12px] font-semibold uppercase tracking-wider">
						Changes are auto-saved to cloud
					</p>
				</div>
			</main>
		</div>
	);
}
