import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMyClubsServices } from "../../../features/club/services/clubServices";

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

// ── HELPERS ────────────────────────────────────────────────────────────────────

function getInitials(name: string) {
	return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const COLORS = [
	{ bg: "bg-indigo-50", text: "text-indigo-600" },
	{ bg: "bg-purple-50", text: "text-purple-600" },
	{ bg: "bg-orange-50", text: "text-orange-700" },
];

function formatDate(dateStr: string | null) {
	if (!dateStr) return "—";
	const d = new Date(dateStr);
	return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function mapClub(club: any, index: number) {
	const color = COLORS[index % COLORS.length];
	return {
		id: club.id,
		logo: club.logo,
		name: club.club_name,
		iconColor: color.text,
		iconBg: color.bg,
		desc: club.description,
		status: "Active Member",
		statusBg: "bg-emerald-50",
		statusText: "text-emerald-700",
		dateLabel: "Joined",
		date: formatDate(club.joined_on),
		role: club.role,
	};
}

const STAT_CONFIG = [
	{ icon: "verified_user", iconBg: "bg-indigo-50", iconColor: "text-indigo-600", label: "Active Membs", key: "active" },
	{ icon: "hourglass_empty", iconBg: "bg-purple-50", iconColor: "text-purple-600", label: "Pending", key: "pending" },
	{ icon: "calendar_today", iconBg: "bg-orange-50", iconColor: "text-orange-700", label: "Next Event", key: "nextEvent" },
	{ icon: "assignment_late", iconBg: "bg-red-50", iconColor: "text-red-500", label: "Deadlines", key: "deadlines" },
];

function computeStats(clubs: any[]) {
	const active = clubs.filter((c) => !!c.joined_on).length;
	const pending = clubs.filter((c) => !c.joined_on).length;
	return STAT_CONFIG.map((cfg) => {
		let value: string;
		if (cfg.key === "active") value = String(active);
		else if (cfg.key === "pending") value = String(pending);
		else value = "—";
		return { ...cfg, value };
	});
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function MyClubs() {
	const dispatch = useDispatch();
	const [clubsData, setClubsData] = useState<any>(null);
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState("");

	const fetchClubs = async (p: number) => {
		const data = await getMyClubsServices(dispatch, p);
		if (data) setClubsData(data);
	};

	useEffect(() => {
		fetchClubs(page);
	}, [page]);

	const rawClubs = clubsData?.clubs || [];
	const clubs = rawClubs.map(mapClub);
	const stats = computeStats(rawClubs);
	const totalPages = clubsData?.totalPages || 1;

	const filtered = clubs.filter(
		(c) =>
			c.name.toLowerCase().includes(query.toLowerCase()) ||
			c.desc.toLowerCase().includes(query.toLowerCase()),
	);

	return (
		<div className="p-6 max-w-7xl mx-auto space-y-8 font-sans">
			{/* ── CONTENT HEADER ── */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
				<div>
					<h2 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">
						My Clubs
					</h2>
					<p className="text-base text-gray-500 mt-1">
						Manage your memberships and induction progress.
					</p>
				</div>
				<button
					className="flex items-center gap-2 px-6 py-3 text-white text-sm font-medium rounded-lg shadow-md active:scale-[0.98] transition-all flex-shrink-0"
					style={{ background: "linear-gradient(to right, #3525cd, #712ae2)" }}
				>
					<Icon name="add" className="text-xl" />
					Join New Club
				</button>
			</div>

			{/* ── SEARCH ── */}
			<div className="relative w-full max-w-md group">
				<Icon
					name="search"
					className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 text-xl pointer-events-none transition-colors"
				/>
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search your clubs..."
					className="w-full pl-12 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
				/>
			</div>

			{/* ── CLUBS GRID ── */}
			{filtered.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filtered.map((club) => (
						<div
							key={club.id}
							className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4 transition-all duration-300 group cursor-pointer hover:-translate-y-1"
							style={{
								boxShadow:
									"0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
							}}
						>
							{/* Icon/Logo + Status badge */}
							<div className="flex items-start justify-between">
								{club.logo ? (
									<img
										src={club.logo}
										alt={club.name}
										className="w-14 h-14 rounded-lg object-cover"
									/>
								) : (
									<div
										className={`w-14 h-14 rounded-lg ${club.iconBg} ${club.iconColor} flex items-center justify-center font-bold text-sm`}
									>
										{getInitials(club.name)}
									</div>
								)}
								<span
									className={`${club.statusBg} ${club.statusText} px-2 py-1 rounded text-xs font-semibold tracking-wide`}
								>
									{club.status}
								</span>
							</div>

							{/* Name + Description */}
							<div>
								<h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
									{club.name}
								</h3>
								<p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">
									{club.desc}
								</p>
							</div>

							{/* Meta row */}
							<div className="pt-3 border-t border-gray-100 flex justify-between items-center text-gray-500">
								<div className="flex flex-col">
									<span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
										{club.dateLabel}
									</span>
									<span className="text-sm text-gray-700">{club.date}</span>
								</div>
								<div className="flex flex-col items-end">
									<span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
										Role
									</span>
									<span className="text-sm text-gray-700">{club.role}</span>
								</div>
							</div>

							{/* CTA button */}
							<button className="w-full mt-1 py-2 bg-gray-100 hover:bg-indigo-600 hover:text-white text-gray-700 transition-all duration-200 rounded-lg text-sm font-medium flex items-center justify-center gap-1 active:scale-[0.98]">
								View Club
								<Icon name="arrow_forward" className="text-sm" />
							</button>
						</div>
					))}
				</div>
			) : (
				/* ── EMPTY STATE ── */
				<div className="flex flex-col items-center justify-center py-24 text-center">
					<div className="w-48 h-48 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
						<Icon name="diversity_3" className="text-6xl text-gray-300" />
					</div>
					<h3 className="text-2xl font-semibold text-gray-900 mb-1">
						No Clubs Found
					</h3>
					<p className="text-base text-gray-500 max-w-sm mb-6 leading-relaxed">
						{query
							? `No clubs match "${query}". Try a different search term.`
							: "You haven't joined any clubs or societies. Explore the campus organizations and start your journey today!"}
					</p>
					<button
						className="px-8 py-3 text-white text-sm font-medium rounded-lg hover:shadow-lg active:scale-95 transition-all"
						style={{
							background: "linear-gradient(to right, #3525cd, #712ae2)",
						}}
						onClick={() => setQuery("")}
					>
						{query ? "Clear Search" : "Explore Clubs"}
					</button>
				</div>
			)}

			{/* ── PAGINATION ── */}
			{clubsData && totalPages > 1 && (() => {
				const showingStart = (clubsData.page - 1) * clubsData.limit + 1;
				const showingEnd = showingStart + clubsData.clubs.length - 1;
				return (
					<div className="flex flex-col sm:flex-row items-center justify-between gap-3">
						<p className="text-sm text-gray-500 whitespace-nowrap">
							Showing {showingStart} to {showingEnd} of {clubsData.total} clubs
						</p>
						<div className="flex items-center gap-2">
							<button
								disabled={!clubsData.hasPrevPage}
								onClick={() => setPage((p) => p - 1)}
								className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
							>
								<Icon name="chevron_left" className="text-xl" />
							</button>
							{Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
								<button
									key={n}
									onClick={() => setPage(n)}
									className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
										n === page
											? "bg-indigo-600 text-white"
											: "text-gray-600 hover:bg-gray-100"
									}`}
								>
									{n}
								</button>
							))}
							<button
								disabled={!clubsData.hasNextPage}
								onClick={() => setPage((p) => p + 1)}
								className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
							>
								<Icon name="chevron_right" className="text-xl" />
							</button>
						</div>
					</div>
				);
			})()}

			{/* ── STATS TICKER ── */}
			{clubsData && (
				<div className="pt-6 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-6">
					{stats.map(({ icon, iconBg, iconColor, label, value }) => (
						<div key={label} className="flex items-center gap-3">
							<div className={`p-2 ${iconBg} ${iconColor} rounded-full`}>
								<Icon name={icon} className="text-xl" />
							</div>
							<div>
								<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
									{label}
								</p>
								<p className="text-xl font-semibold text-gray-900">{value}</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
