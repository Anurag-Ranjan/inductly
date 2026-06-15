import { useState } from "react";
import { useGetAllClubsQuery } from "../../../features/club/api/clubApi";
import Loader from "../../../components/loaders/Loader";

const InstagramIcon = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={1.75}
		strokeLinecap="round"
		strokeLinejoin="round"
		className="w-5 h-5"
	>
		<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
		<circle cx="12" cy="12" r="4" />
		<circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
	</svg>
);

const LinkedInIcon = () => (
	<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
		<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
		<rect x="2" y="9" width="4" height="12" />
		<circle cx="4" cy="4" r="2" />
	</svg>
);

const WebIcon = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={1.75}
		strokeLinecap="round"
		strokeLinejoin="round"
		className="w-5 h-5"
	>
		<circle cx="12" cy="12" r="10" />
		<line x1="2" y1="12" x2="22" y2="12" />
		<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
	</svg>
);

function ClubCard({ club }) {
	return (
		<article className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
			{/* Top row: logo + badge */}
			<div className="flex justify-between items-start">
				<div className="w-16 h-16 rounded-xl p-1 flex items-center justify-center overflow-hidden border border-gray-100">
					<img
						src={club.logo}
						alt="Club Logo"
						className="w-full h-full object-cover rounded-lg"
					/>
				</div>
				{club.isInducting ? (
					<span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
						<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
						Inductions Open
					</span>
				) : (
					<span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">
						No Active Inductions
					</span>
				)}
			</div>

			{/* Name + description */}
			<div className="flex flex-col gap-1">
				<h2 className="text-lg font-semibold text-gray-900">{club.name}</h2>
				<p className="text-sm text-gray-500 line-clamp-2">{club.description}</p>
			</div>

			{/* Leadership */}
			<div className="pt-4 border-t border-gray-100">
				<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
					Leadership
				</p>
				<div className="flex flex-col gap-3">
					{club.president && (
						<div className="flex items-center gap-3">
							<img
								src={club.president.profile_picture}
								alt="President"
								className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
							/>
							<div className="flex flex-col">
								<span className="text-sm font-medium text-gray-900">
									{club.president.name}
								</span>
								<span className="text-xs text-gray-500">President</span>
							</div>
						</div>
					)}
					{club.vice_president && (
						<div className="flex items-center gap-3">
							<img
								src={club.vice_president.profile_picture}
								alt="VP"
								className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
							/>
							<div className="flex flex-col">
								<span className="text-sm font-medium text-gray-900">
									{club.vice_president.name}
								</span>
								<span className="text-xs text-gray-500">Vice President</span>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Footer: socials + CTA */}
			<div className="mt-auto pt-4 flex items-center justify-between">
				<div className="flex gap-1">
					<button
						title="Instagram"
						className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-indigo-600 transition-all active:scale-95"
					>
						<InstagramIcon />
					</button>
					<button
						title="Website"
						className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-indigo-600 transition-all active:scale-95"
					>
						<WebIcon />
					</button>
					<button
						title="LinkedIn"
						className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-indigo-600 transition-all active:scale-95"
					>
						<LinkedInIcon />
					</button>
				</div>
				<button className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md active:scale-[0.98] transition-all">
					View Club
				</button>
			</div>
		</article>
	);
}

export default function ExploreClubs() {
	const [filter, setFilter] = useState("all"); // "all" | "inducting"
	const [search, setSearch] = useState("");

	const { data: CLUBS, isLoading } = useGetAllClubsQuery(null);

	const clubs = CLUBS?.data ?? [];
	const visible = clubs.filter((c: any) => {
		const matchesFilter = filter === "all" || c.isInducting;
		const term = search.toLowerCase();
		const matchesSearch =
			!term ||
			c.name.toLowerCase().includes(term) ||
			c.description.toLowerCase().includes(term);
		return matchesFilter && matchesSearch;
	});

	const resetFilters = () => {
		setSearch("");
		setFilter("all");
	};

	if (isLoading) return <Loader />;

	return (
		<div className="bg-purple-50 min-h-screen text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
			{/* Header */}
			<header className="pt-16 pb-8 px-6 max-w-screen-xl mx-auto">
				<div className="flex flex-col gap-2">
					<h1 className="text-4xl font-bold tracking-tight text-indigo-600">
						Explore Clubs
					</h1>
					<p className="text-lg text-gray-500 max-w-2xl">
						Discover clubs, learn about their leadership, and explore current
						induction opportunities within the CampusClubs ecosystem.
					</p>
				</div>
			</header>

			{/* Sticky search + filter bar */}
			<section
				className="sticky top-0 z-30 border-b border-gray-200 mb-8"
				style={{
					background: "rgba(250, 248, 255, 0.85)",
					backdropFilter: "blur(12px)",
				}}
			>
				<div className="max-w-screen-xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
					{/* Search */}
					<div className="relative w-full md:max-w-md group">
						<svg
							className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<circle cx="11" cy="11" r="8" />
							<line x1="21" y1="21" x2="16.65" y2="16.65" />
						</svg>
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search club names..."
							className="w-full pl-11 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm"
						/>
					</div>

					{/* Toggle */}
					<div className="flex items-center bg-gray-200 p-1 rounded-xl shadow-inner">
						<button
							onClick={() => setFilter("all")}
							className={[
								"px-5 py-2 rounded-lg text-sm font-medium transition-all",
								filter === "all"
									? "bg-white shadow-sm text-indigo-600"
									: "text-gray-500 hover:text-gray-800",
							].join(" ")}
						>
							All Clubs
						</button>
						<button
							onClick={() => setFilter("inducting")}
							className={[
								"px-5 py-2 rounded-lg text-sm font-medium transition-all",
								filter === "inducting"
									? "bg-white shadow-sm text-indigo-600"
									: "text-gray-500 hover:text-gray-800",
							].join(" ")}
						>
							Currently Inducting
						</button>
					</div>
				</div>
			</section>

			{/* Main grid */}
			<main className="max-w-screen-xl mx-auto px-6 pb-20">
				{visible.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{visible.map((club) => (
							<ClubCard key={club.id} club={club} />
						))}
					</div>
				) : (
					/* Empty state */
					<div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
						<div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center">
							<svg
								className="w-20 h-20 text-gray-300"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={1}
							>
								<circle cx="11" cy="11" r="8" />
								<line x1="21" y1="21" x2="16.65" y2="16.65" />
								<line x1="8" y1="11" x2="14" y2="11" />
							</svg>
						</div>
						<div className="flex flex-col gap-2">
							<h3 className="text-2xl font-semibold text-gray-900">
								No clubs found
							</h3>
							<p className="text-base text-gray-500 max-w-sm">
								We couldn't find any clubs matching your current search or
								filter. Try adjusting your terms or looking at all clubs.
							</p>
						</div>
						<button
							onClick={resetFilters}
							className="px-6 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-indigo-600 hover:bg-gray-50 transition-colors active:scale-95"
						>
							Clear all filters
						</button>
					</div>
				)}
			</main>
		</div>
	);
}
