import { useState, useEffect, useRef } from "react";
import { BATCHES, BRANCHES } from "../../../constants";
import { useDispatch } from "react-redux";
import {
	handleGetUserProfile,
	handleUpdateGithub,
	handleUpdateLinkedIn,
} from "../../../features/user/services/userServices";

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

const SOCIAL_LINKS = [
	{
		label: "GitHub",
		iconName: "code",
		iconBg: "bg-gray-900",
		dataKey: "github",
	},
	{
		label: "LinkedIn",
		iconName: "group",
		iconBg: "bg-blue-600",
		dataKey: "linkedin",
	},
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function Profile() {
	const dispatch = useDispatch();
	const [profileData, setProfileData] = useState<any>(null);
	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
		branch: "",
		batch: "",
	});
	const barRef = useRef(null);
	const fileInputRef = useRef(null);
	const [editingSocial, setEditingSocial] = useState<string | null>(null);
	const [socialInput, setSocialInput] = useState("");
	const [isEditingProfile, setIsEditingProfile] = useState(false);

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
			const pct = Math.round(
				(profileData.completedFields / profileData.totalFields) * 100,
			);
			barRef.current.style.width = "0%";
			const t = setTimeout(() => {
				barRef.current.style.width = `${pct}%`;
			}, 300);
			return () => clearTimeout(t);
		}
	}, [profileData]);

	const handleChange = (field) => (e) =>
		setForm((prev) => ({ ...prev, [field]: e.target.value }));

	const handleSocialSave = async (dataKey: string) => {
		if (!socialInput.trim()) return;
		const updateFn =
			dataKey === "github" ? handleUpdateGithub : handleUpdateLinkedIn;
		const updated = await updateFn(dispatch, socialInput);
		if (updated) {
			setProfileData((prev) =>
				prev ? { ...prev, [dataKey]: updated[dataKey] } : prev,
			);
			setEditingSocial(null);
			setSocialInput("");
		}
	};

	const handleSocialEdit = (dataKey: string, existingUrl?: string) => {
		setSocialInput(existingUrl || "");
		setEditingSocial(dataKey);
	};

	return (
		<div className="p-8" style={{ background: "#fcf8ff" }}>
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
										? Math.round(
												(profileData.completedFields /
													profileData.totalFields) *
													100,
											)
										: 0}
									%
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
										disabled
										className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 bg-gray-50 cursor-not-allowed opacity-70 outline-none"
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
										disabled
										className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 bg-gray-50 cursor-not-allowed opacity-70 outline-none"
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
										disabled={!isEditingProfile}
										className={`w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 outline-none transition-all ${
											isEditingProfile
												? "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
												: "bg-gray-50 cursor-not-allowed opacity-70"
										}`}
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
										disabled={!isEditingProfile}
										className={`w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 outline-none transition-all appearance-none ${
											isEditingProfile
												? "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
												: "bg-gray-50 cursor-not-allowed opacity-70"
										}`}
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
										disabled={!isEditingProfile}
										className={`w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 outline-none transition-all appearance-none ${
											isEditingProfile
												? "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
												: "bg-gray-50 cursor-not-allowed opacity-70"
										}`}
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
												? new Date(profileData.created_at).toLocaleDateString(
														"en-US",
														{
															year: "numeric",
															month: "short",
															day: "numeric",
														},
													)
												: ""
										}
										disabled
										className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 bg-gray-50 cursor-not-allowed opacity-70 outline-none"
									/>
								</div>

								{/* Submit */}
								<div className="md:col-span-2 pt-2">
									<button
										type="button"
										onClick={() => setIsEditingProfile(!isEditingProfile)}
										className="cursor-pointer px-8 py-3 text-white text-sm font-medium rounded-lg shadow-md active:scale-[0.98] transition-all"
										style={{
											background:
												"linear-gradient(135deg, #4f46e5 0%, #712ae2 100%)",
										}}
									>
										{isEditingProfile ? "Update Details" : "Edit Profile"}
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
								{SOCIAL_LINKS.map(({ label, iconName, iconBg, dataKey }) => {
									const url = profileData?.[dataKey];
									const isEditing = editingSocial === dataKey;
									return (
										<div
											key={label}
											className={`p-4 bg-gray-50 border border-gray-200 rounded-lg transition-colors ${
												!isEditing && url ? "group hover:border-indigo-500" : ""
											}`}
										>
											{isEditing ? (
												<div className="flex flex-col gap-2">
													<div className="flex items-center gap-2">
														<div
															className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}
														>
															<Icon
																name={iconName}
																className="text-white text-sm"
															/>
														</div>
														<input
															type="url"
															value={socialInput}
															onChange={(e) => setSocialInput(e.target.value)}
															placeholder={`Paste your ${label} profile URL`}
															className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
															autoFocus
														/>
													</div>
													<div className="flex justify-end gap-2">
														<button
															onClick={() => {
																setEditingSocial(null);
																setSocialInput("");
															}}
															className="text-sm cursor-pointer text-gray-500 hover:text-gray-700 px-3 py-1"
														>
															Cancel
														</button>
														<button
															onClick={() => handleSocialSave(dataKey)}
															disabled={!socialInput.trim()}
															className="text-sm cursor-pointer font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1 rounded-lg transition-colors"
														>
															Save
														</button>
													</div>
												</div>
											) : (
												<div className="flex items-center justify-between">
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
													{url ? (
														<div className="flex items-center gap-2">
															<a
																href={url}
																target="_blank"
																rel="noopener noreferrer"
																className="text-gray-400 group-hover:text-indigo-600 transition-colors"
															>
																<Icon name="open_in_new" className="text-xl" />
															</a>
															<button
																onClick={() => handleSocialEdit(dataKey, url)}
																className="text-gray-400 hover:text-indigo-600 transition-colors"
															>
																<Icon name="edit" className="text-lg" />
															</button>
														</div>
													) : (
														<button
															onClick={() => handleSocialEdit(dataKey)}
															className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
														>
															Add {label}
														</button>
													)}
												</div>
											)}
										</div>
									);
								})}
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
										<span className="text-base font-bold">Delete Account</span>
									</button>
									<p className="px-4 mt-2 text-xs text-gray-400 leading-relaxed">
										Deleting your account will permanently remove all induction
										data and club memberships.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
