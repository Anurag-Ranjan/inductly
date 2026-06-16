import { useNavigate, useParams } from "react-router";
import { useGetInductionsQuery } from "../../../../features/induction/inductionApi";
import Loader from "../../../../components/loaders/Loader";

export default function AdminView() {
	const { clubId } = useParams();
	const navigate = useNavigate();
	const { data, isLoading } = useGetInductionsQuery(Number(clubId));
	const inductions = data?.data ?? [];
	return (
		<div className="max-w-7xl mx-auto space-y-8">
			{/* Welcome Header */}
			<section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
				<div>
					<h1 className="text-4xl font-bold tracking-tight text-slate-900">
						Dashboard
					</h1>
					<p className="text-base text-slate-600 mt-2">
						Welcome back, Admin. Here's what's happening today at Global Tech
						Club.
					</p>
				</div>
				<div className="flex gap-2">
					<button className="bg-white border border-slate-200 text-slate-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
						Download Report
					</button>
					<button
						onClick={() => {
							navigate(`create-induction`);
						}}
						className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all active:scale-95 shadow-sm"
					>
						Create Induction
					</button>
				</div>
			</section>

			{/* Stats/Analytics Bento Grid */}
			<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="bg-white/80 backdrop-blur-md border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-between group hover:border-indigo-600 transition-colors">
					<div className="flex justify-between items-start">
						<span className="material-symbols-outlined text-indigo-600 p-2 bg-indigo-100 rounded-lg">
							groups
						</span>
						<span className="text-emerald-700 text-xs font-semibold tracking-wide bg-emerald-100 px-2 py-1 rounded-full">
							+12%
						</span>
					</div>
					<div className="mt-8">
						<p className="text-slate-600 text-sm font-medium">Total Members</p>
						<h2 className="text-4xl font-bold tracking-tight text-slate-900">
							1,284
						</h2>
					</div>
				</div>

				<div className="bg-white/80 backdrop-blur-md border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-between group hover:border-indigo-600 transition-colors">
					<div className="flex justify-between items-start">
						<span className="material-symbols-outlined text-purple-600 p-2 bg-purple-100 rounded-lg">
							rocket_launch
						</span>
						<span className="text-emerald-700 text-xs font-semibold tracking-wide bg-emerald-100 px-2 py-1 rounded-full">
							Active
						</span>
					</div>
					<div className="mt-8">
						<p className="text-slate-600 text-sm font-medium">
							Active Inductions
						</p>
						<h2 className="text-4xl font-bold tracking-tight text-slate-900">
							3
						</h2>
					</div>
				</div>

				<div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-between lg:col-span-2 group hover:border-indigo-600 transition-colors">
					<div className="flex justify-between items-start">
						<span className="material-symbols-outlined text-orange-600 p-2 bg-orange-100 rounded-lg">
							description
						</span>
						<span className="text-slate-600 text-xs font-semibold tracking-wide">
							Cumulative
						</span>
					</div>
					<div className="mt-8 flex items-end justify-between">
						<div>
							<p className="text-slate-600 text-sm font-medium">
								Total Applications
							</p>
							<h2 className="text-4xl font-bold tracking-tight text-slate-900">
								4,520
							</h2>
						</div>
						<div className="w-1/2 h-16 flex items-end gap-1">
							<div className="flex-1 bg-indigo-200 h-4 rounded-t-sm"></div>
							<div className="flex-1 bg-indigo-200 h-8 rounded-t-sm"></div>
							<div className="flex-1 bg-indigo-200 h-6 rounded-t-sm"></div>
							<div className="flex-1 bg-indigo-200 h-10 rounded-t-sm"></div>
							<div className="flex-1 bg-indigo-200 h-12 rounded-t-sm"></div>
							<div className="flex-1 bg-indigo-600 h-16 rounded-t-sm"></div>
						</div>
					</div>
				</div>
			</section>

			{/* Application Pipeline */}
			<section className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-semibold tracking-tight text-slate-900">
						Application Pipeline
					</h2>
					<a
						className="text-indigo-600 text-sm font-medium hover:underline"
						href="#"
					>
						View Detailed Funnel
					</a>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-1 md:gap-0 md:rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
					<div className="relative bg-slate-50 p-6 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col items-center text-center">
						<span className="text-slate-600 text-xs font-semibold tracking-wide uppercase mb-2">
							Pending
						</span>
						<h3 className="text-2xl font-semibold tracking-tight text-indigo-600">
							842
						</h3>
						<p className="text-sm text-slate-600 mt-1">To be reviewed</p>
					</div>
					<div className="relative bg-white p-6 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col items-center text-center">
						<span className="text-slate-600 text-xs font-semibold tracking-wide uppercase mb-2">
							Shortlisted
						</span>
						<h3 className="text-2xl font-semibold tracking-tight text-purple-600">
							215
						</h3>
						<p className="text-sm text-slate-600 mt-1">Ready for Interview</p>
					</div>
					<div className="relative bg-white p-6 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col items-center text-center">
						<span className="text-slate-600 text-xs font-semibold tracking-wide uppercase mb-2">
							Accepted
						</span>
						<h3 className="text-2xl font-semibold tracking-tight text-emerald-600">
							42
						</h3>
						<p className="text-sm text-slate-600 mt-1">Offer Sent</p>
					</div>
					<div className="relative bg-white p-6 flex flex-col items-center text-center">
						<span className="text-slate-600 text-xs font-semibold tracking-wide uppercase mb-2">
							Rejected
						</span>
						<h3 className="text-2xl font-semibold tracking-tight text-red-600">
							156
						</h3>
						<p className="text-sm text-slate-600 mt-1">Archived</p>
					</div>
				</div>
			</section>

			{/* Induction Management */}
			<section className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-semibold tracking-tight text-slate-900">
						Induction Management
					</h2>
				</div>
				{isLoading ? (
					<Loader />
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{inductions.map((induction) => (
							<div
								key={induction.id}
								className="bg-white/80 backdrop-blur-md border border-slate-200 border-l-4 border-l-indigo-600 p-6 rounded-xl shadow-sm space-y-6"
							>
								<div>
									<h3 className="text-xl font-semibold">{induction.title}</h3>
									{induction.description && (
										<p className="text-sm text-slate-500 mt-1 line-clamp-2">
											{induction.description}
										</p>
									)}
								</div>
								<div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-200">
									<div>
										<p className="text-xs font-semibold tracking-wide text-slate-600">
											Applicants
										</p>
										<p className="text-xl font-semibold text-slate-900">
											{induction.applicationCount}
										</p>
									</div>
									<div>
										<p className="text-xs font-semibold tracking-wide text-slate-600">
											Status
										</p>
										<p className="text-xl font-semibold text-slate-900">
											{induction.status === "ACTIVE"
												? "Open"
												: induction.status === "FINISHED"
													? "Finished"
													: "Draft"}
										</p>
									</div>
								</div>
								<div className="flex gap-2">
									<button
										onClick={() =>
											navigate(
												`/my-clubs/${clubId}/${induction.id}/induction-dashboard`,
											)
										}
										className="flex-1 bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-indigo-700 transition-all active:scale-95"
									>
										Dashboard
									</button>
									<button
										onClick={() =>
											navigate(
												`/my-clubs/${clubId}/${induction.id}/add-stages`,
											)
										}
										className="flex-1 bg-slate-100 text-slate-900 text-sm font-medium py-2 rounded-lg hover:bg-slate-200 transition-all active:scale-95"
									>
										Edit Stages
									</button>
								</div>
							</div>
						))}
						<button
							onClick={() => navigate("create-induction")}
							className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:border-indigo-600 group transition-all bg-slate-50/50 hover:bg-slate-50 cursor-pointer"
						>
							<div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all text-indigo-600">
								<span className="material-symbols-outlined">add</span>
							</div>
							<div className="text-center">
								<h3 className="text-xl font-semibold text-slate-900">
									Start New Induction
								</h3>
								<p className="text-sm text-slate-600 mt-1">
									Launch a new recruitment drive
								</p>
							</div>
						</button>
					</div>
				)}
			</section>

			{/* Member Management Table */}
			<section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-12">
				<div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
					<h2 className="text-2xl font-semibold tracking-tight text-slate-900">
						Member Management
					</h2>
					<div className="flex gap-2">
						<div className="relative group transition-transform focus-within:scale-[1.02]">
							<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
								search
							</span>
							<input
								className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none text-sm w-full md:w-64 transition-shadow"
								placeholder="Search members..."
								type="text"
							/>
						</div>
						<button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
							<span className="material-symbols-outlined">filter_list</span>
						</button>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse min-w-[800px]">
						<thead>
							<tr className="bg-slate-50">
								<th className="px-6 py-4 text-xs font-semibold tracking-wide text-slate-600 uppercase">
									Member
								</th>
								<th className="px-6 py-4 text-xs font-semibold tracking-wide text-slate-600 uppercase">
									Role
								</th>
								<th className="px-6 py-4 text-xs font-semibold tracking-wide text-slate-600 uppercase">
									Branch &amp; Batch
								</th>
								<th className="px-6 py-4 text-xs font-semibold tracking-wide text-slate-600 uppercase">
									Email
								</th>
								<th className="px-6 py-4 text-xs font-semibold tracking-wide text-slate-600 uppercase text-right">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200">
							{/* Table Row 1 */}
							<tr className="hover:bg-slate-50 transition-colors">
								<td className="px-6 py-4">
									<div className="flex items-center gap-4">
										<img
											alt="Alex Miller"
											className="w-10 h-10 rounded-full border border-slate-200 object-cover"
											src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGWDZRXTvfTpYKjSPkr7gHRkNO-1WDFaWlqdapqYXto3Nv4kxzLRLr3NRh1rKOiPfo14LFF-jnsgyPONj9MFjs7NymOcRI3Y_JJrXz7wyRBfXjBeMf1r-9L5E4e3hHTGOpdf_zMI7fizIFeVc7bhhhXKU6kIIylQzWFtvhOxgAQkivJAOMMwyan_Nk9Xk0HLK8YFn-P9wBZesR399peZaoxhmrG-k8YYbZoQ573EjZDUIX5HsU-9iz8CyudFounxuxT8qe05BUj73X"
										/>
										<div>
											<p className="text-sm font-medium text-slate-900">
												Alex Miller
											</p>
											<p className="text-sm text-slate-500">Joined Sep 2023</p>
										</div>
									</div>
								</td>
								<td className="px-6 py-4">
									<span className="bg-indigo-100 text-indigo-900 text-xs font-semibold tracking-wide px-2 py-1 rounded-full">
										Tech Lead
									</span>
								</td>
								<td className="px-6 py-4">
									<div>
										<p className="text-sm text-slate-900">Computer Science</p>
										<p className="text-xs font-semibold tracking-wide text-slate-500 mt-1">
											Batch of 2025
										</p>
									</div>
								</td>
								<td className="px-6 py-4 text-sm text-slate-500">
									alex.miller@univ.edu
								</td>
								<td className="px-6 py-4 text-right">
									<div className="flex justify-end gap-2">
										<button className="text-indigo-600 text-xs font-semibold tracking-wide hover:underline">
											Change Role
										</button>
										<button className="text-red-600 text-xs font-semibold tracking-wide hover:underline ml-2">
											Remove
										</button>
									</div>
								</td>
							</tr>

							{/* Table Row 2 */}
							<tr className="hover:bg-slate-50 transition-colors">
								<td className="px-6 py-4">
									<div className="flex items-center gap-4">
										<img
											alt="Sarah Roberts"
											className="w-10 h-10 rounded-full border border-slate-200 object-cover"
											src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgHlKYY4fBB1QHCMA3XpJ7_7FOSGxPdJTGXexVqT-L3WwunCwlQe6t6HBLa-lArqrsjqen1zoba4hY6WeTov_DIpzqQ99L2UJxrIJ8UD1UAXh3rLQPrZgkpsgu4H_pNdB8Y7dg_k20mQIvO6AhUYE7lCmBLHzI00NSRZWoRVy5Wjy0mBT7wCg7H-cnyrBmxB-xKInQopvZIq4ktw8luyTaUYFpI_rx3cTvDw_OmYjZzWRidV3ElcuauYszI7AZK7onkm_F64btnWAB"
										/>
										<div>
											<p className="text-sm font-medium text-slate-900">
												Sarah Roberts
											</p>
											<p className="text-sm text-slate-500">Joined Aug 2023</p>
										</div>
									</div>
								</td>
								<td className="px-6 py-4">
									<span className="bg-purple-100 text-purple-900 text-xs font-semibold tracking-wide px-2 py-1 rounded-full">
										Media Head
									</span>
								</td>
								<td className="px-6 py-4">
									<div>
										<p className="text-sm text-slate-900">Digital Arts</p>
										<p className="text-xs font-semibold tracking-wide text-slate-500 mt-1">
											Batch of 2024
										</p>
									</div>
								</td>
								<td className="px-6 py-4 text-sm text-slate-500">
									sarah.r@univ.edu
								</td>
								<td className="px-6 py-4 text-right">
									<div className="flex justify-end gap-2">
										<button className="text-indigo-600 text-xs font-semibold tracking-wide hover:underline">
											Change Role
										</button>
										<button className="text-red-600 text-xs font-semibold tracking-wide hover:underline ml-2">
											Remove
										</button>
									</div>
								</td>
							</tr>

							{/* Table Row 3 */}
							<tr className="hover:bg-slate-50 transition-colors">
								<td className="px-6 py-4">
									<div className="flex items-center gap-4">
										<img
											alt="Kevin Chen"
											className="w-10 h-10 rounded-full border border-slate-200 object-cover"
											src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGev4Gz2FjoDKozXao43-tVeuStQGWGvvcoATfi_ppcitnuEWpuDEffr49pDlGxi-zvE2tV-zJMi7LlHvIs3EcGWjtWsuMxGdGrcr5xgIihnU-9S3Z0XZIImmgXKuc7cGBnElUADfhwB1A_p7z2VDzB-LCAjh_wt8--CftsuJ3X4mbj1t6Y3kiQlf8RkqYVY3LO4dKGp2TlOHQx8dd2qGHLPonILqiIROo2Zn_yZybrmJ_CC7wsv2zxSQSumFchiSJnSukbx55DAzA"
										/>
										<div>
											<p className="text-sm font-medium text-slate-900">
												Kevin Chen
											</p>
											<p className="text-sm text-slate-500">Joined Oct 2023</p>
										</div>
									</div>
								</td>
								<td className="px-6 py-4">
									<span className="bg-slate-100 text-slate-600 text-xs font-semibold tracking-wide px-2 py-1 rounded-full">
										Member
									</span>
								</td>
								<td className="px-6 py-4">
									<div>
										<p className="text-sm text-slate-900">Electronics</p>
										<p className="text-xs font-semibold tracking-wide text-slate-500 mt-1">
											Batch of 2026
										</p>
									</div>
								</td>
								<td className="px-6 py-4 text-sm text-slate-500">
									k.chen@univ.edu
								</td>
								<td className="px-6 py-4 text-right">
									<div className="flex justify-end gap-2">
										<button className="text-indigo-600 text-xs font-semibold tracking-wide hover:underline">
											Change Role
										</button>
										<button className="text-red-600 text-xs font-semibold tracking-wide hover:underline ml-2">
											Remove
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div className="p-6 border-t border-slate-200 flex items-center justify-between">
					<p className="text-xs font-semibold tracking-wide text-slate-500">
						Showing 3 of 1,284 members
					</p>
					<div className="flex items-center gap-1">
						<button
							className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 text-slate-600"
							disabled
						>
							<span className="material-symbols-outlined">chevron_left</span>
						</button>
						<button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
							<span className="material-symbols-outlined">chevron_right</span>
						</button>
					</div>
				</div>
			</section>
		</div>
	);
}
