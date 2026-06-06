import { useState, useEffect } from "react";
import { BATCHES, BRANCHES } from "../../../constants";
import { useNavigate } from "react-router";
import { handleUserOnboarding } from "../../../features/user/services/userServices";
import { useDispatch, useSelector } from "react-redux";

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

const STEP = 2;
const TOTAL_STEPS = 3;
const PROGRESS = Math.round((STEP / TOTAL_STEPS) * 100);

export default function Onboarding() {
	const [branch, setBranch] = useState("");
	const [batch, setBatch] = useState("");
	const [branchFocused, setBranchFocused] = useState(false);
	const [batchFocused, setBatchFocused] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth.user);

	useEffect(() => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href =
			"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
		document.head.appendChild(link);
	}, []);

	return (
		<div
			className="min-h-screen flex flex-col font-sans text-gray-900"
			style={{ background: "#fcf8ff" }}
		>
			{/* ── HEADER ── */}
			<header className="w-full h-16 flex items-center justify-between px-6 max-w-7xl mx-auto">
				<span className="text-2xl font-bold text-indigo-600 tracking-tight">
					Inductly
				</span>
				<div className="hidden md:flex items-center gap-3">
					<span className="text-sm font-medium text-gray-500">Help</span>
					<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
						<Icon name="help" className="text-gray-500 text-xl" />
					</div>
				</div>
			</header>

			{/* ── MAIN ── */}
			<main className="flex-grow flex items-center justify-center p-4">
				<div className="w-full max-w-[480px] space-y-8">
					{/* Progress indicator */}
					<div className="space-y-2">
						<div className="flex justify-between items-center mb-1">
							<span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
								Step {STEP} of {TOTAL_STEPS}
							</span>
							<span className="text-xs font-semibold text-gray-400">
								{PROGRESS}% Complete
							</span>
						</div>
						<div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
							<div
								className="h-full bg-indigo-600 rounded-full transition-all duration-500"
								style={{ width: `${PROGRESS}%` }}
							/>
						</div>
					</div>

					{/* Card */}
					<div
						className="rounded-xl shadow-lg p-8 space-y-6"
						style={{
							background: "rgba(255, 255, 255, 0.8)",
							backdropFilter: "blur(12px)",
							border: "1px solid rgba(226, 232, 240, 0.8)",
						}}
					>
						{/* Illustration */}
						<div className="flex justify-center">
							<div className="relative w-full h-48 bg-indigo-50 rounded-lg overflow-hidden flex items-center justify-center">
								<img
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuCP6lH7ksYRVZi9cPTK5uESUkWT1juoLJ7dVhJgjWpq5UpOTBupezgOrnDac5ji8uqoAavrVVVPpftFEKHuefqxm_UXtF0h34hLWLsgO60NlV7AdK2R4GQhZNFPO7xxWZxCBs9h6n81A4_yPC2LGGXB16EetJjlWN_Z7pLkPbANeWRbi_EiSyzjSyKGzYwvuiw0-Mw6d6FRFBMqcG_u_K_d828XYkga2qCw5ARaW5yllxbVajEfXxr6jljcjIuLv0ia_C08A_w-POcW"
									alt="Student Onboarding"
									className="object-cover w-full h-full mix-blend-multiply opacity-80"
								/>
								{/* Fade-out gradient at the bottom */}
								<div className="absolute inset-0 bg-gradient-to-t from-indigo-50 to-transparent pointer-events-none" />
							</div>
						</div>

						{/* Text header */}
						<div className="text-center space-y-1">
							<h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
								Tell us about your studies
							</h1>
						</div>

						{/* Form */}
						<form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
							{/* Academic Branch */}
							<div className="space-y-1">
								<label
									htmlFor="branch"
									className="block text-sm font-medium text-gray-500"
								>
									Academic Branch
								</label>
								<div className="relative">
									<select
										id="branch"
										value={branch}
										onChange={(e) => setBranch(e.target.value)}
										onFocus={() => setBranchFocused(true)}
										onBlur={() => setBranchFocused(false)}
										className="w-full h-12 bg-white border border-gray-300 rounded-lg px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
									<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
										<Icon
											name="expand_more"
											className={`text-xl transition-colors ${branchFocused ? "text-indigo-600" : "text-gray-500"}`}
										/>
									</div>
								</div>
							</div>

							{/* Graduation Batch */}
							<div className="space-y-1">
								<label
									htmlFor="batch"
									className="block text-sm font-medium text-gray-500"
								>
									Graduation Batch
								</label>
								<div className="relative">
									<select
										id="batch"
										value={batch}
										onChange={(e) => setBatch(e.target.value)}
										onFocus={() => setBatchFocused(true)}
										onBlur={() => setBatchFocused(false)}
										className="w-full h-12 bg-white border border-gray-300 rounded-lg px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
									<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
										<Icon
											name="calendar_month"
											className={`text-xl transition-colors ${batchFocused ? "text-indigo-600" : "text-gray-500"}`}
										/>
									</div>
								</div>
							</div>

							{/* CTA Button */}
							<div className="pt-4">
								<button
									onClick={(e) => {
										e.preventDefault();
										handleUserOnboarding(
											{ batch, branch },
											dispatch,
											navigate,
											user,
										);
									}}
									type="button"
									className="w-full h-12 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg active:scale-[0.97] transition-all flex items-center justify-center gap-2 group"
									style={{
										background: "linear-gradient(to right, #3525cd, #712ae2)",
									}}
								>
									Continue
									<Icon
										name="arrow_forward"
										className="text-xl group-hover:translate-x-1 transition-transform"
									/>
								</button>
							</div>
						</form>

						{/* Skip link */}
						<div className="text-center">
							<button
								onClick={() => {
									// navigate("/dashboard");
								}}
								className="text-xs font-semibold text-gray-400 hover:text-indigo-600 transition-colors tracking-wide uppercase"
							>
								I'll do this later
							</button>
						</div>
					</div>

					{/* Security note */}
					<div className="flex items-center justify-center gap-1 text-gray-400 opacity-60">
						<Icon name="lock" className="text-base" />
						<span className="text-xs font-semibold tracking-wide">
							Your data is stored securely in the Inductly cloud.
						</span>
					</div>
				</div>
			</main>

			{/* ── FOOTER ── */}
			<footer className="w-full py-6 border-t border-gray-200 mt-auto bg-white">
				<div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
					<div className="flex gap-6">
						<a
							href="#"
							className="text-xs font-semibold text-gray-400 hover:text-indigo-600 transition-colors tracking-wide"
						>
							Privacy Policy
						</a>
						<a
							href="#"
							className="text-xs font-semibold text-gray-400 hover:text-indigo-600 transition-colors tracking-wide"
						>
							Terms of Service
						</a>
					</div>
					<p className="text-xs font-semibold text-gray-400 tracking-wide">
						© 2024 Inductly Education Solutions.
					</p>
				</div>
			</footer>
		</div>
	);
}
