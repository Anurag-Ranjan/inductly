interface FormHeaderProps {
	clubName: string;
	clubLogo?: string | null;
	formTitle: string;
	formDescription?: string | null;
}

export default function FormHeader({
	clubName,
	clubLogo,
	formTitle,
	formDescription,
}: FormHeaderProps) {
	return (
		<header className="bg-white border border-[#c7c4d8] rounded-[16px] overflow-hidden shadow-md">
			<div className="h-2 bg-gradient-to-br from-[#4f46e5] to-[#712ae2]"></div>
			<div className="p-6 md:p-8">
				<div className="flex items-center gap-4 mb-6">
					<div className="w-16 h-16 rounded-xl bg-[#f0ecf9] flex items-center justify-center overflow-hidden border border-[#c7c4d8] flex-shrink-0">
						{clubLogo && (
							<img
								alt={`${clubName} logo`}
								className="w-full h-full object-cover"
								src={clubLogo}
							/>
						)}
					</div>
					<div>
						<h2 className="text-2xl font-semibold text-[#1b1b24]">
							{clubName}
						</h2>
						<span className="text-xs font-semibold text-[#777587] uppercase tracking-wider block mt-1">
							Application Form
						</span>
					</div>
				</div>

				<h1 className="text-[28px] md:text-[32px] font-bold leading-tight text-[#1b1b24] mb-4">
					{formTitle}
				</h1>
				{formDescription && (
					<p className="text-base text-[#464555] leading-relaxed mb-6">
						{formDescription}
					</p>
				)}

				<div className="pt-4 border-t border-[#c7c4d8]">
					<p className="text-[#ba1a1a] font-medium text-sm">
						* Indicates required question
					</p>
				</div>
			</div>
		</header>
	);
}
