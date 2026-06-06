import { useState, useEffect, useRef } from "react";
import { BATCHES, BRANCHES } from "../../../constants";
import { useDispatch } from "react-redux";
import { handleGetUserProfile } from "../../../features/user/services/userServices";

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
	{ icon: "dashboard", label: "Dashboard" },
	{ icon: "groups", label: "My Clubs" },
	{ icon: "campaign", label: "Open Inductions" },
	{ icon: "description", label: "Applications" },
	{ icon: "person", label: "Profile", active: true },
	{ icon: "settings", label: "Settings" },
];

const SOCIAL_LINKS = [
	{
		label: "GitHub",
		iconName: "code",
		iconBg: "bg-gray-900",
	},
	{
		label: "LinkedIn",
		iconName: "group",
		iconBg: "bg-blue-600",
	},
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function Profile() {
	const dispatch = useDispatch();
	const [activeNav, setActiveNav] = useState("Profile");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [profileData, setProfileData] = useState(null);
	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
		branch: "",
		batch: "",
	});
	const barRef = useRef(null);
	const fileInputRef = useRef(null);

	useEffect(() => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href =
			"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
		document.head.appendChild(link);
	}, []);

	// Fetch profile data on mount
	useEffect(() => {
		const fetchProfile = async () => {
			const data = await handleGetUserProfile(dispatch);
			if (data) {
				setProfileData(data);
				setForm({
					name: data.name || "",
					email: data.email || "",
					phone: data.mobile_number || "",
					branch: data.branch || "",
					batch: data.batch || "",
				});
			}
		};
		fetchProfile();
	}, []);

	// Animate progress bar when profileData loads
	useEffect(() => {
		if (barRef.current && profileData?.totalFields) {
			const pct = Math.round((profileData.completedFields / profileData.totalFields) * 100);
			barRef.current.style.width = "0%";
			const t = setTimeout(() => {
				barRef.current.style.width = `${pct}%`;
			}, 300);
			return () => clearTimeout(t);
		}
	}, [profileData]);

	const handleChange = (field) => (e) =>
		setForm((prev) => ({ ...prev, [field]: e.target.value }));

	return (
		<div
			className="min-h-screen flex font-sans text-gray-900"
			style={{ background: "#fcf8ff" }}
		>
			{/* ── SIDEBAR ── */}
			<aside
				className={`flex flex-col gap-2 p-4 h-screen fixed left-0 top-0 border-r border-gray-200 w-64 z-50 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
				style={{ background: "#f5f2ff" }}
			>
				<div className="mb-8 px-3">
					<h1 className="text-xl font-bold text-indigo-600 leading-tight">
						Inductly
					</h1>
					<p className="text-xs font-semibold text-gray-400 tracking-wide mt-0.5">
						Student Portal
					</p>
				</div>

				<nav className="flex flex-col gap-1 flex-1">
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
			<div className="md:ml-64 flex-1 flex flex-col min-h-screen">
				{/* ── TOP BAR ── */}
				<header className="flex justify-between items-center w-full px-6 h-20 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
					<button
						className="md:hidden mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
						onClick={() => setSidebarOpen(true)}
					>
						<Icon name="menu" className="text-gray-500 text-2xl" />
					</button>

					<div className="flex items-center gap-4 flex-1">
						<div className="relative w-full max-w-md">
							<Icon
								name="search"
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none"
							/>
							<input
								type="text"
								placeholder="Search profiles or inductions..."
								className="w-full bg-gray-100 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
							/>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<button className="hover:bg-gray-100 rounded-full p-2 transition-all active:scale-95">
							<Icon name="notifications" className="text-gray-500 text-xl" />
						</button>
						<button className="hover:bg-gray-100 rounded-full p-2 transition-all active:scale-95">
							<Icon name="help" className="text-gray-500 text-xl" />
						</button>
						<div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-200">
							{profileData?.profile_picture ? (
								<img
									src={profileData.profile_picture}
									alt="User"
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
									{profileData?.name?.charAt(0) || "U"}
								</div>
							)}
						</div>
					</div>
				</header>

				{/* ── PAGE CANVAS ── */}
				<main className="p-8 flex-1" style={{ background: "#fcf8ff" }}>
					<div className="max-w-7xl mx-auto space-y-8">
						{/* ── PROFILE HEADER ── */}
						<section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
							{/* Watermark icon */}
							<div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
								<Icon
									name="account_circle"
									className="text-indigo-600"
									style={{ fontSize: "120px" }}
								/>
							</div>

							{/* Avatar */}
							<div className="relative group flex-shrink-0">
								<div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
									{profileData?.profile_picture ? (
										<img
											src={profileData.profile_picture}
											alt={profileData.name || "User"}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-3xl">
											{profileData?.name?.charAt(0) || "U"}
										</div>
									)}
								</div>
								<input
									type="file"
									accept="image/*"
									ref={fileInputRef}
									className="hidden"
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file) {
											// handle file upload
										}
									}}
								/>
								<button
									className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-md hover:scale-105 transition-transform"
									onClick={() => fileInputRef.current?.click()}
								>
									<Icon name="photo_camera" className="text-sm" />
								</button>
							</div>

							{/* Info */}
							<div className="flex-1 space-y-2 text-center md:text-left">
								<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
									<h2 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">
										{profileData?.name || "User"}
									</h2>
								</div>
								<p className="text-base text-gray-500">
									{profileData?.email || ""}
								</p>

								{/* Completion bar */}
								<div className="mt-4 space-y-1 max-w-sm mx-auto md:mx-0">
									<div className="flex justify-between items-end">
										<span className="text-sm font-medium text-gray-700">
											Profile Completion
										</span>
										<span className="text-sm font-bold text-indigo-600">
											{profileData?.totalFields
												? Math.round((profileData.completedFields / profileData.totalFields) * 100)
												: 0}%
										</span>
									</div>
									<div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
										<div
											ref={barRef}
											className="h-full bg-indigo-600 rounded-full transition-all duration-700"
											style={{ width: "0%" }}
										/>
									</div>
								</div>
							</div>

						</section>

						{/* ── TWO-COLUMN GRID ── */}
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
							{/* ── LEFT COLUMN ── */}
							<div className="lg:col-span-8 space-y-8">
								{/* Personal Info Card */}
								<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
									<div className="flex items-center gap-3 mb-8">
										<div className="bg-indigo-50 p-2 rounded-lg">
											<Icon
												name="person_outline"
												className="text-indigo-600 text-xl"
											/>
										</div>
										<h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
											Personal Information
										</h3>
									</div>

									<form
										className="grid grid-cols-1 md:grid-cols-2 gap-6"
										onSubmit={(e) => e.preventDefault()}
									>
										{/* Full Name */}
										<div className="space-y-1">
											<label className="block text-sm font-medium text-gray-500">
												Full Name
											</label>
											<input
												type="text"
												value={form.name}
												onChange={handleChange("name")}
												className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
											/>
										</div>

										{/* Email */}
										<div className="space-y-1">
											<label className="block text-sm font-medium text-gray-500">
												Email Address
											</label>
											<input
												type="email"
												value={form.email}
												onChange={handleChange("email")}
												className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
											/>
										</div>

										{/* Phone */}
										<div className="space-y-1">
											<label className="block text-sm font-medium text-gray-500">
												Phone Number
											</label>
											<input
												type="tel"
												value={form.phone}
												onChange={handleChange("phone")}
												className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
											/>
										</div>

										{/* Branch */}
										<div className="space-y-1">
											<label className="block text-sm font-medium text-gray-500">
												Branch
											</label>
											<select
												value={form.branch}
												onChange={handleChange("branch")}
												className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none bg-white"
											>
												<option value="" disabled>
													Select your branch
												</option>
												{BRANCHES.map((b) => (
													<option key={b.value} value={b.value}>
														{b.label}
													</option>
												))}
											</select>
										</div>

										{/* Batch */}
										<div className="space-y-1">
											<label className="block text-sm font-medium text-gray-500">
												Batch
											</label>
											<select
												value={form.batch}
												onChange={handleChange("batch")}
												className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none bg-white"
											>
												<option value="" disabled>
													Select your year
												</option>
												{BATCHES.map((b) => (
													<option key={b.value} value={b.value}>
														{b.label}
													</option>
												))}
											</select>
										</div>

										{/* Joined On */}
										<div className="space-y-1">
											<label className="block text-sm font-medium text-gray-500">
												Joined On
											</label>
											<input
												type="text"
												value={
													profileData?.created_at
														? new Date(profileData.created_at).toLocaleDateString("en-US", {
																year: "numeric",
																month: "short",
																day: "numeric",
														  })
														: ""
												}
												disabled
												className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 bg-gray-50 cursor-not-allowed opacity-70 outline-none"
											/>
										</div>

										{/* Submit */}
										<div className="md:col-span-2 pt-2">
											<button
												type="submit"
												className="px-8 py-3 text-white text-sm font-medium rounded-lg shadow-md active:scale-[0.98] transition-all"
												style={{
													background:
														"linear-gradient(135deg, #4f46e5 0%, #712ae2 100%)",
												}}
											>
												Update Details
											</button>
										</div>
									</form>
								</div>
							</div>

							{/* ── RIGHT COLUMN ── */}
							<div className="lg:col-span-4 space-y-8">
								{/* Social Links */}
								<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
									<div className="flex items-center gap-3 mb-6">
										<div className="bg-purple-50 p-2 rounded-lg">
											<Icon name="link" className="text-purple-600 text-xl" />
										</div>
										<h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
											Social Links
										</h3>
									</div>

									<div className="space-y-3">
										{SOCIAL_LINKS.map(({ label, iconName, iconBg }) => (
											<div
												key={label}
												className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg group hover:border-indigo-500 transition-colors"
											>
												<div className="flex items-center gap-3">
													<div
														className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center`}
													>
														<Icon
															name={iconName}
															className="text-white text-sm"
														/>
													</div>
													<span className="text-base text-gray-900">
														{label}
													</span>
												</div>
												<a
													href="#"
													className="text-gray-400 group-hover:text-indigo-600 transition-colors"
												>
													<Icon name="open_in_new" className="text-xl" />
												</a>
											</div>
										))}
									</div>
								</div>

								{/* Account Actions */}
								<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
									<div className="flex items-center gap-3 mb-6">
										<div className="bg-red-50 p-2 rounded-lg">
											<Icon name="security" className="text-red-500 text-xl" />
										</div>
										<h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
											Account
										</h3>
									</div>

									<div className="space-y-2">
										<button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg group">
											<div className="flex items-center gap-3">
												<Icon
													name="lock_reset"
													className="text-gray-400 group-hover:text-indigo-600 text-xl transition-colors"
												/>
												<span className="text-base text-gray-900">
													Change Password
												</span>
											</div>
											<Icon
												name="chevron_right"
												className="text-gray-400 text-xl"
											/>
										</button>

										<div className="pt-4 border-t border-gray-200 mt-4">
											<button className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 transition-colors rounded-lg">
												<Icon name="delete_forever" className="text-xl" />
												<span className="text-base font-bold">
													Delete Account
												</span>
											</button>
											<p className="px-4 mt-2 text-xs text-gray-400 leading-relaxed">
												Deleting your account will permanently remove all
												induction data and club memberships.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
