import { useState, useEffect } from "react";

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

const NAV_ITEMS = [
	{ icon: "dashboard", label: "Dashboard", active: true },
	{ icon: "groups", label: "My Clubs" },
	{ icon: "campaign", label: "Open Inductions" },
	{ icon: "description", label: "Applications" },
	{ icon: "person", label: "Profile" },
	{ icon: "settings", label: "Settings" },
];

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

const STATS = [
	{ label: "CLUBS JOINED", value: "3", color: "text-indigo-600", accent: "" },
	{ label: "TOTAL APPS", value: "5", color: "text-gray-900", accent: "" },
	{
		label: "PENDING",
		value: "2",
		color: "text-purple-600",
		accent: "border-l-4 border-l-purple-500",
	},
	{
		label: "ACCEPTED",
		value: "1",
		color: "text-green-600",
		accent: "border-l-4 border-l-green-600",
	},
	{ label: "REJECTED", value: "2", color: "text-red-600", accent: "" },
];

const ACTIVITIES = [
	{
		initials: "DS",
		avatarBg: "bg-indigo-100",
		avatarText: "text-indigo-700",
		club: "Debating Society",
		intake: "Winter Intake 2024",
		activity: "Application Submitted",
		time: "2 hours ago",
		badge: "Processing",
		badgeBg: "bg-blue-100",
		badgeText: "text-blue-800",
	},
	{
		initials: "RC",
		avatarBg: "bg-purple-100",
		avatarText: "text-purple-700",
		club: "Robotics Club",
		intake: "Member Induction",
		activity: "Invitation Received",
		time: "Yesterday",
		badge: "Accepted",
		badgeBg: "bg-green-100",
		badgeText: "text-green-800",
	},
	{
		initials: "AS",
		avatarBg: "bg-amber-100",
		avatarText: "text-amber-700",
		club: "Art Society",
		intake: "Exhibition Lead",
		activity: "Under Review",
		time: "3 days ago",
		badge: "Pending",
		badgeBg: "bg-amber-100",
		badgeText: "text-amber-800",
	},
];

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
	const [activeNav, setActiveNav] = useState("Dashboard");
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href =
			"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
		document.head.appendChild(link);
	}, []);

	return (
		<div
			className="min-h-screen flex font-sans text-gray-900"
			style={{ background: "#f5f2ff" }}
		>
			{/* ── SIDEBAR ── */}
			<aside
				className={`flex flex-col gap-2 p-4 h-screen fixed left-0 top-0 border-r border-gray-200 w-64 z-50 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
				style={{ background: "#f5f2ff" }}
			>
				{/* Brand */}
				<div className="mb-8 px-3">
					<h1 className="text-xl font-bold text-indigo-600 leading-tight">
						Inductly
					</h1>
					<p className="text-xs font-semibold text-gray-400 tracking-wide mt-0.5">
						Student Portal
					</p>
				</div>

				{/* Nav links */}
				<nav className="flex-1 space-y-1">
					{NAV_ITEMS.map(({ icon, label }) => {
						const isActive = activeNav === label;
						return (
							<button
								key={label}
								onClick={() => {
									setActiveNav(label);
									setSidebarOpen(false);
								}}
								className={`w-full flex items-center gap-4 rounded-lg px-4 py-2 text-sm font-medium transition-all text-left
                  ${
										isActive
											? "bg-indigo-600 text-white font-bold"
											: "text-gray-500 hover:bg-gray-200"
									}`}
							>
								<Icon name={icon} className="text-xl" />
								{label}
							</button>
						);
					})}
				</nav>

				{/* Logout */}
				<div className="mt-auto border-t border-gray-200 pt-3">
					<button className="w-full flex items-center gap-4 text-red-500 hover:bg-red-50 rounded-lg px-4 py-2 text-sm font-medium transition-all">
						<Icon name="logout" className="text-xl" />
						Logout
					</button>
				</div>
			</aside>

			{/* Mobile overlay */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black/30 z-40 md:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* ── MAIN WRAPPER ── */}
			<main className="md:ml-64 flex-1 min-h-screen">
				{/* ── TOP BAR ── */}
				<header
					className="flex justify-between items-center w-full px-6 h-20 bg-white border-b border-gray-200 sticky top-0 z-40"
					style={{
						boxShadow:
							"0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
					}}
				>
					{/* Mobile hamburger */}
					<button
						className="md:hidden mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
						onClick={() => setSidebarOpen(true)}
					>
						<Icon name="menu" className="text-gray-500 text-2xl" />
					</button>

					{/* Search */}
					<div className="flex items-center gap-4 w-full md:w-1/3">
						<div className="relative w-full max-w-md">
							<Icon
								name="search"
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none"
							/>
							<input
								type="text"
								placeholder="Search clubs, inductions..."
								className="w-full bg-gray-100 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
							/>
						</div>
					</div>

					{/* Right controls */}
					<div className="flex items-center gap-5">
						<button className="relative hover:bg-gray-100 rounded-full p-2 transition-all active:scale-95">
							<Icon name="notifications" className="text-gray-500 text-xl" />
							<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
						</button>
						<button className="hover:bg-gray-100 rounded-full p-2 transition-all active:scale-95">
							<Icon name="help" className="text-gray-500 text-xl" />
						</button>

						<div className="h-8 w-px bg-gray-200 mx-1" />

						{/* User chip */}
						<div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-1 transition-all">
							<div className="text-right hidden sm:block">
								<p className="text-sm font-medium text-gray-900 leading-tight">
									Alex Rivera
								</p>
								<p className="text-xs font-semibold text-gray-400">
									Computer Science
								</p>
							</div>
							<img
								src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkCS9pzCYXjNtvtNfYRaXLI-0R7c20JjGWWu3UqB1ymWo7CTqCka_laR6PVi2X4v_k88Szx_b_Z3nltUuwlapN4WBB9RwAcRuEL9rJ6d9GnWhdgeL-2d-feH3Z7dKBpCT5fCUVTiTQMPPNtdmLD0P3aA88hMdQabhmkmAZnWV8uFFkGgx_Lj6E8WydPLgeHNBie8s3B08VfWJ3w9MHBrs-wv40yMX8wBfap2ey9sjfZVnFXXFQKo7fNok7sjr4QlC1LSydE80aQ6NW"
								alt="User Profile"
								className="w-10 h-10 rounded-full border-2 border-indigo-600 object-cover"
							/>
						</div>
					</div>
				</header>

				{/* ── PAGE CANVAS ── */}
				<div className="p-6 max-w-7xl mx-auto space-y-8">
					{/* Welcome */}
					<section>
						<h2 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">
							Welcome back, Alex!
						</h2>
						<p className="text-lg text-gray-500 mt-1">
							Here's what's happening with your club inductions today.
						</p>
					</section>

					{/* Quick Actions */}
					<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{QUICK_ACTIONS.map(
							({ icon, label, sub, iconBg, iconColor, hoverBorder }) => (
								<button
									key={label}
									className={`group flex flex-col items-start p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md ${hoverBorder} transition-all active:scale-[0.98]`}
									style={{ boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}
								>
									<div
										className={`p-3 ${iconBg} ${iconColor} rounded-lg mb-4 group-hover:scale-110 transition-transform`}
									>
										<Icon name={icon} className="text-2xl" />
									</div>
									<span className="text-xl font-semibold text-gray-900">
										{label}
									</span>
									<span className="text-sm text-gray-500 mt-1 text-left leading-relaxed">
										{sub}
									</span>
								</button>
							),
						)}
					</section>

					{/* Stats */}
					<section className="grid grid-cols-2 lg:grid-cols-5 gap-6">
						{STATS.map(({ label, value, color, accent }) => (
							<div
								key={label}
								className={`bg-white p-6 border border-gray-200 rounded-xl text-center ${accent}`}
								style={{ boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}
							>
								<p className="text-xs font-semibold text-gray-400 tracking-widest mb-1">
									{label}
								</p>
								<p className={`text-4xl font-bold tracking-tight ${color}`}>
									{value}
								</p>
							</div>
						))}
					</section>

					{/* Main Data View */}
					<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
						{/* Recent Activity */}
						<section className="xl:col-span-2 space-y-4">
							<div className="flex justify-between items-end">
								<h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
									Recent Activity
								</h3>
								<a
									href="#"
									className="text-sm font-medium text-indigo-600 hover:underline"
								>
									View All
								</a>
							</div>

							<div
								className="bg-white border border-gray-200 rounded-xl overflow-hidden"
								style={{ boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}
							>
								<table className="w-full text-left">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-4 text-xs font-semibold text-gray-400 tracking-widest uppercase">
												Club / Society
											</th>
											<th className="px-6 py-4 text-xs font-semibold text-gray-400 tracking-widest uppercase">
												Activity
											</th>
											<th className="px-6 py-4 text-xs font-semibold text-gray-400 tracking-widest uppercase text-right">
												Status
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-100">
										{ACTIVITIES.map(
											({
												initials,
												avatarBg,
												avatarText,
												club,
												intake,
												activity,
												time,
												badge,
												badgeBg,
												badgeText,
											}) => (
												<tr
													key={club}
													className="hover:bg-gray-50 transition-colors"
												>
													<td className="px-6 py-4">
														<div className="flex items-center gap-4">
															<div
																className={`w-10 h-10 rounded-lg ${avatarBg} flex items-center justify-center ${avatarText} font-bold text-sm flex-shrink-0`}
															>
																{initials}
															</div>
															<div>
																<p className="text-sm font-medium text-gray-900">
																	{club}
																</p>
																<p className="text-xs text-gray-400">
																	{intake}
																</p>
															</div>
														</div>
													</td>
													<td className="px-6 py-4">
														<p className="text-sm text-gray-700">{activity}</p>
														<p className="text-xs text-gray-400">{time}</p>
													</td>
													<td className="px-6 py-4 text-right">
														<span
															className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeBg} ${badgeText}`}
														>
															{badge}
														</span>
													</td>
												</tr>
											),
										)}
									</tbody>
								</table>
							</div>
						</section>

						{/* Open Inductions Sidebar */}
						<section className="space-y-4">
							<div className="flex justify-between items-end">
								<h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
									Open Inductions
								</h3>
								<a
									href="#"
									className="text-sm font-medium text-indigo-600 hover:underline"
								>
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
												<img
													src={img}
													alt={alt}
													className="w-full h-full object-cover"
												/>
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-gray-900 truncate">
													{name}
												</p>
												<p className="text-xs text-gray-400 mt-0.5">{closes}</p>
												<div className="mt-2 flex flex-wrap gap-2">
													{tags.map(({ label, bg, text }) => (
														<span
															key={label}
															className={`text-xs font-semibold px-2 py-0.5 ${bg} ${text} rounded`}
														>
															{label}
														</span>
													))}
												</div>
											</div>
										</div>
									</div>
								))}

								{/* Pro Tip card */}
								<div
									className="relative p-6 rounded-xl text-white overflow-hidden"
									style={{
										background:
											"linear-gradient(135deg, #3525cd 0%, #712ae2 100%)",
										boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
									}}
								>
									<div className="relative z-10">
										<h4 className="text-xl font-semibold">Pro Tip</h4>
										<p className="text-sm opacity-90 mt-1 leading-relaxed">
											Completed profiles have a 40% higher acceptance rate in
											technical clubs.
										</p>
										<button className="mt-4 bg-white text-indigo-600 text-sm font-medium px-4 py-2 rounded-lg active:scale-95 transition-all hover:shadow-md">
											Update Now
										</button>
									</div>
									{/* Decorative icon */}
									<Icon
										name="auto_awesome"
										className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none"
										style={{ fontSize: "9rem" }}
									/>
								</div>
							</div>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
}
