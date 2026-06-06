import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleUserLogin } from "../../../features/auth/services/authServices";
import { useNavigate } from "react-router";
import { setLoading } from "../../../features/auth/authSlice";

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

function IconFill({ name, className = "" }) {
	return (
		<span
			className={`material-symbols-outlined ${className}`}
			style={{
				fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
			}}
		>
			{name}
		</span>
	);
}

export default function SignIn() {
	const [showPassword, setShowPassword] = useState(false);
	const imgRef = useRef(null);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const loading = useSelector((state) => state.auth.loading);

	useEffect(() => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href =
			"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
		document.head.appendChild(link);
	}, []);

	const handleMouseMove = (e) => {
		if (!imgRef.current) return;
		const xAxis = (window.innerWidth / 4 - e.pageX) / 50;
		const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
		imgRef.current.style.transition = "none";
		imgRef.current.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
	};

	const handleMouseLeave = () => {
		if (!imgRef.current) return;
		imgRef.current.style.transition = "all 0.5s ease";
		imgRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
	};

	return (
		<div className="min-h-screen flex flex-col md:flex-row bg-white text-gray-900 font-sans overflow-x-hidden">
			{/* ── LEFT PANEL ── */}
			<section
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				className="hidden md:flex w-1/2 relative overflow-hidden bg-indigo-600 items-center justify-center p-16"
			>
				{/* Dot-grid pattern */}
				<div
					className="absolute inset-0 opacity-20 pointer-events-none"
					style={{
						backgroundImage:
							"radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
						backgroundSize: "40px 40px",
					}}
				/>

				<div className="relative z-10 w-full max-w-xl">
					{/* Branding */}
					<div className="flex items-center gap-2 mb-16">
						<div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
							<IconFill name="school" className="text-indigo-600 font-bold" />
						</div>
						<span className="text-2xl font-bold text-white tracking-tight">
							Inductly
						</span>
					</div>

					{/* Headline */}
					<h1 className="text-4xl font-bold text-white mb-6 leading-tight tracking-tight">
						Welcome back. <br /> Your clubs are waiting.
					</h1>
					<p className="text-lg text-indigo-100 opacity-90 mb-16 leading-relaxed">
						Sign in to manage your inductions, track applications, and stay
						connected with your campus community.
					</p>

					{/* Feature bento grid */}
					<div className="grid grid-cols-2 gap-4">
						<div className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
							<Icon name="track_changes" className="text-white mb-2 block" />
							<h4 className="text-sm font-medium text-white mb-1">
								Track Applications
							</h4>
							<p className="text-xs text-white/70 leading-relaxed">
								Stay updated on every stage of your induction.
							</p>
						</div>
						<div className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
							<Icon
								name="notifications_active"
								className="text-white mb-2 block"
							/>
							<h4 className="text-sm font-medium text-white mb-1">
								Live Notifications
							</h4>
							<p className="text-xs text-white/70 leading-relaxed">
								Never miss an interview or result update.
							</p>
						</div>
					</div>

					{/* Illustration image */}
					{/* <div className="mt-16 relative">
						<img
							ref={imgRef}
							src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuoRuCJlEggNiEqkMDOeUw8wv_rKIFjsJtLgKQsUPPeVe25HECHsjMwUbUyEt-6flYP8F8MAi6p-VSIDvuQSXTZIlIkOOReNTDbaGICuD-cQ_t1kuEPc6DTPbLaMvESoTdyGV16DcWg0MOaR7yE3dhq9xoHA-FEyw2ZK2MbxuwvJYxYkVMarH5x613qImGA1McJ5HrEOSR1KXvaawqV868vuE5fzm5a-LRvQGnetNLgCCG5Ya2xRg2DYaRICu1w4NHM7xyK_tuTPrJ"
							alt="Students collaborating"
							className="rounded-2xl shadow-2xl border-4 border-white/10 w-full"
							style={{ willChange: "transform" }}
						/>
					</div> */}
				</div>
			</section>

			{/* ── RIGHT PANEL: LOGIN FORM ── */}
			<section className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-16 bg-white">
				<div className="w-full max-w-md">
					{/* Mobile branding */}
					<div className="md:hidden flex items-center gap-2 mb-8">
						<IconFill name="school" className="text-indigo-600 text-3xl" />
						<span className="text-2xl font-bold text-indigo-600">Inductly</span>
					</div>

					{/* Header */}
					<div className="mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-1">
							Sign in to your account
						</h2>
						<p className="text-base text-gray-500">
							Welcome back! Enter your credentials to continue.
						</p>
					</div>

					{/* Google OAuth */}
					<button className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm mb-6">
						<svg className="w-5 h-5" viewBox="0 0 24 24">
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								fill="#4285F4"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853"
							/>
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81.64z"
								fill="#FBBC05"
							/>
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								fill="#EA4335"
							/>
						</svg>
						Continue with Google
					</button>

					{/* Divider */}
					<div className="relative flex items-center mb-6">
						<div className="flex-grow border-t border-gray-200" />
						<span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest bg-white">
							or
						</span>
						<div className="flex-grow border-t border-gray-200" />
					</div>

					{/* Form */}
					<form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
						{/* Email */}
						<div className="space-y-1">
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-800"
							>
								Email
							</label>
							<div className="relative group">
								<Icon
									name="mail"
									className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors text-xl pointer-events-none"
								/>
								<input
									id="email"
									type="email"
									placeholder="name@university.edu"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
								/>
							</div>
						</div>

						{/* Password */}
						<div className="space-y-1">
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-800"
								>
									Password
								</label>
								<a
									href="#"
									className="text-xs font-medium text-indigo-600 hover:underline transition-colors"
								>
									Forgot password?
								</a>
							</div>
							<div className="relative group">
								<Icon
									name="lock"
									className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors text-xl pointer-events-none"
								/>
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full pl-11 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
								/>
								<button
									type="button"
									onClick={() => setShowPassword((v) => !v)}
									className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									<Icon
										name={showPassword ? "visibility_off" : "visibility"}
										className="text-xl"
									/>
								</button>
							</div>
						</div>

						{/* Submit */}
						<button
							disabled={loading}
							type="submit"
							className="disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer w-full flex items-center justify-center gap-2 py-3 px-6 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98] transition-all mt-2"
							style={{
								background: "linear-gradient(135deg, #4f46e5 0%, #712ae2 100%)",
							}}
							onClick={(e) => {
								e.preventDefault();
								handleUserLogin(dispatch, navigate, { email, password });
								setEmail("");
								setPassword("");
								setShowPassword(false);
								dispatch(setLoading(false));
							}}
						>
							Sign In
							<Icon name="arrow_forward" className="text-xl" />
						</button>
					</form>

					{/* Footer */}
					<div className="mt-10 text-center flex justify-center">
						<div className="text-base text-gray-500 flex gap-1">
							Don't have an account?
							<p
								onClick={() => navigate("/sign-up")}
								className="text-indigo-600 font-bold hover:underline ml-1 transition-colors cursor-pointer"
							>
								Sign Up
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
