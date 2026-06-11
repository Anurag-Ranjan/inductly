import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { QUESTION_TYPES } from "./constants";
import {
	useCreateFormMutation,
	useCreateQuestionsMutation,
	useDeleteQuestionMutation,
	useGetFormByInductionQuery,
	useUpdateFormMutation,
	useUpdateQuestionMutation,
} from "../../../../../features/form/formApi";
import type { Question } from "../../../../../features/forms/types/forms.types";
import Loader from "../../../../../components/loaders/Loader";
import { createEmptyQuestion } from "../../../../../features/forms/services/createQuestions";
import QuestionCard from "../../../../../features/forms/components/QuestionCard";

export default function CreateForm() {
	const [createQuestions] = useCreateQuestionsMutation();
	const [updateQuestions] = useUpdateQuestionMutation();
	const [deleteQuestion] = useDeleteQuestionMutation();
	const [updateForm] = useUpdateFormMutation();
	const [createForm, { isLoading: isCreatingForm }] = useCreateFormMutation();
	const { clubId, inductionId } = useParams();
	const navigate = useNavigate();
	const { isAdmin } = useOutletContext<any>();
	const { data, isLoading: isFetchingForm } = useGetFormByInductionQuery({
		clubId: Number(clubId),
		inductionId: Number(inductionId),
	});

	const [formId, setFormId] = useState<number | null>(null);
	const [progress, setProgress] = useState(0);
	const [formTitle, setFormTitle] = useState("");
	const [formDescription, setFormDescription] = useState("");
	const [questions, setQuestions] = useState<Question[]>([]);

	const initialFormTitleRef = useRef("");
	const initialFormDescriptionRef = useRef("");
	const syncingRef = useRef(false);
	const needsReSync = useRef(false);

	useEffect(() => {
		if (!isAdmin) navigate(`my-clubs/${clubId}`);
	}, [isAdmin, navigate]);

	useEffect(() => {
		const timer = setTimeout(() => setProgress(75), 100);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (isFetchingForm || !data || formId) return;

		if (data.data) {
			const form = data.data;
			setFormId(form.id);
			setFormTitle(form.title ?? "");
			setFormDescription(form.description ?? "");

			initialFormTitleRef.current = form.title ?? "";
			initialFormDescriptionRef.current = form.description ?? "";

			if (form.questions?.length) {
				setQuestions(
					form.questions.map((q: any) => ({
						clientId: crypto.randomUUID(),
						id: q.id,
						syncStatus: "synced" as const,
						version: 0,
						question_text: q.question_text,
						question_type: q.question_type,
						is_required: q.is_required,
						order_index: q.order_index,
						metadata: q.metadata,
					})),
				);
			}

		} else {
			createForm({
				clubId: Number(clubId),
				inductionId: Number(inductionId),
				body: { title: "Untitled", description: "" },
			})
				.unwrap()
				.then((res) => {
					setFormId(res.data.id);
					initialFormTitleRef.current = "";
					initialFormDescriptionRef.current = "";
				})
				.catch((err) => {
					console.error("Failed to create form:", err);
				});
		}
	}, [data]);

	const addQuestion = () => {
		setQuestions((prev) => [...prev, createEmptyQuestion(prev.length + 1)]);
	};

	const removeQuestion = (clientId: string) => {
		setQuestions(
			(prev) =>
				prev
					.map((q) => {
						if (q.clientId !== clientId) return q;
						if (!q.id) return null;
						return { ...q, syncStatus: "pending_delete" };
					})
					.filter(Boolean) as Question[],
		);
		syncForm();
	};

	const updateQuestion = (clientId: string, patch: Partial<Question>) => {
		setQuestions((prev) =>
			prev.map((q) => {
				if (q.clientId !== clientId) return q;
				return {
					...q,
					...patch,
					version: q.version + 1,
					syncStatus:
						q.syncStatus === "pending_create"
							? "pending_create"
							: "pending_update",
				};
			}),
		);
	};

	const handleSave = (publish = false) => {};

	async function syncForm() {
		if (syncingRef.current || !formId) {
			needsReSync.current = true;
			return;
		}

		syncingRef.current = true;
		needsReSync.current = false;

		const creates = questions.filter((q) => q.syncStatus === "pending_create");
		const updates = questions.filter((q) => q.syncStatus === "pending_update");
		const deletes = questions.filter((q) => q.syncStatus === "pending_delete");
		const metadataChanged =
			formTitle !== initialFormTitleRef.current ||
			formDescription !== initialFormDescriptionRef.current;

		const updateVersions = new Map<string, number>();
		for (const q of updates) {
			updateVersions.set(q.clientId, q.version);
		}

		try {
			if (creates.length) {
				const result = await createQuestions({
					clubId: Number(clubId),
					inductionId: Number(inductionId),
					formId,
					body: creates.map(({ clientId, syncStatus, ...rest }) => ({
						...rest,
						metadata: rest.metadata ?? {},
					})),
				}).unwrap();

				const createdData = result.data || result;
				if (Array.isArray(createdData)) {
					setQuestions((prev) =>
						prev.map((q) => {
							if (q.syncStatus !== "pending_create") return q;
							const created = createdData.find(
								(r: any) => r.clientId === q.clientId,
							);
							if (!created) {
								return q;
							}
							return { ...q, id: created.id, syncStatus: "synced" };
						}),
					);
				}
			}

			if (updates.length) {
				await Promise.all(
					updates.map((update) =>
						updateQuestions({
							clubId: Number(clubId),
							inductionId: Number(inductionId),
							formId,
							questionId: Number(update.id),
							body: {
								question_text: update.question_text,
								question_type: update.question_type,
								is_required: update.is_required,
								order_index: update.order_index,
								metadata: update.metadata,
							},
						}).unwrap(),
					),
				);

				setQuestions((prev) =>
					prev.map((q) => {
						const syncedVersion = updateVersions.get(q.clientId);
						if (
							syncedVersion !== undefined &&
							q.version === syncedVersion
						) {
							return { ...q, syncStatus: "synced" };
						}
						return q;
					}),
				);
			}

			if (deletes.length) {
				await Promise.all(
					deletes.map((question) =>
						deleteQuestion({
							clubId: Number(clubId),
							inductionId: Number(inductionId),
							formId,
							questionId: Number(question.id),
						}).unwrap(),
					),
				);

				setQuestions((prev) =>
					prev.filter((q) => q.syncStatus !== "pending_delete"),
				);
			}

			if (metadataChanged) {
				await updateForm({
					clubId: Number(clubId),
					inductionId: Number(inductionId),
					formId,
					body: {
						title: formTitle,
						description: formDescription,
					},
				}).unwrap();

				initialFormTitleRef.current = formTitle;
				initialFormDescriptionRef.current = formDescription;
			}
		} catch (error) {
			console.error("Autosave failed:", error);
		} finally {
			syncingRef.current = false;
			if (needsReSync.current) {
				needsReSync.current = false;
				syncForm();
			}
		}
	}

	if (isFetchingForm || isCreatingForm) return <Loader />;

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
									onBlur={() => syncForm()}
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
									onBlur={() => syncForm()}
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

						<QuestionCard
							questions={questions.filter(
								(q) => q.syncStatus !== "pending_delete",
							)}
							questionTypes={QUESTION_TYPES}
							addQuestion={addQuestion}
							removeQuestion={removeQuestion}
							updateQuestion={updateQuestion}
							onSaveForm={syncForm}
						/>
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
