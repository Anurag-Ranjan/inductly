import Icon from "../Icon/Icon";

const ActiveApplicantsCard = ({ count }: { count: number }) => (
	<div className="col-span-1 md:col-span-3 bg-[#f5f2ff] p-6 rounded-xl border border-[#c7c4d8] flex items-center justify-between">
		<div className="flex items-center gap-4">
			<div className="w-12 h-12 rounded-full bg-[#8a4cfc] flex items-center justify-center text-white shrink-0">
				<Icon name="group" className="w-5 h-5" />
			</div>
			<div>
				<p className="text-sm font-medium text-[#464555]">Active Applicants</p>
				<h3 className="text-xl font-semibold text-[#1b1b24]">
					{count} Candidate{count !== 1 ? "s" : ""}
				</h3>
			</div>
		</div>
		<div className="text-right">
			<p className="text-xs font-semibold uppercase tracking-wider text-[#464555]">
				Current Load
			</p>
			<p className="text-2xl font-semibold text-[#712ae2]">
				{count > 50 ? "High" : count > 20 ? "Medium" : "Low"}
			</p>
		</div>
	</div>
);

export default ActiveApplicantsCard;
