import { useState } from "react";
import { useGetOpenInductionsQuery } from "../../../features/induction/inductionApi";
import { useNavigate } from "react-router";

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

function formatDate(dateStr: string | null) {
	if (!dateStr) return "—";
	const d = new Date(dateStr);
	return d.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export default function OpenInductions() {
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const navigate = useNavigate();

	const { data, isLoading } = useGetOpenInductionsQuery(page);

	const responseData = data?.data;
	const rawInductions = responseData?.inductions || [];

	const filteredInductions = rawInductions.filter((item: any) => {
		const term = searchTerm.toLowerCase();
		return (
			item.clubName.toLowerCase().includes(term) ||
			item.inductionTitle.toLowerCase().includes(term) ||
			(item.inductionDescription || "").toLowerCase().includes(term)
		);
	});

	const totalPages = responseData?.totalPages || 1;

	return (
		<div className="bg-[#fcf8ff] font-['Inter',sans-serif] text-base text-[#1b1b24] selection:bg-[#e2dfff] selection:text-[#0f0069] antialiased min-h-screen">
			<style>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
      `}</style>

			<header className="max-w-[1280px] mx-auto px-6 pt-12 pb-8 text-center md:text-left">
				<h1 className="text-[28px] leading-[34px] tracking-[-0.01em] font-bold md:text-[36px] md:leading-[44px] md:tracking-[-0.02em] text-[#1b1b24] mb-1">
					Open Inductions
				</h1>
				<p className="text-lg text-[#464555] max-w-2xl">
					Explore clubs that are currently recruiting and apply before the
					deadline.
				</p>
			</header>

			<section className="max-w-[1280px] mx-auto px-6 mb-8">
				<div className="flex flex-col md:flex-row gap-4 items-center bg-[#ffffff] p-4 rounded-xl border border-[#c7c4d8] shadow-sm">
					<div className="relative w-full md:flex-grow">
						<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#464555]">
							search
						</span>
						<input
							className="w-full pl-12 pr-4 py-2 rounded-lg border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20 bg-[#fcf8ff] text-base transition-all outline-none"
							placeholder="Search by club or induction title..."
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<div className="relative w-full md:w-64">
						<select className="w-full px-4 py-2 rounded-lg border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20 bg-[#fcf8ff] text-base appearance-none cursor-pointer outline-none">
							<option value="closing">Closing Soon</option>
							<option value="recent">Recently Opened</option>
							<option value="alpha">Alphabetical</option>
						</select>
						<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#464555]">
							expand_more
						</span>
					</div>
				</div>
			</section>

			<main className="max-w-[1280px] mx-auto px-6 pb-16">
				{isLoading ? (
					<div className="flex justify-center py-16">
						<Icon
							name="sync"
							className="text-4xl text-[#712ae2] animate-spin"
						/>
					</div>
				) : filteredInductions.length > 0 ? (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredInductions.map((induction: any) => (
								<article
									key={induction.inductionId}
									className="bg-white border border-[#c7c4d8] rounded-xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative group"
								>
									<div className="flex items-start gap-4 mb-4">
										<div className="w-14 h-14 rounded-xl overflow-hidden border border-[#c7c4d8] bg-[#f0ecf9] flex-shrink-0">
											{induction.clubLogo ? (
												<img
													alt={`${induction.clubName} Logo`}
													className="w-full h-full object-cover"
													src={induction.clubLogo}
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center text-sm font-bold text-[#712ae2]">
													{induction.clubName.charAt(0)}
												</div>
											)}
										</div>
										<div className="flex-grow">
											<span className="text-xs tracking-[0.05em] font-semibold text-[#712ae2] uppercase block">
												{induction.clubName}
											</span>
											<h2 className="text-xl font-semibold text-[#1b1b24] line-clamp-1">
												{induction.inductionTitle}
											</h2>
										</div>
										<span className="bg-emerald-50 text-emerald-700 px-2 py-[2px] rounded-full text-xs tracking-[0.05em] font-semibold border border-emerald-100">
											Open
										</span>
									</div>
									<p className="text-base text-[#464555] mb-6 line-clamp-2">
										{induction.inductionDescription}
									</p>
									<div className="space-y-2 mb-8 mt-auto">
										<div className="flex items-center gap-2 text-[#464555] text-sm">
											<span className="material-symbols-outlined text-[20px]">
												calendar_today
											</span>
											<span>Starts: {formatDate(induction.startDate)}</span>
										</div>
										<div className="flex items-center gap-2 text-[#ba1a1a] text-sm">
											<span className="material-symbols-outlined text-[20px]">
												schedule
											</span>
											<span>Closes: {formatDate(induction.closeDate)}</span>
										</div>
									</div>
									<button
										onClick={() => {
											navigate(
												`/${induction.clubId}/${induction.inductionId}/${induction.formId}/apply`,
											);
										}}
										className="w-full py-4 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#712ae2] hover:-translate-y-[1px] hover:shadow-[0_10px_15px_-3px_rgba(79,70,229,0.3)] active:scale-[0.98] transition-all duration-200 text-[#ffffff] text-sm font-medium"
									>
										Apply Now
									</button>
								</article>
							))}
						</div>

						{/* Pagination */}
						{responseData && totalPages > 1 && (
							<div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-10">
								<p className="text-sm text-[#464555] whitespace-nowrap">
									Showing {(responseData.page - 1) * responseData.limit + 1} to{" "}
									{(responseData.page - 1) * responseData.limit +
										rawInductions.length}{" "}
									of {responseData.total} inductions
								</p>
								<div className="flex items-center gap-2">
									<button
										disabled={!responseData.hasPrevPage}
										onClick={() => setPage((p) => p - 1)}
										className="p-2 rounded-lg text-[#464555] hover:text-[#1b1b24] hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
									>
										<Icon name="chevron_left" className="text-xl" />
									</button>
									{Array.from({ length: totalPages }, (_, i) => i + 1).map(
										(n) => (
											<button
												key={n}
												onClick={() => setPage(n)}
												className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
													n === page
														? "bg-indigo-600 text-white"
														: "text-[#464555] hover:bg-gray-100"
												}`}
											>
												{n}
											</button>
										),
									)}
									<button
										disabled={!responseData.hasNextPage}
										onClick={() => setPage((p) => p + 1)}
										className="p-2 rounded-lg text-[#464555] hover:text-[#1b1b24] hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
									>
										<Icon name="chevron_right" className="text-xl" />
									</button>
								</div>
							</div>
						)}
					</>
				) : (
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<div className="w-64 h-64 mb-8 opacity-80">
							<span
								className="material-symbols-outlined text-[120px] text-[#e4e1ee]"
								style={{ fontVariationSettings: "'FILL' 1" }}
							>
								inbox
							</span>
						</div>
						<h3 className="text-xl font-semibold text-[#1b1b24] mb-1">
							No open inductions available right now
						</h3>
						<p className="text-base text-[#464555] max-w-md mx-auto">
							Check back later for upcoming recruitment opportunities. We'll
							notify you when new clubs start their applications.
						</p>
						<button className="mt-8 px-8 py-4 bg-[#712ae2] text-[#ffffff] rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
							Notify Me
						</button>
					</div>
				)}
			</main>
		</div>
	);
}
