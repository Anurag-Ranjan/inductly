const SimpleStatCard = ({ label, value, pct, pctColor }: { label: string; value: string; pct: string; pctColor: string }) => (
	<div className="col-span-1 bg-white border border-[#c7c4d8] p-6 rounded-xl flex flex-col justify-between">
		<p className="text-sm font-medium text-[#464555]">{label}</p>
		<div className="flex items-baseline gap-2 mt-1">
			<h2 className="text-2xl font-semibold">{value}</h2>
			<span className={`text-xs font-semibold tracking-wide ${pctColor}`}>
				{pct}
			</span>
		</div>
	</div>
);

export default SimpleStatCard;
