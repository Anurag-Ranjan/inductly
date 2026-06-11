import { Navigate, useParams, useNavigate } from "react-router";
import {
	useGetFormForApplicantQuery,
	useUploadFileMutation,
	useSaveFormDraftMutation,
	useSubmitApplicationMutation,
} from "../../../features/response/responseApi";
import Loader from "../../../components/loaders/Loader";
import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import FormHeader from "../../../features/response/components/FormHeader";
import FormQuestionCards from "../../../features/response/components/FormQuestionCards";
import ApplicationSubmitted from "../../../features/response/components/ApplicationSubmitted";

export default function Apply() {
	const { formId, clubId, inductionId } = useParams();
	const navigate = useNavigate();

	const [answers, setAnswers] = useState<
		{ question_id: number; answer: string }[]
	>([]);
	const [isSaving, setIsSaving] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const {
		data: result,
		isLoading,
		error,
	} = useGetFormForApplicantQuery({
		clubId: Number(clubId),
		formId: Number(formId),
		inductionId: Number(inductionId),
	});

	const formData = result?.data;
	const [uploadFile] = useUploadFileMutation();
	const [saveFormDraft] = useSaveFormDraftMutation();
	const [submitApplication] = useSubmitApplicationMutation();

	useEffect(() => {
		if (!formData) return;
		if (formData.hasApplied) {
			setIsSubmitted(true);
			return;
		}
		if (formData.response?.answers) {
			setAnswers(
				formData.response.answers.map(
					(a: { question_id: number; answer: string }) => ({
						question_id: a.question_id,
						answer: a.answer,
					}),
				),
			);
		}
	}, [formData]);

	const handleSaveDraft = async () => {
		setIsSaving(true);
		try {
			await saveFormDraft({
				clubId: Number(clubId),
				inductionId: Number(inductionId),
				formId: Number(formId),
				formAnswers: answers,
			}).unwrap();
			toast.success("Draft saved successfully");
			navigate("/open-inductions");
		} catch {
			toast.error("Failed to save draft. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleSubmitApplication = async () => {
		setIsSubmitting(true);
		try {
			await submitApplication({
				clubId: Number(clubId),
				inductionId: Number(inductionId),
				formId: Number(formId),
				formAnswers: answers,
			}).unwrap();
			setIsSubmitted(true);
		} catch {
			toast.error("Failed to submit application. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleFileUpload = useCallback(
		async (
			questionId: number,
			file: File,
			allowedTypes: string[],
			maxSizeMB: number,
		): Promise<string | null> => {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("allowedTypes", JSON.stringify(allowedTypes));
			formData.append("maxSizeMB", String(maxSizeMB));

			try {
				const res = await uploadFile({
					clubId: Number(clubId),
					inductionId: Number(inductionId),
					formId: Number(formId),
					formData,
				}).unwrap();

				return res?.data?.secure_url ?? null;
			} catch {
				return null;
			}
		},
		[clubId, inductionId, formId, uploadFile],
	);

	if (isSubmitted) return <ApplicationSubmitted />;

	if (isLoading) return <Loader />;
	if (error) return <Navigate to="/open-inductions" replace />;

	if (!formId || !clubId || !inductionId || formId === "null") {
		return <Navigate to="/open-inductions" replace />;
	}

	const handleAnswer = (questionId: number, answer: string) => {
		setAnswers((prev) => {
			const existing = prev.find((a) => a.question_id === questionId);
			if (existing) {
				return prev.map((a) =>
					a.question_id === questionId ? { ...a, answer } : a,
				);
			}
			return [...prev, { question_id: questionId, answer }];
		});
	};

	return (
		<div className="bg-[#fcf8ff] text-[#1b1b24] antialiased min-h-screen pb-32 font-['Inter',sans-serif] relative z-0">
			<style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          vertical-align: middle;
        }
      `}</style>

			<div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-40">
				<div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#4f46e5] blur-[120px] opacity-20"></div>
				<div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-[#712ae2] blur-[100px] opacity-10"></div>
			</div>

			<main className="max-w-[720px] mx-auto px-4 md:px-0 py-8 space-y-8">
				{formData && (
					<FormHeader
						clubName={formData.clubName}
						clubLogo={formData.clubLogo}
						formTitle={formData.formTitle}
						formDescription={formData.formDescription}
					/>
				)}

				{(formData?.questions || []).map((q: any) => (
					<FormQuestionCards
						key={q.id}
						question={q}
						onAnswer={handleAnswer}
						onFileUpload={handleFileUpload}
						value={answers.find((a) => a.question_id === q.id)?.answer || ""}
					/>
				))}
			</main>

			<footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#c7c4d8] z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
				<div className="max-w-[720px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between py-4 gap-4">
					<div className="flex items-center gap-2 text-[#777587] order-2 md:order-1">
						<span
							className="material-symbols-outlined text-[20px] text-emerald-500 animate-pulse"
							style={{ fontVariationSettings: "'FILL' 1" }}
						>
							check_circle
						</span>
						<span className="text-sm">Draft saved automatically</span>
					</div>

					<div className="flex items-center w-full md:w-auto order-1 md:order-2 gap-4">
						<button
							onClick={handleSaveDraft}
							disabled={isSaving}
							className="flex-1 md:flex-none px-6 py-3 rounded-lg border border-[#777587] text-[#1b1b24] font-semibold text-base hover:bg-[#f5f2ff] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{isSaving ? (
								<>
									<svg
										className="animate-spin h-5 w-5"
										viewBox="0 0 24 24"
										fill="none"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
										/>
									</svg>
									Saving...
								</>
							) : (
								"Save as Draft"
							)}
						</button>
						<button
							onClick={handleSubmitApplication}
							disabled={isSubmitting}
							className="flex-1 md:flex-none px-6 py-3 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#712ae2] text-white font-semibold text-base shadow-lg shadow-[#3525cd]/20 hover:shadow-[#3525cd]/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{isSubmitting ? (
								<>
									<svg
										className="animate-spin h-5 w-5"
										viewBox="0 0 24 24"
										fill="none"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
										/>
									</svg>
									Submitting...
								</>
							) : (
								"Submit Application"
							)}
						</button>
					</div>
				</div>
			</footer>
		</div>
	);
}
