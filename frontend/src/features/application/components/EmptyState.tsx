export default function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			{/* Illustration placeholder */}
			<div className="w-20 h-20 rounded-full bg-[#f5f2ff] flex items-center justify-center mb-8">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-10 h-10 text-[#3525cd]"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm6 13H6v-.9c0-2 4-3.1 6-3.1s6 1.1 6 3.1v.9z" />
				</svg>
			</div>
			<h2 className="text-[24px] leading-[32px] font-semibold tracking-[-0.01em] text-[#1b1b24] mb-2">
				No applications yet
			</h2>
			<p className="text-[16px] leading-[24px] text-[#464555] mb-8 max-w-md mx-auto">
				Explore clubs and organisations looking for new members. Start your
				journey today.
			</p>
			<button className="px-8 py-4 bg-[#4f46e5] text-white text-[14px] leading-[20px] font-medium rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
				Browse Available Inductions
			</button>
		</div>
	);
}
