const PrimaryStatCard = ({ label, value, progress, trend }) => (
	<div className="col-span-1 md:col-span-2 bg-indigo-600 text-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
		<div>
			<p className="text-sm font-medium opacity-80">{label}</p>
			<h2 className="text-5xl font-bold mt-1 tracking-tight">{value}</h2>
		</div>
		<div className="mt-4 flex items-center gap-3">
			<div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
				<div
					className="h-full bg-white rounded-full"
					style={{ width: `${progress}%` }}
				/>
			</div>
			<span className="text-xs font-semibold tracking-wide">{trend}</span>
		</div>
	</div>
);

export default PrimaryStatCard;
