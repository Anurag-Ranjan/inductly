import { useRef, useEffect } from "react";

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

function RightPanel() {
	const imgRef = useRef(null);
	const sectionRef = useRef(null);

	useEffect(() => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href =
			"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
		document.head.appendChild(link);
	}, []);

	// Parallax on mouse move over left panel
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
		<section
			ref={sectionRef}
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
					Elevating student club <br /> excellence through data.
				</h1>
				<p className="text-lg text-indigo-100 opacity-90 mb-16 leading-relaxed">
					Streamline your induction process, manage memberships, and foster
					engagement in one unified platform designed for academic success.
				</p>

				{/* Feature bento grid */}
				<div className="grid grid-cols-2 gap-4">
					<div className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
						<Icon name="verified_user" className="text-white mb-2 block" />
						<h4 className="text-sm font-medium text-white mb-1">
							Secure Inductions
						</h4>
						<p className="text-xs text-white/70 leading-relaxed">
							Verified onboarding for every member.
						</p>
					</div>
					<div className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
						<Icon name="analytics" className="text-white mb-2 block" />
						<h4 className="text-sm font-medium text-white mb-1">
							Insightful Analytics
						</h4>
						<p className="text-xs text-white/70 leading-relaxed">
							Track participation and growth trends.
						</p>
					</div>
				</div>

				{/* Illustration image */}
				<div className="mt-16 relative">
					<img
						ref={imgRef}
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuoRuCJlEggNiEqkMDOeUw8wv_rKIFjsJtLgKQsUPPeVe25HECHsjMwUbUyEt-6flYP8F8MAi6p-VSIDvuQSXTZIlIkOOReNTDbaGICuD-cQ_t1kuEPc6DTPbLaMvESoTdyGV16DcWg0MOaR7yE3dhq9xoHA-FEyw2ZK2MbxuwvJYxYkVMarH5x613qImGA1McJ5HrEOSR1KXvaawqV868vuE5fzm5a-LRvQGnetNLgCCG5Ya2xRg2DYaRICu1w4NHM7xyK_tuTPrJ"
						alt="Students collaborating"
						className="rounded-2xl shadow-2xl border-4 border-white/10 w-full"
						style={{ willChange: "transform" }}
					/>
				</div>
			</div>
		</section>
	);
}

export default RightPanel;
