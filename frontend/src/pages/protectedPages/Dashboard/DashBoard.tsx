import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardService } from "../../../features/dashboard/services/dashboardServices";

function Icon({ name, className = "" }) {
	return (
		<span
			className={`material-symbols-outlined ${className}`}
			style={{
				fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
			}}
		>
			{name}
		</span>
	);
}

// ── DATA ──────────────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
	{
		icon: "explore",
		label: "Browse Clubs",
		sub: "Discover new communities and societies.",
		iconBg: "bg-indigo-50",
		iconColor: "text-indigo-600",
		hoverBorder: "hover:border-indigo-600",
	},
	{
		icon: "assignment",
		label: "View Applications",
		sub: "Track your ongoing induction processes.",
		iconBg: "bg-purple-50",
		iconColor: "text-purple-600",
		hoverBorder: "hover:border-purple-600",
	},
	{
		icon: "edit_square",
		label: "Complete Profile",
		sub: "Increase your acceptance chances.",
		iconBg: "bg-orange-50",
		iconColor: "text-orange-700",
		hoverBorder: "hover:border-orange-600",
	},
];

const STAT_CONFIG = [
	{ key: "membershipCount", label: "CLUBS JOINED", color: "text-indigo-600", accent: "" },
	{ key: "applicationCount", label: "TOTAL APPS", color: "text-gray-900", accent: "" },
	{ key: "PENDING", label: "PENDING", color: "text-purple-600", accent: "border-l-4 border-l-purple-500" },
	{ key: "SHORTLISTED", label: "SHORTLISTED", color: "text-blue-600", accent: "border-l-4 border-l-blue-500" },
	{ key: "ACCEPTED", label: "ACCEPTED", color: "text-green-600", accent: "border-l-4 border-l-green-600" },
	{ key: "REJECTED", label: "REJECTED", color: "text-red-600", accent: "" },
];

const BADGE_STYLES: Record<string, { bg: string; text: string }> = {
	PENDING: { bg: "bg-amber-100", text: "text-amber-800" },
	SHORTLISTED: { bg: "bg-blue-100", text: "text-blue-800" },
	ACCEPTED: { bg: "bg-green-100", text: "text-green-800" },
	REJECTED: { bg: "bg-red-100", text: "text-red-800" },
};

