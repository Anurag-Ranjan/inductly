import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
	useGetStagesQuery,
	useCreateStagesMutation,
} from "../../../../features/induction/inductionApi";
import Loader from "../../../../components/loaders/Loader";

export default function CreateStages() {
	const { clubId, inductionId } = useParams();
	const navigate = useNavigate();
	const { data, isLoading } = useGetStagesQuery({
		clubId: Number(clubId),
		inductionId: Number(inductionId),
	});
	const [createStages, { isLoading: isCreating }] = useCreateStagesMutation();
	const stages = data?.data ?? [];

	const [newStages, setNewStages] = useState([{ name: "", description: "" }]);

	const addStageField = () => {
		setNewStages([...newStages, { name: "", description: "" }]);
	};

	const updateStageField = (
		index: number,
		field: "name" | "description",
		value: string,
	) => {
		const updated = [...newStages];
		updated[index][field] = value;
		setNewStages(updated);
	};

	const handleSubmit = async () => {
		const valid = newStages.filter((s) => s.name.trim());
		if (valid.length === 0) return;

		const body = valid.map((s, i) => ({
			name: s.name.trim(),
			description: s.description.trim() || null,
			order_index: stages.length + i + 1,
		}));

		try {
			await createStages({
				clubId: Number(clubId),
				inductionId: Number(inductionId),
				body,
			}).unwrap();
			setNewStages([{ name: "", description: "" }]);
		} catch (err) {
			console.error("Failed to create stages:", err);
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
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

			<main className="flex-grow flex flex-col items-center py-8 px-4 md:px-6">
				<div className="w-full max-w-3xl mb-8">
					<div className="flex justify-between items-end mb-2">
						<div>
							<span className="text-indigo-600 font-bold text-sm tracking-wide uppercase">
								Step 2 of 4
							</span>
							<h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mt-1">
								Define Induction Stages
							</h1>
						</div>
						<span className="text-slate-600 text-sm font-medium">
							{stages.length > 0
								? `${stages.length} stage${stages.length > 1 ? "s" : ""} defined`
								: "No stages yet"}
						</span>
					</div>
					<div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
						<div
							className="h-full bg-indigo-600 transition-all duration-700 ease-out"
							style={{ width: `${Math.min(stages.length * 25, 100)}%` }}
						></div>
					</div>
					<p className="text-slate-600 mt-4 text-base">
						Create the sequential steps for your induction process (e.g., Online
						Test, Technical Interview).
					</p>
				</div>

				{isLoading ? (
					<Loader />
				) : stages.length === 0 && newStages.every((s) => !s.name.trim()) ? (
					<div className="w-full max-w-3xl flex flex-col items-center justify-center py-16 text-center">
						<div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
							<span className="material-symbols-outlined text-4xl text-slate-400">
								layers
							</span>
						</div>
						<h3 className="text-xl font-semibold text-slate-900 mb-2">
							No stages defined yet
						</h3>
						<p className="text-base text-slate-500 max-w-md">
							Start by adding the first stage of your induction process below.
						</p>
					</div>
				) : (
					<div className="w-full max-w-3xl space-y-6">
						{stages.map((stage) => (
							<div
								key={stage.id}
								className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden"
							>
								<div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>
								<div className="flex justify-between items-start mb-4">
									<div className="flex items-center gap-2">
										<div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
											{stage.order_index}
										</div>
										<span className="text-sm font-medium text-slate-600 uppercase tracking-widest">
											{stage.name}
										</span>
									</div>
								</div>
								{stage.description && (
									<p className="text-sm text-slate-500 ml-10">
										{stage.description}
									</p>
								)}
							</div>
						))}
					</div>
				)}

				{/* New Stage Form */}
				<div className="w-full max-w-3xl mt-8 space-y-6">
					<h3 className="text-lg font-semibold text-slate-900">
						Add New Stages
					</h3>
					{newStages.map((s, index) => (
						<div
							key={index}
							className="bg-white border-slate-300 rounded-xl p-6 border-dashed border-2"
						>
							<div className="flex justify-between items-start mb-4">
								<div className="flex items-center gap-2">
									<div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">
										{stages.length + index + 1}
									</div>
									<span className="text-sm font-medium text-slate-500 uppercase tracking-widest italic">
										New Stage
									</span>
								</div>
								{newStages.length > 1 && (
									<button
										type="button"
										onClick={() =>
											setNewStages(newStages.filter((_, i) => i !== index))
										}
										className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
									>
										<span className="material-symbols-outlined text-[20px]">
											delete
										</span>
									</button>
								)}
							</div>
							<div className="space-y-4">
								<div>
									<label className="block text-xs font-semibold text-slate-600 mb-1 ml-1">
										Stage Name
									</label>
									<input
										className="w-full bg-white border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-lg px-4 py-2 text-base text-slate-900 outline-none placeholder:text-slate-400"
										placeholder="e.g. Technical Interview"
										type="text"
										value={s.name}
										onChange={(e) =>
											updateStageField(index, "name", e.target.value)
										}
									/>
								</div>
								<div>
									<label className="block text-xs font-semibold text-slate-600 mb-1 ml-1">
										Stage Description
									</label>
									<textarea
										className="w-full bg-white border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-lg px-4 py-2 text-base text-slate-900 outline-none resize-none placeholder:text-slate-400"
										placeholder="Describe the purpose and format of this stage..."
										rows={3}
										value={s.description}
										onChange={(e) =>
											updateStageField(index, "description", e.target.value)
										}
									></textarea>
								</div>
							</div>
						</div>
					))}

					<button
						type="button"
						onClick={addStageField}
						className="w-full py-8 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all group active:scale-[0.98]"
					>
						<div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
							<span className="material-symbols-outlined text-[32px]">add</span>
						</div>
						<span className="text-sm font-bold">Add Another Stage</span>
						<span className="text-xs font-medium opacity-70">
							Define the next step in your workflow
						</span>
					</button>
				</div>

				{/* Bottom Navigation */}
				<div className="w-full max-w-3xl mt-12 pt-6 border-t border-slate-200 flex justify-between items-center">
					<button
						onClick={() => navigate(`/my-clubs/${clubId}/create-induction`)}
						className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors active:scale-95"
					>
						<span className="material-symbols-outlined text-[20px]">
							arrow_back
						</span>
						Back to Step 1
					</button>
					<button
						onClick={handleSubmit}
						disabled={isCreating || newStages.every((s) => !s.name.trim())}
						className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isCreating ? (
							<>
								<svg
									className="animate-spin h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
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
								<span>Saving...</span>
							</>
						) : (
							<>
								<span>Save Stages</span>
								<span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
									arrow_forward
								</span>
							</>
						)}
					</button>
				</div>
			</main>

			<footer className="py-4 px-6 bg-slate-100 border-t border-slate-200 mt-auto">
				<div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-1.5">
							<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
							<span>System Online</span>
						</div>
						<div className="h-3 w-px bg-slate-300 hidden sm:block"></div>
						<div className="hidden sm:flex items-center gap-1.5">
							<span className="material-symbols-outlined text-[16px]">
								cloud_done
							</span>
							<span>Changes are auto-saved to cloud</span>
						</div>
					</div>
					<div>© 2024 Inductly LMS. All rights reserved.</div>
				</div>
			</footer>
		</div>
	);
}