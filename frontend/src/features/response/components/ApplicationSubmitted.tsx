import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";

export default function ApplicationSubmitted() {
	const iconRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		createConfetti();
		const icon: any = iconRef.current;
		if (icon) icon.addEventListener("click", createConfetti);
		return () => {
			if (icon) icon.removeEventListener("click", createConfetti);
		};
	}, []);

	function createConfetti() {
		const colors = ["#4f46e5", "#712ae2", "#a44100", "#3525cd"];
		for (let i = 0; i < 40; i++) {
			const el = document.createElement("div");
			el.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        border-radius: 2px;
        background-color: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        transform: scale(${Math.random()});
        opacity: ${Math.random()};
        pointer-events: none;
        z-index: 9999;
        animation: confettiFloat ${2 + Math.random() * 3}s ease-out forwards;
      `;
			document.body.appendChild(el);
			setTimeout(() => el.remove(), 5000);
		}
	}

	return (
		<>
			{/* Keyframes injected once */}
			<style>{`
        @keyframes confettiFloat {
          0%   { transform: translateY(0)     rotate(0deg);   opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes successPulse {
          0%, 100% { transform: scale(1);   opacity: 1; }
          50%       { transform: scale(1.1); opacity: 0.8; }
        }
        .success-pulse { animation: successPulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1); }
        @keyframes ping3s {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50%       { transform: scale(1.6); opacity: 0; }
        }
        .ping-slow { animation: ping3s 3s infinite; }
      `}</style>

			{/* Page wrapper */}
			<div className="bg-[#fcf8ff] text-[#1b1b24] min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
				{/* Atmospheric blobs */}
				<div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
					<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#3525cd]/5 blur-[120px] rounded-full" />
					<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#712ae2]/5 blur-[120px] rounded-full" />
				</div>

				{/* Main card */}
				<main className="w-full max-w-[560px] flex flex-col items-center text-center">
					{/* ── Icon cluster ── */}
					<div className="relative mb-8">
						{/* Pulsing icon */}
						<div
							ref={iconRef}
							className="success-pulse relative z-10 w-24 h-24 md:w-32 md:h-32 bg-[#3525cd]/10 rounded-full flex items-center justify-center text-[#3525cd] cursor-pointer"
						>
							{/* Inline SVG: check_circle filled */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-12 h-12 md:w-16 md:h-16"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.41 14.59L6.7 12.7a.996.996 0 1 1 1.41-1.41l2.47 2.47 5.3-5.3a.996.996 0 1 1 1.41 1.41l-5.99 6z" />
							</svg>
						</div>

						{/* Decorative rings */}
						<div className="absolute inset-0 -m-4 border border-[#3525cd]/10 rounded-full animate-ping opacity-20" />
						<div className="absolute inset-0 -m-8 border border-[#3525cd]/5  rounded-full ping-slow opacity-10" />
					</div>

					{/* ── Typography stack ── */}
					<div className="space-y-4 mb-12">
						<h1 className="text-[28px] leading-[34px] font-bold tracking-[-0.01em] md:text-[36px] md:leading-[44px] md:tracking-[-0.02em] text-[#1b1b24]">
							Application Submitted Successfully!
						</h1>
						<p className="text-[14px] leading-[20px] text-[#464555] pt-1">
							Want to join more?{" "}
							<Link
								to="/open-inductions"
								className="text-[#3525cd] hover:underline font-medium transition-all"
							>
								Apply to other clubs.
							</Link>
						</p>
					</div>

					{/* ── Action buttons ── */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-6">
						{/* Primary CTA */}
						<button
							onClick={() => navigate("/dashboard")}
							className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#3525cd] to-[#712ae2] text-white text-[14px] leading-[20px] font-medium rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 overflow-hidden"
						>
							<div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
							<span className="relative z-10 flex items-center justify-center gap-1">
								Go to Dashboard
								{/* arrow_forward icon */}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-5 h-5"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
								</svg>
							</span>
						</button>

						{/* Secondary CTA */}
						<button className="w-full sm:w-auto px-8 py-4 bg-[#f5f2ff] border border-[#c7c4d8] text-[#464555] text-[14px] leading-[20px] font-medium rounded-xl hover:bg-[#f0ecf9] hover:text-[#1b1b24] active:scale-95 transition-all duration-200">
							Browse More Inductions
						</button>
					</div>

					{/* ── Footer meta ── */}
					<div className="mt-12 py-6 border-t border-[#c7c4d8] w-full opacity-60">
						<div className="flex items-center justify-center gap-1 text-[#464555]" />
					</div>
				</main>
			</div>
		</>
	);
}
