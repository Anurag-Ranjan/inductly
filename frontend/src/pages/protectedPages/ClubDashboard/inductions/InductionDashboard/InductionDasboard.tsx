import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import dayjs from "dayjs";
import { useGetInductionDashboardQuery } from "../../../../../features/induction/inductionApi";
import ScoringDrawer from "./components/ScoringDrawer/ScoringDrawer";
import Icon from "./components/Icon/Icon";
import PrimaryStatCard from "./components/PrimaryStatCard/PrimaryStatCard";
import CompletionCard from "./components/CompletionCard/CompletionCard";
import SimpleStatCard from "./components/SimpleStatCard/SimpleStatCard";
import ActiveApplicantsCard from "./components/ActiveApplicantsCard/ActiveApplicantsCard";
import Loader from "../../../../../components/loaders/Loader";

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
	PENDING: {
		label: "Pending",
		className: "bg-[#eae6f4] text-[#464555]",
	},
	IN_REVIEW: {
		label: "In Review",
		className: "bg-violet-100 text-violet-800",
	},
	PASSED: {
		label: "Passed",
		className: "bg-emerald-50 text-emerald-700 border border-emerald-100",
	},
	FAILED: {
		label: "Failed",
		className: "bg-red-50 text-red-700 border border-red-100",
	},
	QUEUED: {
		label: "Queued",
		className: "bg-[#eae6f4] text-[#464555]",
	},
};

const getStatusStyle = (status: string | undefined) =>
	STATUS_STYLES[status ?? ""] ?? {
		label: status ?? "Pending",
		className: "bg-gray-100 text-gray-600",
	};

