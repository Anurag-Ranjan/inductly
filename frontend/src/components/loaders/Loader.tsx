import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const icons = [
	{
		key: "applicant",
		path: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
	},
	{
		key: "laptop",
		path: "M20 16V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8m16 0H4m16 0a2 2 0 012 2v1H2v-1a2 2 0 012-2",
	},
	{
		key: "application",
		path: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
	},
];

export default function Loader() {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setIndex((prev) => (prev + 1) % icons.length);
		}, 2200);

		return () => clearInterval(timer);
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="
        fixed inset-0
        z-[999999]
        flex items-center justify-center
        bg-white/40
        backdrop-blur-2xl
      "
		>
			<div className="relative flex flex-col items-center">
				{/* Glass Card */}
				<motion.div
					animate={{
						y: [0, -12, 0],
					}}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className="
            relative
            flex items-center justify-center

            w-40 h-40
            md:w-48 md:h-48

            rounded-[2.5rem]

            bg-white/60
            backdrop-blur-md

            border border-white/50

            shadow-[0_20px_50px_-12px_rgba(0,0,0,0.10)]
          "
				>
					{/* Glow */}
					<div
						className="
              absolute inset-0
              rounded-full
              bg-indigo-500/10
              blur-3xl
            "
					/>

					{/* SVG */}
					<svg
						viewBox="0 0 24 24"
						fill="none"
						className="
              relative
              w-20 h-20
              md:w-24 md:h-24
              text-indigo-600
            "
					>
						<AnimatePresence mode="wait">
							<motion.path
								key={icons[index].key}
								d={icons[index].path}
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								initial={{
									opacity: 0,
									scale: 0.8,
								}}
								animate={{
									opacity: 1,
									scale: 1,
								}}
								exit={{
									opacity: 0,
									scale: 1.15,
								}}
								transition={{
									duration: 0.7,
									ease: [0.4, 0, 0.2, 1],
								}}
							/>
						</AnimatePresence>
					</svg>
				</motion.div>

				{/* Text */}
				<motion.p
					animate={{
						opacity: [0.5, 1, 0.5],
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
					}}
					className="
            mt-8
            text-xs sm:text-sm
            font-medium
            uppercase
            tracking-[0.25em]
            text-neutral-800
          "
				>
					LOADING ...
				</motion.p>
			</div>
		</motion.div>
	);
}
