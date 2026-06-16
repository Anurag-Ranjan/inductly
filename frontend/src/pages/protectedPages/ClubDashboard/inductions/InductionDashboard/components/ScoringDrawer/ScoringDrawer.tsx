import { useState } from "react";
import Icon from "../Icon/Icon";

const ScoringDrawer = ({ open, onClose }) => {
	const [score, setScore] = useState(8.5);
	const [notes, setNotes] = useState(
		"Excellent problem-solving skills demonstrated during the algorithm challenge. Strong grasp of React hooks and state management. Communication was clear, although slightly hesitant on system design questions.",
	);
	const [recommendation, setRecommendation] = useState("passed");
	const [criteria, setCriteria] = useState({
		coding: true,
		logic: true,
		culture: false,
	});

	return (
		<>
			{/* Overlay */}
			<div
				onClick={onClose}
				className={`fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${
					open
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
			/>

			{/* Drawer panel */}
			<div
				className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-out ${
					open ? "translate-x-0" : "translate-x-full"
				}`}
			>
				{/* Drawer Header */}
				<div className="p-6 border-b border-[#c7c4d8] flex items-center justify-between">
					<div>
						<h3 className="text-xl font-semibold text-[#1b1b24]">
							Score Applicant
						</h3>
						<p className="text-sm text-[#464555] mt-0.5">
							Technical Interview Phase
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-[#eae6f4] rounded-full transition-colors active:scale-95"
					>
						<Icon name="close" className="w-5 h-5 text-[#1b1b24]" />
					</button>
				</div>

				{/* Drawer Body */}
				<div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#e2dfff] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
					{/* Applicant Brief */}
					<div className="flex items-center gap-4 p-4 bg-[#f5f2ff] rounded-xl">
						<div className="w-14 h-14 rounded-full bg-violet-200 text-violet-800 flex items-center justify-center font-semibold text-lg shrink-0">
							SJ
						</div>
						<div>
							<p className="text-xl font-semibold text-[#1b1b24]">Sarah J.</p>
							<p className="text-sm text-[#712ae2]">Candidate ID: #88219</p>
						</div>
					</div>

					{/* Numeric Score */}
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
								onChange={(e) => setScore(e.target.value)}
								className="w-32 px-4 py-2 bg-white border border-[#777587] rounded-lg text-2xl font-semibold text-[#3525cd] focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
							/>
							<span className="text-xl font-semibold text-[#464555]">/ 10</span>
						</div>
					</div>

					{/* Review Notes */}
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

					{/* Recommendation */}
					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium text-[#1b1b24]">
							Final Recommendation
						</label>
						<div className="grid grid-cols-2 gap-4">
							<button
								onClick={() => setRecommendation("passed")}
								className={`flex items-center justify-center gap-2 p-4 border-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
									recommendation === "passed"
										? "border-emerald-500 bg-emerald-50 text-emerald-700"
										: "border-[#c7c4d8] hover:border-emerald-400 hover:bg-emerald-50/50 text-[#464555]"
								}`}
							>
								<Icon
									name="check_circle"
									className="w-5 h-5"
									filled={recommendation === "passed"}
								/>
								Passed
							</button>
							<button
								onClick={() => setRecommendation("failed")}
								className={`flex items-center justify-center gap-2 p-4 border-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
									recommendation === "failed"
										? "border-red-500 bg-red-50 text-red-700"
										: "border-[#c7c4d8] hover:border-red-400 hover:bg-red-50/50 text-[#464555]"
								}`}
							>
								<Icon name="cancel" className="w-5 h-5" />
								Failed
							</button>
						</div>
					</div>

					{/* Criteria Checklist */}
					<div className="border-t border-[#c7c4d8] pt-6 flex flex-col gap-3">
						<h4 className="text-xs font-semibold uppercase tracking-wider text-[#464555]">
							Evaluation Criteria
						</h4>
						{[
							{ key: "coding", label: "Coding Efficiency" },
							{ key: "logic", label: "Logic & Reasoning" },
							{ key: "culture", label: "Cultural Fit" },
						].map(({ key, label }) => (
							<label
								key={key}
								className="flex items-center gap-3 cursor-pointer group"
							>
								<input
									type="checkbox"
									checked={criteria[key]}
									onChange={(e) =>
										setCriteria((c) => ({ ...c, [key]: e.target.checked }))
									}
									className="w-5 h-5 rounded border-[#c7c4d8] text-indigo-600 focus:ring-indigo-300 accent-indigo-600"
								/>
								<span className="text-sm text-[#1b1b24] group-hover:text-[#3525cd] transition-colors">
									{label}
								</span>
							</label>
						))}
					</div>
				</div>

				{/* Drawer Footer */}
				<div className="p-6 bg-[#f5f2ff] border-t border-[#c7c4d8] flex gap-4">
					<button
						onClick={onClose}
						className="flex-1 px-4 py-2 border border-[#c7c4d8] hover:bg-[#eae6f4] rounded-lg text-sm font-medium transition-all active:scale-95"
					>
						Discard
					</button>
					<button className="flex-1 px-4 py-2 bg-[#3525cd] text-white hover:opacity-90 rounded-lg text-sm font-medium shadow-md shadow-indigo-300/30 transition-all active:scale-95">
						Save Review
					</button>
				</div>
			</div>
		</>
	);
};

export default ScoringDrawer;
