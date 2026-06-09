const CLUB = {
	name: "Global Tech Club",
	subtitle: "University Chapter",
	description:
		"Bridging the gap between academic theory and industry excellence through innovation, workshops, and high-impact project inductions.",
	links: [
		{ icon: "language", label: "Website" },
		{ icon: "public", label: "Twitter" },
		{ icon: "alternate_email", label: "Discord" },
	],
	stats: {
		members: "1,248",
		membersGrowth: "+12% this month",
		inductions: "04",
		inductionsSub: "Across 3 departments",
	},
};

const MEMBER = {
	name: "Alex Rivera",
	role: "Lead Developer",
	avatarSrc:
		"https://lh3.googleusercontent.com/aida-public/AB6AXuD20u8xivgzMXi3DpwFnh8rYCTqi0PdLbG-tNGFINsMppmgtq5e8urmVlLMs38IyPdhbBiXctR3YijGLoAsgCyej-iHC-avAje-sYGaSDSZgKo3-V-ypkpeX05uEjs1yWrlbdR_EXyZEaRt-X710dpfWlQbsreu_FFQLNfNY4kFhrbETiO2x-GQ_9vBrUCmQ0kMPFyLhPxOrd9PoN6ekkHZDG4qvo-g644-xR7AtjnBMiACHj5ukFE7hRcH51R2G9-m3ZFzZNQ7UyjA",
	joined: "Oct 2023",
	contributions: "14 Projects",
	credits: "2,450 XP",
};

const UPDATES = [
	{
		type: "announcement",
		age: "2H AGO",
		text: "New Spring Research Cohort applications now open for all members.",
		accent: true,
	},
	{
		type: "event",
		title: "AI Ethics Workshop",
		time: "Tomorrow, 4:00 PM",
		day: "14",
		month: "May",
	},
	{
		type: "announcement",
		age: "1D AGO",
		text: "Project 'Lighthouse' codebase has been migrated to the new organizational repo.",
		accent: false,
	},
];

const INDUCTIONS = [
	{
		icon: "code",
		iconColor: "text-indigo-600",
		iconBg: "bg-indigo-50",
		barColor: "bg-indigo-600",
		title: "Backend Engineering Core",
		sub: "Closing in 4 days • Node.js & Go",
		applicants: 42,
		progress: 65,
		statusLabel: "In Review",
		statusClass: "bg-emerald-50 text-emerald-700",
	},
	{
		icon: "palette",
		iconColor: "text-purple-600",
		iconBg: "bg-purple-50",
		barColor: "bg-purple-600",
		title: "Product Design Studio",
		sub: "Rolling Admissions • UX Research Focus",
		applicants: 18,
		progress: 30,
		statusLabel: "Screening",
		statusClass: "bg-amber-50 text-amber-700",
	},
	{
		icon: "analytics",
		iconColor: "text-orange-700",
		iconBg: "bg-orange-50",
		barColor: "bg-orange-700",
		title: "Data Science & ML Group",
		sub: "Closing in 12 days • Python & PyTorch",
		applicants: 156,
		progress: 85,
		statusLabel: "High Vol",
		statusClass: "bg-indigo-50 text-indigo-600",
	},
];

