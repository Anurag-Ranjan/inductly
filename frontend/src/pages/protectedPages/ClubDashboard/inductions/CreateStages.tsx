import { useEffect, useState } from "react";

export default function CreateStages() {
	const [progress, setProgress] = useState(0);

	// Trigger the progress bar animation on mount, matching the original script
	useEffect(() => {
		const timer = setTimeout(() => {
			setProgress(50);
		}, 100);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
			{/* Material Symbols Import */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            vertical-align: middle;
        }
      `,
				}}
			/>

			<main className="flex-grow flex flex-col items-center py-8 px-4 md:px-6">
				{/* Progress Indicator Section */}
				<div className="w-full max-w-3xl mb-8">
					<div className="flex justify-between items-end mb-2">
						<div>
							<span className="text-indigo-600 font-bold text-sm tracking-wide uppercase">
								Step 2 of 4
							</span>
							<h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mt-1">
								Define Induction Stages
							</h1>
						</div>
						<span className="text-slate-600 text-sm font-medium">
							50% Complete
						</span>
					</div>
					<div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
						<div
							className="h-full bg-indigo-600 transition-all duration-700 ease-out"
							style={{ width: `${progress}%` }}
						></div>
					</div>
					<p className="text-slate-600 mt-4 text-base">
						Create the sequential steps for your induction process (e.g., Online
						Test, Technical Interview).
					</p>
				</div>

				{/* Stage Configuration Canvas */}
				<div className="w-full max-w-3xl space-y-6">
					{/* Existing Stage Card 1 */}
					<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm group hover:shadow-md transition-shadow relative overflow-hidden">
						<div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>
						<div className="flex justify-between items-start mb-4">
							<div className="flex items-center gap-2">
								<div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
									1
								</div>
								<span className="text-sm font-medium text-slate-600 uppercase tracking-widest">
									Initial Assessment
								</span>
							</div>
							<div className="flex gap-1">
								<button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
									<span className="material-symbols-outlined text-[20px]">
										drag_indicator
									</span>
								</button>
								<button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
									<span className="material-symbols-outlined text-[20px]">
										delete
									</span>
								</button>
							</div>
						</div>
						<div className="space-y-4">
							<div>
								<label className="block text-xs font-semibold text-slate-600 mb-1 ml-1">
									Stage Name
								</label>
								<input
									className="w-full bg-white border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-lg px-4 py-2 text-base text-slate-900 transition-all outline-none placeholder:text-slate-400"
									placeholder="e.g. Technical Interview"
									type="text"
									defaultValue="Online Proficiency Test"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 mb-1 ml-1">
									Stage Description
								</label>
								<textarea
									className="w-full bg-white border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-lg px-4 py-2 text-base text-slate-900 transition-all outline-none resize-none placeholder:text-slate-400"
									placeholder="Describe the purpose and format of this stage..."
									rows={3}
									defaultValue="A comprehensive multiple-choice examination focusing on core technical concepts and logical reasoning skills relevant to the club's objectives."
								></textarea>
							</div>
						</div>
						<div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
							<div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
								<span className="material-symbols-outlined text-[18px]">
									timer
								</span>
								<span>45 mins</span>
							</div>
							<div className="flex items-center gap-1 text-xs font-semibold text-slate-500 ml-4">
								<span className="material-symbols-outlined text-[18px]">
									assignment_turned_in
								</span>
								<span>Auto-graded</span>
							</div>
						</div>
					</div>

					{/* New Stage Card (Draft State) */}
					<div className="bg-white border-slate-300 rounded-xl p-6 shadow-sm border-dashed border-2 opacity-80">
						<div className="flex justify-between items-start mb-4">
							<div className="flex items-center gap-2">
								<div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">
									2
								</div>
								<span className="text-sm font-medium text-slate-500 uppercase tracking-widest italic">
									New Stage
								</span>
							</div>
						</div>
						<div className="space-y-4">
							<div>
								<label className="block text-xs font-semibold text-slate-600 mb-1 ml-1">
									Stage Name
								</label>
								<input
									className="w-full bg-white border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-lg px-4 py-2 text-base text-slate-900 transition-all outline-none placeholder:text-slate-400"
									placeholder="Stage Name (e.g. Technical Interview)"
									type="text"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 mb-1 ml-1">
									Stage Description
								</label>
								<textarea
									className="w-full bg-white border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-lg px-4 py-2 text-base text-slate-900 transition-all outline-none resize-none placeholder:text-slate-400"
									placeholder="Stage Description"
									rows={3}
								></textarea>
							</div>
						</div>
					</div>

					{/* Add Stage Button */}
					<button className="w-full py-8 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all group active:scale-[0.98]">
						<div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
							<span className="material-symbols-outlined text-[32px]">add</span>
						</div>
						<span className="text-sm font-bold">Add Another Stage</span>
						<span className="text-xs font-medium opacity-70">
							Define the next step in your workflow
						</span>
					</button>
				</div>

				{/* Sticky Bottom Navigation */}
				<div className="w-full max-w-3xl mt-12 pt-6 border-t border-slate-200 flex justify-between items-center">
					<button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors active:scale-95">
						<span className="material-symbols-outlined text-[20px]">
							arrow_back
						</span>
						Back to Step 1
					</button>
					<div className="flex items-center gap-4">
						<button className="hidden sm:block px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors active:scale-95">
							Save as Draft
						</button>
						<button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all active:scale-95 group">
							Continue to Step 3
							<span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
								arrow_forward
							</span>
						</button>
					</div>
				</div>
			</main>

			{/* Footer Area */}
			<footer className="py-4 px-6 bg-slate-100 border-t border-slate-200 mt-auto">
				<div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-1.5">
							<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
							<span>System Online</span>
						</div>
						<div className="h-3 w-px bg-slate-300 hidden sm:block"></div>
						<div className="hidden sm:flex items-center gap-1.5">
							<span className="material-symbols-outlined text-[16px]">
								cloud_done
							</span>
							<span>Changes are auto-saved to cloud</span>
						</div>
					</div>
					<div>© 2024 Inductly LMS. All rights reserved.</div>
				</div>
			</footer>
		</div>
	);
}