function getInitials(name: string) {
	return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const OPEN_INDUCTIONS = [
	{
		img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhL5yb1QuxdwhjNIMPL8R4TfNciaj4XZ0raYiGgW6BWd72bfb-a8n9aCWBXmTPmlw-NW0UGrIRDbc5GRmvb-haQXPJQlVvYLaYxmOJNL84ezmF8QWte73czGyqsBO1mFbmLKmy608qDWkl625t21b3_xqy4sRsw65pb508wG_DGzwRJCdiG01HGvSSQX_tO6L86WInW_wOPmH8N3nOZERKMPf-05ilXq728YAfn1Bi79PYk0XbEXZjkYPMT0vRL4e3TI-rl-iXCclu",
		alt: "Women in Tech",
		name: "Women in Tech Society",
		closes: "Closes in 48h",
		tags: [
			{ label: "Engineering", bg: "bg-purple-50", text: "text-purple-600" },
			{ label: "High Priority", bg: "bg-indigo-50", text: "text-indigo-600" },
		],
	},
	{
		img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfe7dMg7ZOfev3nLdzn1yVDJTJVEJ8LqK5pyHaF2aAJo44qEP8PBCrfUaLTeIXsAZm1VvLq0mCiu69vsFgXmACmN7BcU_UpqoNnl8PB9_q_Vjs_KQgpmedUj9NJbCQYfvxnFQyF5g5eO0OwJ19jUEfFyVNfrZF470MnUZ7jlux7BMAalcJlkCuFqX7L0uY-GkLX0NoTnucHv_yFoETxuV6NKIIKjEnVTTvcJaBoyzoDBYe5_QIq4Er95SCAK-e_oGMEKaKrL8QAQg_",
		alt: "Volunteer Org",
		name: "Student Outreach Vol",
		closes: "Closes next week",
		tags: [{ label: "Social", bg: "bg-green-100", text: "text-green-700" }],
	},
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
	const dispatch = useDispatch();
	const user = useSelector((state: any) => state.auth.user);
	const [dashboardData, setDashboardData] = useState<any>(null);

	useEffect(() => {
		const fetchDashboard = async () => {
			const data = await getDashboardService(dispatch);
			if (data) setDashboardData(data);
		};
		fetchDashboard();
	}, []);

	const stats = buildStats(dashboardData?.stats);

	return (
		<div className="p-6 max-w-7xl mx-auto space-y-8">
			<section>
				<h2 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">
					Welcome back, {user?.name || "User"}!
				</h2>
				<p className="text-lg text-gray-500 mt-1">
					Here's what's happening with your club inductions today.
				</p>
			</section>

			<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{QUICK_ACTIONS.map(({ icon, label, sub, iconBg, iconColor, hoverBorder }) => (
					<button
						key={label}
						className={`group flex flex-col items-start p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md ${hoverBorder} transition-all active:scale-[0.98]`}
						style={{ boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}
					>
						<div className={`p-3 ${iconBg} ${iconColor} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
							<Icon name={icon} className="text-2xl" />
						</div>
						<span className="text-xl font-semibold text-gray-900">{label}</span>
						<span className="text-sm text-gray-500 mt-1 text-left leading-relaxed">{sub}</span>
					</button>
				))}
			</section>

			<section className="grid grid-cols-2 lg:grid-cols-6 gap-6">
				{stats.map(({ label, value, color, accent }: any) => (
					<div
						key={label}
						className={`bg-white p-6 border border-gray-200 rounded-xl text-center ${accent}`}
						style={{ boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}
					>
						<p className="text-xs font-semibold text-gray-400 tracking-widest mb-1">{label}</p>
						<p className={`text-4xl font-bold tracking-tight ${color}`}>{value}</p>
					</div>
				))}
			</section>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
				<section className="xl:col-span-2 space-y-4">
					<h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
						Active Applications
					</h3>

					{dashboardData?.applications?.length > 0 ? (
						<div className="space-y-4">
							{dashboardData.applications.map((app: any) => {
								const badge = BADGE_STYLES[app.status as keyof typeof BADGE_STYLES] || BADGE_STYLES.PENDING;
								const pct = app.progress.totalStages > 0
									? Math.round((app.progress.completedStages / app.progress.totalStages) * 100)
									: 0;
								return (
									<div
										key={app.applicationId}
										className="bg-white border border-gray-200 rounded-xl p-5"
										style={{ boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}
									>
										<div className="flex items-start justify-between gap-4">
											<div className="flex items-center gap-4 min-w-0">
												{app.club.logo ? (
													<img
														src={app.club.logo}
														alt={app.club.name}
														className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
													/>
												) : (
													<div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
														{getInitials(app.club.name)}
													</div>
												)}
												<div className="min-w-0">
													<p className="text-base font-semibold text-gray-900 truncate">{app.club.name}</p>
													<p className="text-sm text-gray-500 truncate">{app.induction.title}</p>
												</div>
											</div>
											<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${badge.bg} ${badge.text}`}>
												{app.status}
											</span>
										</div>
										<div className="mt-4 space-y-1">
											<div className="flex justify-between text-xs text-gray-500">
												<span>Progress</span>
												<span>{app.progress.completedStages} / {app.progress.totalStages} Stages</span>
											</div>
											<div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
												<div
													className="h-full bg-indigo-600 rounded-full transition-all duration-500"
													style={{ width: `${pct}%` }}
												/>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<div className="bg-white border border-gray-200 rounded-xl p-8 text-center" style={{ boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}>
							<Icon name="inbox" className="text-4xl text-gray-300" />
							<p className="mt-3 text-gray-500">No applications yet</p>
						</div>
					)}
				</section>

				<section className="space-y-4">
					<div className="flex justify-between items-end">
						<h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
							Open Inductions
						</h3>
						<a href="#" className="text-sm font-medium text-indigo-600 hover:underline">
							See All
						</a>
					</div>

					<div className="space-y-4">
						{OPEN_INDUCTIONS.map(({ img, alt, name, closes, tags }) => (
							<div
								key={name}
								className="bg-white border border-gray-200 rounded-xl p-4 hover:scale-[1.02] transition-transform cursor-pointer"
								style={{ boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}
							>
								<div className="flex gap-4">
									<div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
										<img src={img} alt={alt} className="w-full h-full object-cover" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 truncate">{name}</p>
										<p className="text-xs text-gray-400 mt-0.5">{closes}</p>
										<div className="mt-2 flex flex-wrap gap-2">
											{tags.map(({ label, bg, text }) => (
												<span key={label} className={`text-xs font-semibold px-2 py-0.5 ${bg} ${text} rounded`}>
													{label}
												</span>
											))}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}

function buildStats(stats: any) {
	if (!stats) return STAT_CONFIG.map((c) => ({ ...c, value: "0" }));
	const statusCounts: Record<string, number> = {};
	if (stats.applicationStats?.length) {
		for (const s of stats.applicationStats) {
			statusCounts[s.status] = s._count;
		}
	}
	return STAT_CONFIG.map((config) => {
		let value = 0;
		if (config.key === "membershipCount") value = stats.membershipCount ?? 0;
		else if (config.key === "applicationCount") value = stats.applicationCount ?? 0;
		else value = statusCounts[config.key] ?? 0;
		return { ...config, value: String(value) };
	});
}
