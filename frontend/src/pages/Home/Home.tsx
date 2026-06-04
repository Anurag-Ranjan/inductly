import { useState, useEffect } from "react";

const NAV_LINKS = [
	{ label: "Features", href: "#features" },
	{ label: "How It Works", href: "#how-it-works" },
	{ label: "Sign In", href: "/signin" },
];

const FEATURES = [
	{
		icon: "search",
		title: "Discover Clubs",
		desc: "Browse through a curated directory of student organizations, interest groups, and technical clubs.",
		bg: "bg-indigo-100",
		text: "text-indigo-600",
	},
	{
		icon: "description",
		title: "Easy Applications",
		desc: "Apply to multiple clubs with a unified application process. No more messy Google Forms.",
		bg: "bg-purple-100",
		text: "text-purple-600",
	},
	{
		icon: "pending_actions",
		title: "Track Status",
		desc: "Real-time tracking of your induction stages. Know exactly where you stand in every application.",
		bg: "bg-orange-100",
		text: "text-orange-700",
	},
	{
		icon: "dashboard",
		title: "Management Dashboard",
		desc: "For admins: Manage applicants, schedule interviews, and announce results from one central hub.",
		bg: "bg-gray-100",
		text: "text-gray-700",
	},
	{
		icon: "lock",
		title: "Secure Auth",
		desc: "Enterprise-grade security using SSO integration to ensure your data stays within the university ecosystem.",
		bg: "bg-indigo-100",
		text: "text-indigo-600",
	},
	{
		icon: "account_circle",
		title: "Profile Based Apps",
		desc: "Your profile serves as a digital CV. Update once, and use it across all your club applications.",
		bg: "bg-purple-100",
		text: "text-purple-600",
	},
];

const STEPS = [
	{
		n: 1,
		title: "Create Account",
		desc: "Sign up using your student email to verify your identity and campus affiliation.",
	},
	{
		n: 2,
		title: "Complete Profile",
		desc: "Add your skills, interests, and previous experiences to build a comprehensive student profile.",
	},
	{
		n: 3,
		title: "Apply",
		desc: "Discover clubs that match your profile and submit applications with just a few clicks.",
	},
	{
		n: 4,
		title: "Track Progress",
		desc: "Receive notifications for interviews, tasks, and results directly on your dashboard.",
	},
];

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