const DIRECTORY = [
	{
		name: "Sarah Chen",
		role: "UI/UX Lead",
		tags: ["Figma", "React"],
		src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdOCkrUtaosd-Q1ioH7zPJQCsF2fpjsmJ-7EVptV5m6t4a3nLn0k93rpI7O7N7qSu511zNggTneMjLDKqOudWBXcLTlhyJ3iYA3NNZczzHWX51BuFehBtkJc34kikacn-BkbRi0zPnTEhtMqMqN22o1zAuMZlDevkTaO7csBTIXMKg7CI_nw36JRQnL2fLjHBDApVk3NIgGXblEFC2ukvlU9btswOu9q1rXCVTTAsZU212rtMIxdtJl525Hli5-4nX4fvZP4EN1iRu",
	},
	{
		name: "Marcus Johnson",
		role: "Cloud Architect",
		tags: ["AWS", "Docker"],
		src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUKu-Q26xdbEpXHnIzoyMWmyGOtqM8VYZXW0Z657BQRz6yWn0XrG6E2wAsgDfFuIOy4PYasU8K_kYfFQR9KiB5A1KwyB7RNkybxafAGW80uEuvzrJceYuYZtbbaA_z7aDj_kDG31wgrgH0K2bseJRd_79UscSmXkAtdO6zZN3gpexCDE6Hg0w1vOKPKYoIBKDOZiO4kdvRaulL9VDRqq1frSBWrQMCEhAM3iQeKR_nb3AEjziqtBHOcUiVZv8NqHQY5wge-VtKaCAQ",
	},
	{
		name: "Elena Rodriguez",
		role: "Fullstack Dev",
		tags: ["Node.js", "Go"],
		src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn4eGYtkfL_UJWGh24jIuXTNG5PylNOwIvidHp-_1dknwLfOzBgJUVWKdVM5lX8V1kbze8oAG_mYuN72X7R1Nlud1iK4z-2uVSjb3aZGiK7Z4Qsn6SGGzS-pmm5urW9zp88bw5KpsGCFTH3kLoySg9ipyg8U0vh_4Y8K7cOeb7xQqZ8I8w69eHMrEyDX_qYyapBybTAvDDLTRN7dhWH7lQeQEZiETjSl5ZgxIl5TD29kfyoQ1F49-SIfWe2Vq8NtAWYBydHXssMAur",
	},
	{
		name: "David Kim",
		role: "Data Scientist",
		tags: ["Python", "PyTorch"],
		src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKvYO2KNvVNbycDLCKEts0WzG72UrJxyOke7G8Bpy4tu1MTpjk0A5oSLtGJShM7BcpHQ7_00n-iPOglkHyEyLBxUrBEu3FoBn_8fgHQ2_9vBrUCmQ0kMPFyLhPxOrd9PoN6ekkHZDG4qvo-g644-xR7AtjnBMiACHj5ukFE7hRcH51R2G9-m3ZFzZNQ7UyjA",
	},
];