const Avatar = ({ name, src, size = "w-10 h-10" }: { name: string; src?: string | null; size?: string }) => {
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	const colors = [
		"bg-violet-200 text-violet-800",
		"bg-indigo-200 text-indigo-800",
		"bg-purple-200 text-purple-800",
		"bg-blue-200 text-blue-800",
	];
	const color = colors[name.charCodeAt(0) % colors.length];

	return src ? (
		<img
			src={src}
			alt={name}
			className={`${size} rounded-full object-cover`}
			onError={(e) => {
				(e.target as HTMLImageElement).style.display = "none";
				((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = "flex";
			}}
		/>
	) : (
		<div
			className={`${size} rounded-full ${color} flex items-center justify-center font-semibold text-sm shrink-0`}
		>
			{initials}
		</div>
	);
};

const getStageIcon = (stageName: string | undefined) => {
	if (!stageName) return "code";
	const name = stageName.toLowerCase();
	if (name.includes("interview") || name.includes("panel")) return "group";
	if (name.includes("reason") || name.includes("logic") || name.includes("test") || name.includes("exam"))
		return "psychology";
	if (name.includes("screen") || name.includes("review")) return "visibility";
	return "code";
};

export default function InductionDashboard() {
	const { clubId, inductionId } = useParams();
	const navigate = useNavigate();
	const { data: clubData, isAdmin } = useOutletContext<{ data: any; isAdmin: boolean }>();
	const role = clubData?.role;

	useEffect(() => {
		if (role === "VISITOR") {
			navigate("/dashboard", { replace: true });
		}
	}, [role, navigate]);

	const { data: raw, isLoading } = useGetInductionDashboardQuery({
		clubId: Number(clubId),
		inductionId: Number(inductionId),
	});

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
	const [activeTab, setActiveTab] = useState("applicants");
	const [searchTerm, setSearchTerm] = useState("");

	const tabs = [
		{ id: "overview", label: "Overview" },
		{ id: "applicants", label: "Applicants (Active)" },
		{ id: "stages", label: "Stages" },
		{ id: "analytics", label: "Analytics" },
	];

	if (isLoading) return <Loader />;

	const dashboard = raw?.data;
	if (!dashboard) return null;

	const {
		induction,
		totalApplicants,
		pendingApplicants,
		shortlistedApplicants,
		selectedApplicants,
		rejectedApplicants,
		activeApplicants,
	} = dashboard;

	const isOpen =
		induction.opened_on &&
		induction.closing_on &&
		new Date(induction.closing_on) > new Date();

	const opened = induction.opened_on ? dayjs(induction.opened_on) : null;
	const closing = induction.closing_on ? dayjs(induction.closing_on) : null;
	const dateRange =
		opened && closing
			? `${opened.format("MMM D, YYYY")} – ${closing.format("MMM D, YYYY")}`
			: "Dates not set";

	const filtered = activeApplicants.filter((a: any) => {
		if (!searchTerm) return true;
		const term = searchTerm.toLowerCase();
		return (
			a.name.toLowerCase().includes(term) ||
			a.applicant_email.toLowerCase().includes(term)
		);
	});

	const completionPct =
		totalApplicants > 0
			? Math.round(
					((selectedApplicants.length + rejectedApplicants.length) /
						totalApplicants) *
						100,
				)
			: 0;

	const completionPhase =
		completionPct >= 75
			? "Final Phase"
			: completionPct >= 40
				? "Review Phase"
				: "Application Phase";

	return (
		<div className="min-h-screen bg-[#fcf8ff] text-[#1b1b24] overflow-x-hidden">
			<main className="max-w-[1280px] mx-auto px-6 py-8 flex flex-col gap-6">
				<header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<span className="bg-[#8a4cfc] text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
								Club #{induction.club_id}
							</span>
							{isOpen ? (
								<span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold border border-emerald-100">
									<span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
									Open
								</span>
							) : (
								<span className="flex items-center gap-1.5 bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs font-semibold">
									<span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
									Closed
								</span>
							)}
						</div>
						<h1 className="text-4xl font-bold tracking-tight text-[#1b1b24] mt-1">
							{induction.title}
						</h1>
						<p className="flex items-center gap-1.5 text-sm text-[#464555] mt-0.5">
							<Icon name="calendar_today" className="w-4 h-4" />
							{dateRange}
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() =>
								navigate(
									`/my-clubs/${clubId}/${inductionId}/edit-induction`,
								)
							}
							className="flex items-center gap-1.5 px-4 py-2 bg-[#eae6f4] hover:bg-[#e4e1ee] transition-all rounded-lg border border-[#c7c4d8] text-sm font-medium active:scale-95"
						>
							<Icon name="edit" className="w-4 h-4" />
							Edit Induction
						</button>
						<button
							onClick={() =>
								navigate(
									`/my-clubs/${clubId}/${inductionId}/add-stages`,
								)
							}
							className="flex items-center gap-1.5 px-4 py-2 bg-[#eae6f4] hover:bg-[#e4e1ee] transition-all rounded-lg border border-[#c7c4d8] text-sm font-medium active:scale-95"
						>
							<Icon name="account_tree" className="w-4 h-4" />
							Manage Stages
						</button>
						<button
							onClick={() =>
								navigate(
									`/my-clubs/${clubId}/${inductionId}/create-form`,
								)
							}
							className="flex items-center gap-1.5 px-4 py-2 bg-[#3525cd] text-white hover:opacity-90 transition-all rounded-lg text-sm font-medium shadow-sm active:scale-95"
						>
							<Icon name="description" className="w-4 h-4" />
							Manage Form
						</button>
					</div>
				</header>

				<section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
					<PrimaryStatCard
						label="Total Applications"
						value={String(totalApplicants)}
						progress={
							totalApplicants > 0
								? Math.round(
										((selectedApplicants.length + rejectedApplicants.length) /
											totalApplicants) *
											100,
									)
								: 0
						}
						trend={`${selectedApplicants.length} inducted`}
					/>
					<SimpleStatCard
						label="Pending"
						value={String(pendingApplicants.length)}
						pct={
							totalApplicants > 0
								? `${Math.round((pendingApplicants.length / totalApplicants) * 100)}%`
								: "0%"
						}
						pctColor="text-[#712ae2]"
					/>
					<SimpleStatCard
						label="Shortlisted"
						value={String(shortlistedApplicants.length)}
						pct={
							totalApplicants > 0
								? `${Math.round((shortlistedApplicants.length / totalApplicants) * 100)}%`
								: "0%"
						}
						pctColor="text-[#3525cd]"
					/>
					<SimpleStatCard
						label="Accepted"
						value={String(selectedApplicants.length)}
						pct={
							totalApplicants > 0
								? `${Math.round((selectedApplicants.length / totalApplicants) * 100)}%`
								: "0%"
						}
						pctColor="text-emerald-600"
					/>
					<SimpleStatCard
						label="Rejected"
						value={String(rejectedApplicants.length)}
						pct={
							totalApplicants > 0
								? `${Math.round((rejectedApplicants.length / totalApplicants) * 100)}%`
								: "0%"
						}
						pctColor="text-red-600"
					/>
					<ActiveApplicantsCard count={activeApplicants.length} />
					<CompletionCard pct={completionPct} phase={completionPhase} />
				</section>

				<section className="flex flex-col gap-4">
					<div className="flex items-center border-b border-[#c7c4d8] overflow-x-auto">
						<nav className="flex gap-6">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`pb-4 px-1 text-sm font-medium relative transition-colors whitespace-nowrap ${
										activeTab === tab.id
											? "text-[#3525cd] font-bold"
											: "text-[#464555] hover:text-[#3525cd]"
									}`}
								>
									{tab.label}
									{activeTab === tab.id && (
										<span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#3525cd] rounded-full" />
									)}
								</button>
							))}
						</nav>
					</div>

					<div className="bg-white rounded-xl border border-[#c7c4d8] overflow-hidden shadow-sm">
						<div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#c7c4d8]">
							<div className="relative max-w-md w-full">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#464555]">
									<Icon name="search" className="w-4 h-4" />
								</span>
								<input
									type="text"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									placeholder="Search applicants by name or email..."
									className="w-full pl-9 pr-4 py-2 bg-[#f5f2ff] border border-[#c7c4d8] rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-[#3525cd] outline-none transition-all"
								/>
							</div>
							<div className="flex items-center gap-2">
								<button className="flex items-center gap-1.5 px-4 py-2 border border-[#c7c4d8] rounded-lg text-xs font-semibold tracking-wide hover:bg-[#f5f2ff] transition-colors">
									<Icon name="filter_list" className="w-4 h-4" />
									Filter
								</button>
								<button className="flex items-center gap-1.5 px-4 py-2 border border-[#c7c4d8] rounded-lg text-xs font-semibold tracking-wide hover:bg-[#f5f2ff] transition-colors">
									<Icon name="file_download" className="w-4 h-4" />
									Export
								</button>
							</div>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="bg-[#f5f2ff] border-b border-[#c7c4d8]">
										{[
											"Applicant",
											"Current Stage",
											"Status",
											"Latest Score",
											...isAdmin ? ["Actions"] : [],
										].map((h) => (
											<th
												key={h}
												className={`px-6 py-4 text-xs font-semibold tracking-wide text-[#464555] uppercase ${
													h === "Actions" ? "text-right" : ""
												}`}
											>
												{h}
											</th>
										))}
									</tr>
								</thead>
								<tbody className="divide-y divide-[#c7c4d8]">
									{filtered.map((a: any) => {
										const statusStyle = getStatusStyle(
											a.currentStageStatus,
										);
										const scoreDisplay =
											a.currentStageScore != null
												? `${Number(a.currentStageScore).toFixed(1)}/10`
												: "—";
										const scoreStyle =
											a.currentStageScore != null && a.currentStageScore >= 7
												? "text-emerald-600 font-medium"
												: a.currentStageScore != null && a.currentStageScore >= 4
													? "text-[#3525cd] font-medium"
													: a.currentStageScore != null
														? "text-red-600 font-medium"
														: "text-[#464555]";

										return (
											<tr
												key={a.application_id}
												className="transition-colors cursor-pointer hover:bg-[#f5f2ff]"
											>
												<td className="px-6 py-4">
													<div className="flex items-center gap-4">
														<Avatar
															name={a.name}
															src={a.profile_picture}
														/>
														<div>
															<p className="text-sm font-medium text-[#1b1b24]">
																{a.name}
															</p>
															<p className="text-xs text-[#464555]">
																{a.applicant_email}
															</p>
														</div>
													</div>
												</td>
												<td className="px-6 py-4">
													<span className="flex items-center gap-1.5 text-sm text-[#712ae2]">
														<Icon
															name={getStageIcon(a.currentStageName)}
															className="w-4 h-4"
														/>
														<span className="text-[#1b1b24]">
															{a.currentStageName ?? "—"}
														</span>
													</span>
												</td>
												<td className="px-6 py-4">
													<span
														className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.className}`}
													>
														{statusStyle.label}
													</span>
												</td>
												<td className="px-6 py-4">
													<span className={`text-sm ${scoreStyle}`}>
														{scoreDisplay}
													</span>
												</td>
												{isAdmin && (
													<td className="px-6 py-4 text-right">
														<button
															onClick={() => {
																setSelectedApplicant(a);
																setDrawerOpen(true);
															}}
															className="px-3 py-1.5 text-xs font-semibold text-white bg-[#3525cd] rounded-lg hover:opacity-90 transition-all"
														>
															Score
														</button>
													</td>
												)}
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>

						<div className="p-4 flex items-center justify-between bg-[#f5f2ff]/50">
							<p className="text-sm text-[#464555]">
								Showing {filtered.length} of {activeApplicants.length} active
								applicant{activeApplicants.length !== 1 ? "s" : ""}
							</p>
						</div>
					</div>
				</section>
			</main>

			<ScoringDrawer
				open={drawerOpen}
				onClose={() => {
					setDrawerOpen(false);
					setSelectedApplicant(null);
				}}
				clubId={Number(clubId)}
				applicationId={selectedApplicant?.application_id}
				stageId={selectedApplicant?.currentStageId}
				applicantName={selectedApplicant?.name}
				stageName={selectedApplicant?.currentStageName}
			/>

			<button className="md:hidden fixed bottom-4 right-4 w-14 h-14 bg-[#712ae2] text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform">
				<Icon name="add" className="w-6 h-6" />
			</button>
		</div>
	);
}