export default function Home() {
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		const link1 = document.createElement("link");
		link1.rel = "stylesheet";
		link1.href =
			"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
		document.head.appendChild(link1);

		const handleScroll = () => setScrolled(window.pageYOffset > 100);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="bg-white text-gray-900 min-h-screen font-sans">
			{/* ── TOP NAV ── */}
			<header
				className={`fixed top-0 left-0 right-0 z-50 h-16 border-b border-gray-200 transition-all duration-300 ${
					scrolled
						? "bg-white/70 backdrop-blur-md shadow-md"
						: "bg-white shadow-sm"
				}`}
			>
				<nav className="flex justify-between items-center w-full px-6 max-w-7xl mx-auto h-full">
					<span className="text-2xl font-bold text-indigo-600 tracking-tight">
						Inductly
					</span>

					{/* Desktop links */}
					<div className="hidden md:flex items-center gap-8 text-sm font-medium">
						{NAV_LINKS.map((l) => (
							<a
								key={l.label}
								href={l.href}
								className="text-gray-500 hover:text-indigo-600 transition-colors"
							>
								{l.label}
							</a>
						))}
						<a
							href="/get-started"
							className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg active:scale-95 transition-all"
						>
							Get Started
						</a>
					</div>

					{/* Mobile toggle */}
					<button
						className="md:hidden p-2 text-gray-500"
						onClick={() => setMobileOpen((o) => !o)}
						aria-label="Toggle menu"
					>
						<Icon name={mobileOpen ? "close" : "menu"} />
					</button>
				</nav>

				{/* Mobile menu */}
				{mobileOpen && (
					<div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 flex flex-col gap-4 text-sm font-medium shadow-md">
						{NAV_LINKS.map((l) => (
							<a
								key={l.label}
								href={l.href}
								className="text-gray-600 hover:text-indigo-600 transition-colors"
								onClick={() => setMobileOpen(false)}
							>
								{l.label}
							</a>
						))}
						<a
							href="/get-started"
							className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold text-center hover:shadow-lg transition-all"
							onClick={() => setMobileOpen(false)}
						>
							Get Started
						</a>
					</div>
				)}
			</header>

			<main className="pt-16">
				{/* ── HERO ── */}
				<section
					className="relative overflow-hidden pt-16 pb-24 text-center"
					style={{
						background:
							"radial-gradient(circle at 50% -20%, #e2dfff 0%, #fcf8ff 70%)",
					}}
				>
					<div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
						{/* Badge */}
						<div className="inline-flex items-center gap-2 px-4 py-1 bg-indigo-100 text-indigo-900 rounded-full text-xs font-semibold tracking-wide mb-6">
							<Icon name="verified" className="text-base" />
							The standard for college club inductions
						</div>

						<h1 className="text-4xl md:text-[56px] md:leading-tight font-bold max-w-3xl text-gray-900 mb-4 tracking-tight">
							Join Clubs. Build Communities. Simplify Inductions.
						</h1>

						<p className="text-lg text-gray-500 max-w-xl mb-12">
							Discover college clubs, apply seamlessly, and track your
							applications in one place. Your journey to campus leadership
							starts here.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 mb-16">
							<button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-lg font-bold text-base transition-all shadow-md hover:shadow-xl active:scale-95">
								Get Started
							</button>
							<button className="border border-gray-300 text-gray-800 hover:bg-gray-100 px-10 py-3 rounded-lg font-bold text-base transition-all active:scale-95">
								Learn More
							</button>
						</div>

						{/* Dashboard mockup */}
						<div className="relative w-full max-w-5xl mx-auto group">
							<div className="absolute -inset-4 bg-indigo-500/10 blur-3xl rounded-3xl opacity-50 group-hover:opacity-75 transition-opacity pointer-events-none" />
							<div className="relative bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden">
								{/* Fake browser chrome */}
								<div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-1.5">
									<div className="w-3 h-3 rounded-full bg-red-200" />
									<div className="w-3 h-3 rounded-full bg-yellow-200" />
									<div className="w-3 h-3 rounded-full bg-indigo-200" />
								</div>
								<img
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuDazbUPdYb9bOKJaagYUTUzogmlhomKVXS6Dee0DENGq3KznXrGOjTS-UjMlhyYLMLjPs-J-zDQfJaYYNGbo2sQxHAPptdPt-hwpLc4k_LKPieqei76hVSpX13iaJpetIkUjAlyEX38CXyjHRKsKZOxTvqiTUXkuiSnWhYtQ8v4nIgiPBK-Ui38d-StVsQPDSuvc_TEay5S1g4DCo-L-DnED6CRLtx0FjKX632YSW-IDMJPpnh8LHFl6FzLPjLwY_PvNSAXz_6z2lpF"
									alt="Inductly Dashboard Preview"
									className="w-full h-auto"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* ── FEATURES ── */}
				<section className="py-24 bg-white" id="features">
					<div className="max-w-7xl mx-auto px-6">
						<div className="text-center mb-16">
							<h2 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">
								Everything you need to lead
							</h2>
							<p className="text-gray-500 text-base">
								Powerful features designed for students and administrators.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{FEATURES.map((f) => (
								<div
									key={f.title}
									className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
								>
									<div
										className={`w-12 h-12 ${f.bg} ${f.text} flex items-center justify-center rounded-lg mb-4`}
									>
										<Icon name={f.icon} className="text-2xl" />
									</div>
									<h3 className="text-xl font-semibold mb-2">{f.title}</h3>
									<p className="text-gray-500 text-sm leading-relaxed">
										{f.desc}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* ── HOW IT WORKS ── */}
				<section className="py-24 bg-white overflow-hidden" id="how-it-works">
					<div className="max-w-7xl mx-auto px-6">
						<div className="flex flex-col md:flex-row gap-16 items-center">
							{/* Steps */}
							<div className="w-full md:w-1/2">
								<h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight leading-snug">
									Your path to campus community in 4 simple steps
								</h2>

								<div className="space-y-8 relative">
									{/* Vertical line */}
									<div className="absolute left-[21px] top-4 bottom-4 w-px bg-gray-200" />

									{STEPS.map((s) => (
										<div key={s.n} className="flex gap-6 relative z-10">
											<div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
												{s.n}
											</div>
											<div>
												<h4 className="text-xl font-semibold text-gray-900 mb-1">
													{s.title}
												</h4>
												<p className="text-gray-500 text-base leading-relaxed">
													{s.desc}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Illustration */}
							<div className="w-full md:w-1/2">
								<div className="bg-indigo-50/30 rounded-3xl p-6 border border-indigo-100">
									<img
										src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAd1q26fcEE_Zb5psHe2WZF8fasbW1WVvn5_dX-FM1fWpbMCeHZiOdrZoydlN7Kdvjllwyw_B_iuu7_0Wz1EKQDibyvuGGsvoC_jfH5gHmfDovdLamSgDDJit0rX44j6m-mNE-z4dRqqV_Rs4xzrpqZoYXaSFz0Tz9c2mMqk-_jnXXJG6R_o-DqcB6522VnP4cnisafoWn3Dt1RObmq9P9k-RLrR6Qw85PZ_aGS4rOCA1zlPQjaRXjtqVfUiYDV1KF3OFZhWryB2L4"
										alt="Step by step induction guide"
										className="w-full h-auto rounded-2xl shadow-xl"
									/>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* ── CTA ── */}
				<section className="py-24">
					<div className="max-w-7xl mx-auto px-6">
						<div className="bg-indigo-600 rounded-[32px] p-10 md:p-16 text-center relative overflow-hidden group">
							{/* Subtle radial overlay */}
							<div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#ffffff_0%,_transparent_70%)] pointer-events-none" />

							<h2 className="text-4xl font-bold text-white mb-6 relative z-10 tracking-tight">
								Ready to join your first club?
							</h2>
							<p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto relative z-10">
								Join thousands of students who have already simplified their
								campus life with Inductly.
							</p>

							<div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
								<button className="bg-white text-indigo-600 px-10 py-3 rounded-lg font-bold text-base hover:shadow-2xl transition-all hover:scale-105 active:scale-95">
									Get Started Now
								</button>
								<button className="border border-white/30 text-white px-10 py-3 rounded-lg font-bold text-base hover:bg-white/10 transition-all">
									View Demo
								</button>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* ── FOOTER ── */}
			<footer className="bg-gray-100 py-12 border-t border-gray-200">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
						<div>
							<span className="text-2xl font-bold text-indigo-600 mb-3 block">
								Inductly
							</span>
							<p className="text-gray-500 text-sm leading-relaxed">
								Empowering student communities through seamless induction
								management.
							</p>
						</div>

						<div>
							<h5 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
								Product
							</h5>
							<ul className="space-y-2 text-sm text-gray-500">
								{["Features", "Integrations", "Enterprise"].map((l) => (
									<li key={l}>
										<a
											href="#"
											className="hover:text-indigo-600 transition-colors"
										>
											{l}
										</a>
									</li>
								))}
							</ul>
						</div>

						<div>
							<h5 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
								Support
							</h5>
							<ul className="space-y-2 text-sm text-gray-500">
								{["Help Center", "Contact Us", "Privacy Policy"].map((l) => (
									<li key={l}>
										<a
											href="#"
											className="hover:text-indigo-600 transition-colors"
										>
											{l}
										</a>
									</li>
								))}
							</ul>
						</div>

						<div>
							<h5 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
								Connect
							</h5>
							<div className="flex gap-3">
								{["public", "share"].map((icon) => (
									<a
										key={icon}
										href="#"
										className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:text-indigo-600 transition-all"
									>
										<Icon name={icon} className="text-xl" />
									</a>
								))}
							</div>
						</div>
					</div>

					<div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
						<p className="text-xs text-gray-400">
							© 2024 Inductly Platform. All rights reserved.
						</p>
						<div className="flex gap-8 text-xs text-gray-400">
							<a href="#" className="hover:text-indigo-600 transition-colors">
								Terms of Service
							</a>
							<a href="#" className="hover:text-indigo-600 transition-colors">
								Cookie Policy
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
