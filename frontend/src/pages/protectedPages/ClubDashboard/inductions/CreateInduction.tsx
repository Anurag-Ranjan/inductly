import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { toast } from "react-toastify";
import {
	useCreateInductionMutation,
	useGetInductionDetailsQuery,
	useUpdateInductionDetailsMutation,
} from "../../../../features/induction/inductionApi";
import Loader from "../../../../components/loaders/Loader";

export default function CreateInduction() {
	const { clubId, inductionId } = useParams();
	const { isAdmin } = useOutletContext<any>();
	const navigate = useNavigate();
	const [createInduction, { isLoading: isCreating }] =
		useCreateInductionMutation();
	const [updateInductionDetails, { isLoading: isUpdating }] =
		useUpdateInductionDetailsMutation();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [isSavingDraft, setIsSavingDraft] = useState(false);

	const isEditing = !!inductionId;

	const { data: details } = useGetInductionDetailsQuery(
		{ clubId: clubId!, inductionId: inductionId! },
		{ skip: !isEditing },
	);

	useEffect(() => {
		if (!isAdmin) navigate(`/my-clubs/${clubId}`, { replace: true });
	}, [isAdmin, clubId, navigate]);

	useEffect(() => {
		if (details?.data) {
			setTitle(details.data.title ?? "");
			setDescription(details.data.description ?? "");
		}
	}, [details]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (isEditing) {
				await updateInductionDetails({
					clubId: Number(clubId),
					inductionId: Number(inductionId),
					body: { title, description },
				}).unwrap();
				navigate(`/my-clubs/${clubId}/${inductionId}/add-stages`);
			} else {
				const response = await createInduction({
					body: { title, description },
					clubId: Number(clubId),
				}).unwrap();
				const newInductionId = response.data.id;
				navigate(`/my-clubs/${clubId}/${newInductionId}/add-stages`);
			}
		} catch (err) {
			console.error("Failed to save induction:", err);
		}
	};

	const handleSaveDraft = async () => {
		setIsSavingDraft(true);
		try {
			if (isEditing) {
				await updateInductionDetails({
					clubId: Number(clubId),
					inductionId: Number(inductionId),
					body: { title, description },
				}).unwrap();
			} else {
				await createInduction({
					body: { title, description },
					clubId: Number(clubId),
				}).unwrap();
			}
			toast.success("Draft saved successfully");
			navigate(`/my-clubs/${clubId}`);
		} catch {
			toast.error("Failed to save draft");
		} finally {
			setIsSavingDraft(false);
		}
	};

	return (
		<>
			{(isCreating || isUpdating || isSavingDraft) && <Loader />}
			<div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 bg-slate-50 font-sans relative z-0 selection:bg-indigo-100 selection:text-indigo-900">
			{/* Material Symbols Import */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `,
				}}
			/>

			{/* Visual Polish: Ambient Decorative Background Element */}
			<div className="fixed top-0 left-0 -z-10 w-full h-full pointer-events-none overflow-hidden">
				<div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-3xl"></div>
			</div>

			{/* Top Branding Anchor */}
			<div className="mb-8 flex flex-col items-center">
				<span className="text-3xl font-bold text-indigo-700 tracking-tight">
					Inductly
				</span>
				<p className="text-sm text-slate-600 mt-1">
					Empowering Excellence through Induction
				</p>
			</div>

			{/* Main Content Canvas */}
			<main className="w-full max-w-[560px]">
				<div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-slate-200">
					{/* Progress Section */}
					<div className="px-8 pt-8 pb-6 border-b border-slate-100">
						<div className="flex justify-between items-end mb-2">
							<span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">
								Step 1 of 4
							</span>
							<span className="text-sm font-medium text-slate-500">
								Basic Details • 25% Complete
							</span>
						</div>
						{/* Progress Stepper Component */}
						<div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1 mt-3">
							<div className="h-full w-1/4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
							<div className="h-full w-1/4 bg-slate-200 rounded-full"></div>
							<div className="h-full w-1/4 bg-slate-200 rounded-full"></div>
							<div className="h-full w-1/4 bg-slate-200 rounded-full"></div>
						</div>
					</div>

					{/* Form Content */}
					<form className="p-8 space-y-8" onSubmit={handleSubmit}>
						{/* Header */}
						<div className="space-y-1">
							<h1 className="text-xl font-semibold text-slate-900">
								{isEditing
									? "Update induction details"
									: "Start your new induction"}
							</h1>
							<p className="text-base text-slate-600">
								{isEditing
									? "Modify the basic information of your induction program."
									: "Fill in the basic information to define your induction program's identity."}
							</p>
						</div>

						{/* Input Fields */}
						<div className="space-y-6">
							{/* Title Field */}
							<div className="group">
								<label
									className="block text-sm font-medium text-slate-900 mb-1 group-focus-within:text-indigo-600 transition-colors"
									htmlFor="induction-title"
								>
									Induction Title
								</label>
								<div className="relative">
									<input
										className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
										id="induction-title"
										name="induction_title"
										placeholder="e.g. Science Club Membership 2024"
										type="text"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										required
									/>
								</div>
								<p className="mt-1 text-xs font-medium text-slate-500">
									Keep it clear and professional for your candidates.
								</p>
							</div>

							{/* Description Field */}
							<div className="group">
								<label
									className="block text-sm font-medium text-slate-900 mb-1 group-focus-within:text-indigo-600 transition-colors"
									htmlFor="induction-description"
								>
									Induction Description
								</label>
								<div className="relative">
									<textarea
										className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all resize-none"
										id="induction-description"
										name="induction_description"
										placeholder="Describe the purpose, requirements, and what candidates should expect from this induction process..."
										rows={4}
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										required
									></textarea>
								</div>
							</div>
						</div>

						{/* Action Footer */}
						<div className="pt-6 flex items-center justify-between border-t border-slate-100">
							<button
								onClick={handleSaveDraft}
								disabled={isSavingDraft}
								className="px-6 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
								type="button"
							>
								Save as Draft
							</button>
							<button
								className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-2.5 rounded-lg text-sm font-medium text-white shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
								type="submit"
								disabled={isCreating || isUpdating}
							>
								<span>{isEditing ? "Edit Stages" : "Add Stages"}</span>
								<span className="material-symbols-outlined text-[18px]">
									arrow_forward
								</span>
							</button>
						</div>
					</form>
				</div>

				{/* Utility Links */}
				<div className="mt-6 flex justify-center gap-6">
					<a
						className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
						href="#"
					>
						Need Help?
					</a>
					<a
						className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
						href="#"
					>
						Exit Creator
					</a>
				</div>
			</main>
		</div>
		</>
	);
}
