import { Navigate } from "react-router";
import { useGetMyApplicationsQuery } from "../../../features/application/applicationApi";
import Loader from "../../../components/loaders/Loader";
import EmptyState from "../../../features/application/components/EmptyState";
import { STATUS_CONFIG } from "../../../features/application/constants/application.constant";

/**
 * StageBar
 * Renders `totalStages` bars; bars up to and including `completedStages` are
 * filled with the accent colour for that status.
 */
function StageBar({ totalStages, completedStages, status }: any) {
	const isRejected = status === "rejected";

	return (
		<div className="flex gap-1">
			{Array.from({ length: totalStages }).map((_, i) => {
				const filled = i < completedStages;
				return (
					<div
						key={i}
						className={[
							"h-1 flex-1 rounded-full",
							filled
								? isRejected
									? "bg-[#ba1a1a] opacity-50"
									: "bg-[#3525cd]"
								: "bg-[#e4e1ee]",
						].join(" ")}
					/>
				);
			})}
		</div>
	);
}

/**
 * ApplicationCard
 * Props:
 *   logo        — img src string (optional; shows initials fallback)
 *   orgName     — string
 *   title       — string
 *   appliedOn   — string  e.g. "Oct 12, 2023"
 *   status      — "pending" | "shortlisted" | "accepted" | "rejected"
 *   currentStage— string  e.g. "Document Review"
 *   totalStages — number  (total pipeline stages)
 *   completedStages — number (how many are done)
 *   onAction    — function called when the bottom button is clicked
 */
function ApplicationCard({
	logo,
	orgName,
	title,
	appliedOn,
	status,
	currentStage,
	totalStages,
	completedStages,
	onAction,
}: any) {
	const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
	const actionLabel = status === "rejected" ? "View Feedback" : "View Details";

	return (
		<div
			className="
        bg-white border border-[#c7c4d8] rounded-lg p-6 flex flex-col shadow-sm
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        hover:-translate-y-1 hover:scale-[1.01] hover:shadow-md
      "
		>
			{/* Org header */}
			<div className="flex items-center gap-4 mb-4">
				{logo ? (
					<img
						src={logo}
						alt={orgName}
						className="w-10 h-10 rounded-full border border-[#c7c4d8] object-cover flex-shrink-0"
					/>
				) : (
					<div className="w-10 h-10 rounded-full border border-[#c7c4d8] bg-[#f5f2ff] flex items-center justify-center flex-shrink-0">
						<span className="text-[12px] font-semibold text-[#3525cd] uppercase leading-none">
							{orgName?.slice(0, 2)}
						</span>
					</div>
				)}
				<span className="text-[14px] leading-[20px] font-semibold text-[#1b1b24]">
					{orgName}
				</span>
			</div>

			{/* Title + date */}
			<h3 className="text-[20px] leading-[28px] font-semibold text-[#1b1b24] mb-1">
				{title}
			</h3>
			<p className="text-[12px] leading-[16px] font-semibold tracking-[0.05em] text-[#464555] mb-4">
				Applied on {appliedOn}
			</p>

			{/* Status pill */}
			<div
				className={`flex items-center gap-1 px-2 py-1 ${cfg.pillBg} ${cfg.pillText} rounded-full self-start mb-6`}
			>
				{cfg.icon}
				<span className="text-[12px] leading-[16px] font-semibold tracking-[0.05em] uppercase">
					{cfg.label}
				</span>
			</div>

			{/* Stage tracker + action */}
			<div className="mt-auto pt-4 border-t border-[#c7c4d8]">
				<div className="mb-6">
					<p className="text-[12px] leading-[16px] font-semibold tracking-[0.05em] text-[#464555] mb-2">
						{status === "rejected" ? "Status:" : "Current Stage:"}{" "}
						{currentStage}
					</p>
					<StageBar
						totalStages={totalStages}
						completedStages={completedStages}
						status={status}
					/>
				</div>

				<button
					onClick={onAction}
					className="
            w-full py-2 border border-[#4f46e5] text-[#4f46e5]
            text-[14px] leading-[20px] font-medium rounded-lg
            hover:bg-[#f5f2ff] transition-colors
            active:scale-[0.98]
          "
				>
					{actionLabel}
				</button>
			</div>
		</div>
	);
}

// ─── Empty State ──────────────────────────────────────────────────────────────

// ─── Page component ───────────────────────────────────────────────────────────

export default function MyApplications() {
	const {
		data: result,
		isLoading,
		error,
	} = useGetMyApplicationsQuery(undefined);

	const applications = result?.data ?? [];
	const hasApplications = applications.length > 0;

	if (isLoading) return <Loader />;
	if (error) return <Navigate to="/my-applications" replace />;

	return (
		<div className="bg-white min-h-screen antialiased">
			<main className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 md:py-16">
				{/* Header */}
				<header className="mb-12">
					<h1 className="text-[28px] leading-[34px] font-bold tracking-[-0.01em] md:text-[36px] md:leading-[44px] md:tracking-[-0.02em] text-[#1b1b24] mb-2">
						My Applications
					</h1>
					<p className="text-[16px] leading-[24px] text-[#464555] max-w-2xl">
						Track the progress of all your submitted applications and stay
						updated on your induction status.
					</p>
				</header>

				{/* Grid or empty state */}
				{hasApplications ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{applications.map((app: any) => (
							<ApplicationCard
								key={app.id}
								logo={app.club_logo}
								orgName={app.club_name}
								title={app.induction_title}
								appliedOn={new Date(app.applied_on).toLocaleDateString(
									"en-US",
									{ month: "short", day: "numeric", year: "numeric" },
								)}
								status={app.status.toLowerCase()}
								currentStage={app.current_stage_name ?? "Application Submitted"}
								totalStages={app.totalStages}
								completedStages={
									app.stage_number >= 0 ? app.stage_number + 1 : 0
								}
								onAction={() => console.log("action clicked for", app.id)}
							/>
						))}
					</div>
				) : (
					<EmptyState />
				)}
			</main>
		</div>
	);
}
