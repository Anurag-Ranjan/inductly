import { useState } from "react";
import { toast } from "react-toastify";
import { useScoreApplicantMutation } from "../../../../../features/application/applicationApi";
import Icon from "../Icon/Icon";

const ScoringDrawer = ({
	open,
	onClose,
	clubId,
	applicationId,
	stageId,
	applicantName,
	stageName,
}: {
	open: boolean;
	onClose: () => void;
	clubId?: number;
	applicationId?: number;
	stageId?: number;
	applicantName?: string;
	stageName?: string;
}) => {
	const [score, setScore] = useState(5);
	const [notes, setNotes] = useState("");
	const [recommendation, setRecommendation] = useState("PASSED");

	const [scoreApplicant, { isLoading }] = useScoreApplicantMutation();

	const handleSave = async () => {
		if (!applicationId || !stageId || !clubId) return;
		try {
			await scoreApplicant({
				applicationId,
				stageId,
				clubId,
				body: {
					status: recommendation,
					notes,
					score,
				},
			}).unwrap();
			toast.success("Applicant scored successfully");
			onClose();
		} catch {
			toast.error("Failed to score applicant");
		}
	};

	return (
		<>
			<div
				onClick={onClose}
				className={`fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${
					open
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
			/>

			<div
				className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-out ${
					open ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="p-6 border-b border-[#c7c4d8] flex items-center justify-between">
					<div>
						<h3 className="text-xl font-semibold text-[#1b1b24]">
							Score Applicant
						</h3>
						<p className="text-sm text-[#464555] mt-0.5">
							{stageName ?? "Current Stage"} Phase
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-[#eae6f4] rounded-full transition-colors active:scale-95"
					>
						<Icon name="close" className="w-5 h-5 text-[#1b1b24]" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#e2dfff] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
					<div className="flex items-center gap-4 p-4 bg-[#f5f2ff] rounded-xl">
						<div className="w-14 h-14 rounded-full bg-violet-200 text-violet-800 flex items-center justify-center font-semibold text-lg shrink-0">
							{applicantName
								?.split(" ")
								.map((n: string) => n[0])
								.join("")
								.slice(0, 2)
								.toUpperCase() ?? "NA"}
						</div>
						<div>
							<p className="text-xl font-semibold text-[#1b1b24]">
								{applicantName ?? "N/A"}
							</p>
							<p className="text-sm text-[#712ae2]">
								Candidate ID: #{applicationId}
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium text-[#1b1b24]">
							Overall Numeric Score
						</label>
						<div className="flex items-center gap-3">
							<input
								type="number"
								min={0}
								max={10}
								step={0.1}
								value={score}
								onChange={(e) => setScore(Number(e.target.value))}
								className="w-32 px-4 py-2 bg-white border border-[#777587] rounded-lg text-2xl font-semibold text-[#3525cd] focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
							/>
							<span className="text-xl font-semibold text-[#464555]">/ 10</span>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium text-[#1b1b24]">
							Review Notes
						</label>
						<textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							rows={6}
							placeholder="Write detailed feedback on the technical interview performance..."
							className="w-full p-4 bg-white border border-[#777587] rounded-lg text-sm text-[#1b1b24] focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium text-[#1b1b24]">
							Final Recommendation
						</label>
						<div className="grid grid-cols-2 gap-4">
							<button
								onClick={() => setRecommendation("PASSED")}
								className={`flex items-center justify-center gap-2 p-4 border-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
									recommendation === "PASSED"
										? "border-emerald-500 bg-emerald-50 text-emerald-700"
										: "border-[#c7c4d8] hover:border-emerald-400 hover:bg-emerald-50/50 text-[#464555]"
								}`}
							>
								<Icon
									name="check_circle"
									className="w-5 h-5"
									filled={recommendation === "PASSED"}
								/>
								Passed
							</button>
							<button
								onClick={() => setRecommendation("FAILED")}
								className={`flex items-center justify-center gap-2 p-4 border-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
									recommendation === "FAILED"
										? "border-red-500 bg-red-50 text-red-700"
										: "border-[#c7c4d8] hover:border-red-400 hover:bg-red-50/50 text-[#464555]"
								}`}
							>
								<Icon name="cancel" className="w-5 h-5" />
								Failed
							</button>
						</div>
					</div>
				</div>

				<div className="p-6 bg-[#f5f2ff] border-t border-[#c7c4d8] flex gap-4">
					<button
						onClick={onClose}
						disabled={isLoading}
						className="flex-1 px-4 py-2 border border-[#c7c4d8] hover:bg-[#eae6f4] rounded-lg text-sm font-medium transition-all active:scale-95 disabled:opacity-50"
					>
						Discard
					</button>
					<button
						onClick={handleSave}
						disabled={isLoading || !applicationId || !stageId}
						className="flex-1 px-4 py-2 bg-[#3525cd] text-white hover:opacity-90 rounded-lg text-sm font-medium shadow-md shadow-indigo-300/30 transition-all active:scale-95 disabled:opacity-50"
					>
						{isLoading ? "Saving..." : "Save Review"}
					</button>
				</div>
			</div>
		</>
	);
};

export default ScoringDrawer;