const LEADERSHIP = [
	{
		name: "Dr. Aris Thorne",
		role: "Faculty Advisor",
		src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAM1hMeUfigG6EA_495F7UGRC_MutP7ZPypjRX_4NjlWfKqovmKkN70txKJKaVH-SJd0cBXd0DpviNbdloa_GY2s1yjKiK0RZtU8KlecMgSUSzuyA7hYs0lITt3yU1Han2sJs2Ay8gLlCnxxuNUTMTd8msNMTOXXYptXzY-jDE-u2gfFfLPmwsxGz65pRXk_b-8KmJf04UHuz6mDxyW3LDi34yAc9-TVja1wihvD_cjDjN0BETrD2qqZFzmVeYDKbtErBymW1ES5Lku",
	},
	{
		name: "Jordan Smith",
		role: "Club President",
		src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaUPpKF3nq63tT1RqzfqVwW2nfys5u-1SGcqymGPveo4WV34F19yGcFadT726rNyBkAwhMzjHCFzWGXNI9Jp3GaHz4mhgbZr6zgA3b-k5QP2_zt_kB82ta8pJaYPVi13_Y0Uu4lyr-hfvGUh9Ker42w6mwowp630mN6DRrn6KLGXspPMO6MVJc5pyDYgHW3czfNAaFG_29BXyx29g6ZDPQyrLs54dN0TgSPsYq4lBczxtFSC5Buff7_57pfsLfuUaj7aiHrESrvURt",
	},
	{
		name: "Mia Wong",
		role: "Treasury Lead",
		src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWZo54i1rB98tlDwB2qI9aLnp4E3jh4fo9oVF-TVJvYrdQOZvgW4mDqbgol5Xh2Ktn4ajs_ZL6O_PEJMlIX5OozHU3DadjSJZI94IvOZaz8PBDyf8r3f2v3E6B3-GK2On9BQaFnVjWQV1H7B2l7wUq1LqZtuGPqMjWB1dPNTLA0FIoNtFTweai3y1Q3sAthXHXcqWzU1fAXpNWn3AtemCwtGOcSSg3iz-agEwdwFOTrwOrvvxKpHdhyKeNRTrkKylOb7quvJc0juIw",
	},
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function MemberCard({ member }) {
	return (
		<div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all group">
			<div className="flex items-center gap-4 mb-4">
				<img
					src={member.src}
					alt={member.name}
					className="w-12 h-12 rounded-lg object-cover"
				/>
				<div>
					<h4 className="text-base font-semibold text-slate-900">
						{member.name}
					</h4>
					<p className="text-xs font-semibold tracking-wide text-indigo-600">
						{member.role}
					</p>
				</div>
			</div>
			<div className="flex flex-wrap gap-1 mb-4">
				{member.tags.map((tag) => (
					<span
						key={tag}
						className="bg-purple-100 text-purple-800 px-1.5 py-px rounded text-[10px] font-bold uppercase"
					>
						{tag}
					</span>
				))}
			</div>
			<button className="w-full py-1 border border-slate-200 rounded-lg text-slate-500 text-xs font-semibold tracking-wide uppercase hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-400 transition-all">
				Message
			</button>
		</div>
	);
}

function InductionRow({ item }) {
	return (
		<div className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors">
			<div
				className={`w-12 h-12 rounded-lg ${item.iconBg} flex items-center justify-center ${item.iconColor} flex-shrink-0`}
			>
				<span
					className="material-symbols-outlined text-[28px]"
					style={{ fontVariationSettings: "'FILL' 1" }}
				>
					{item.icon}
				</span>
			</div>
			<div className="flex-1">
				<h4 className="text-base font-semibold text-slate-900">{item.title}</h4>
				<p className="text-sm text-slate-500">{item.sub}</p>
			</div>
			<div className="flex items-center gap-8">
				<div className="text-center">
					<p className="text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1">
						Applicants
					</p>
					<p className="text-xl font-semibold leading-7 text-slate-900">
						{item.applicants}
					</p>
				</div>
				<div className="w-32 bg-slate-100 rounded-full h-2">
					<div
						className={`${item.barColor} h-full rounded-full`}
						style={{ width: `${item.progress}%` }}
					/>
				</div>
				<span
					className={`${item.statusClass} px-2 py-1 rounded-lg text-xs font-semibold`}
				>
					{item.statusLabel}
				</span>
			</div>
		</div>
	);
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function MemberView() {
	return (
		<div className="max-w-6xl mx-auto space-y-8">
				{/* ── Hero + My Membership ── */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2 space-y-6">
						{/* Club Hero Card */}
						<div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
							<div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full -mr-20 -mt-20 pointer-events-none" />
							<h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
								{CLUB.name}
							</h1>
							<p className="text-lg text-slate-500 max-w-2xl">
								{CLUB.description}
							</p>
							<div className="flex gap-4 mt-6">
								{CLUB.links.map(({ icon, label }) => (
									<a
										key={label}
										href="#"
										className="text-indigo-600 hover:underline text-sm font-medium flex items-center gap-1"
									>
										<span className="material-symbols-outlined text-[18px]">
											{icon}
										</span>
										{label}
									</a>
								))}
							</div>
						</div>

						{/* Stats Row */}
						<div className="grid grid-cols-2 gap-6">
							<div className="bg-violet-50 p-6 rounded-lg border border-slate-200">
								<p className="text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1">
									Active Members
								</p>
								<p className="text-4xl font-bold tracking-tight text-indigo-600">
									{CLUB.stats.members}
								</p>
								<div className="flex items-center gap-1 text-emerald-700 mt-2">
									<span className="material-symbols-outlined text-base">
										trending_up
									</span>
									<span className="text-xs font-semibold">
										{CLUB.stats.membersGrowth}
									</span>
								</div>
							</div>
							<div className="bg-violet-50 p-6 rounded-lg border border-slate-200">
								<p className="text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1">
									Live Inductions
								</p>
								<p className="text-4xl font-bold tracking-tight text-purple-600">
									{CLUB.stats.inductions}
								</p>
								<p className="text-xs font-semibold text-slate-500 mt-2">
									{CLUB.stats.inductionsSub}
								</p>
							</div>
						</div>
					</div>

					{/* My Membership Card */}
					<div className="bg-slate-100 p-8 rounded-xl border border-indigo-200 shadow-lg relative">
						<div className="absolute top-4 right-4 bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs font-semibold">
							Official Member
						</div>
						<h3 className="text-xl font-semibold leading-7 text-slate-900 mb-4">
							My Membership
						</h3>
						<div className="flex items-center gap-4 mb-6">
							<div className="w-16 h-16 rounded-xl border-2 border-indigo-600 p-1">
								<img
									src={MEMBER.avatarSrc}
									alt={MEMBER.name}
									className="rounded-lg w-full h-full object-cover"
								/>
							</div>
							<div>
								<p className="text-xl font-semibold leading-7 text-slate-900">
									{MEMBER.name}
								</p>
								<p className="text-sm font-bold text-indigo-600">
									{MEMBER.role}
								</p>
							</div>
						</div>
						<div className="space-y-2">
							{[
								{ label: "Joined", value: MEMBER.joined },
								{ label: "Contributions", value: MEMBER.contributions },
								{ label: "Credits", value: MEMBER.credits },
							].map(({ label, value }, i, arr) => (
								<div
									key={label}
									className={`flex justify-between items-center py-2 ${i < arr.length - 1 ? "border-b border-slate-200" : ""}`}
								>
									<span className="text-sm text-slate-500">{label}</span>
									<span className="text-sm font-medium text-slate-900">
										{value}
									</span>
								</div>
							))}
						</div>
						<button className="w-full mt-6 bg-white text-slate-500 border border-slate-200 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all">
							View Member Benefits
						</button>
					</div>
				</div>

				{/* ── Updates + Active Inductions ── */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					{/* Updates */}
					<div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-xl font-semibold leading-7 text-slate-900">
								Updates
							</h3>
							<button className="text-indigo-600 text-xs font-semibold hover:underline">
								See All
							</button>
						</div>
						<div className="space-y-6">
							{UPDATES.map((u, i) => {
								if (u.type === "event") {
									return (
										<div
											key={i}
											className="p-4 rounded-lg bg-violet-50 border border-slate-200"
										>
											<div className="flex items-start justify-between">
												<div>
													<p className="text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1">
														UPCOMING EVENT
													</p>
													<p className="text-base font-semibold text-slate-900">
														{u.title}
													</p>
													<p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
														<span className="material-symbols-outlined text-base">
															schedule
														</span>
														{u.time}
													</p>
												</div>
												<div className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-center flex-shrink-0">
													<span className="block font-bold text-sm leading-tight">
														{u.day}
													</span>
													<span className="block text-[10px] uppercase font-bold">
														{u.month}
													</span>
												</div>
											</div>
											<button className="w-full mt-4 bg-indigo-600 text-white py-1 rounded-lg text-xs font-semibold tracking-wide uppercase hover:brightness-110 transition-all">
												RSVP Now
											</button>
										</div>
									);
								}
								return (
									<div key={i} className="flex gap-4 group cursor-pointer">
										<div
											className={`w-1 ${u.accent ? "bg-indigo-600" : "bg-slate-200"} rounded-full group-hover:w-1.5 transition-all`}
										/>
										<div>
											<p className="text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1">
												{u.type === "announcement" ? "ANNOUNCEMENT" : "UPDATE"}{" "}
												• {u.age}
											</p>
											<p className="text-base text-slate-900 font-semibold line-clamp-2">
												{u.text}
											</p>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Active Inductions */}
					<div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-xl font-semibold leading-7 text-slate-900">
								Active Inductions
							</h3>
							<button className="bg-violet-50 text-slate-500 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 hover:bg-slate-100 transition-all">
								Manage Drives
							</button>
						</div>
						<div className="space-y-4">
							{INDUCTIONS.map((item) => (
								<InductionRow key={item.title} item={item} />
							))}
						</div>
					</div>
				</div>

				{/* ── Member Directory ── */}
				<section className="space-y-6">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<h2 className="text-2xl font-semibold leading-8 text-slate-900">
								Member Directory
							</h2>
							<p className="text-sm text-slate-500">
								Connect with 1,248 tech enthusiasts across campus.
							</p>
						</div>
						<div className="flex w-full md:w-auto gap-4">
							<div className="relative flex-1 md:w-80">
								<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
									search
								</span>
								<input
									type="text"
									placeholder="Search by name, role, or skills..."
									className="w-full pl-10 pr-4 py-2 bg-violet-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
								/>
							</div>
							<button className="bg-violet-50 p-2 rounded-lg border border-slate-200 text-slate-500 flex items-center gap-1 hover:bg-slate-100 transition-all">
								<span className="material-symbols-outlined">filter_list</span>
							</button>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{DIRECTORY.map((m) => (
							<MemberCard key={m.name} member={m} />
						))}
					</div>
				</section>

				{/* ── About + Leadership ── */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
					<section className="space-y-4">
						<h2 className="text-2xl font-semibold leading-8 text-slate-900">
							About Global Tech
						</h2>
						<p className="text-base text-slate-500 leading-relaxed">
							Established in 2018, Global Tech Club has become the premier hub
							for student-led innovation. We operate as a mini-startup incubator
							within the university, providing members with the resources,
							mentorship, and network needed to build world-class technology.
							Our mission is to democratize tech education and foster a culture
							of rapid prototyping and ethical engineering.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-semibold leading-8 text-slate-900">
							Leadership
						</h2>
						<div className="flex gap-6 overflow-x-auto pb-4">
							{LEADERSHIP.map((l) => (
								<div key={l.name} className="flex-shrink-0 text-center">
									<div className="w-20 h-20 rounded-full border-2 border-slate-400 mb-1 overflow-hidden mx-auto">
										<img
											src={l.src}
											alt={l.name}
											className="w-full h-full object-cover"
										/>
									</div>
									<p className="text-sm font-bold text-slate-900">{l.name}</p>
									<p className="text-xs font-semibold text-slate-500">
										{l.role}
									</p>
								</div>
							))}
						</div>
					</section>
				</div>
		</div>
	);
}
