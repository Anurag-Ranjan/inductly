const CompletionCard = ({
	pct,
	phase,
}: {
	pct: number;
	phase: string;
}) => {
	const radius = 24;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference * (1 - pct / 100);
	return (
		<div className="col-span-1 md:col-span-3 bg-[#f5f2ff] p-6 rounded-xl border border-[#c7c4d8] flex items-center justify-between">
			<div className="flex items-center gap-4 w-full">
				<div className="relative w-14 h-14 shrink-0">
					<svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
						<circle
							cx="28"
							cy="28"
							r={radius}
							fill="transparent"
							stroke="#c7c4d8"
							strokeWidth="6"
						/>
						<circle
							cx="28"
							cy="28"
							r={radius}
							fill="transparent"
							stroke="#3525cd"
							strokeWidth="6"
							strokeDasharray={circumference}
							strokeDashoffset={offset}
							strokeLinecap="round"
						/>
					</svg>
					<div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#1b1b24]">
						{Math.round(pct)}%
					</div>
				</div>
				<div className="flex-1">
					<p className="text-sm font-medium text-[#464555]">
						Induction Completion
					</p>
					<h3 className="text-xl font-semibold text-[#1b1b24]">{phase}</h3>
				</div>
			</div>
			<span
				className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap ${
					pct >= 75
						? "bg-emerald-50 text-emerald-700"
						: pct >= 40
							? "bg-indigo-50 text-indigo-700"
							: "bg-amber-50 text-amber-700"
				}`}
			>
				{pct >= 75 ? "Ahead" : pct >= 40 ? "On Track" : "Needs Attention"}
			</span>
		</div>
	);
};

export default CompletionCard;
