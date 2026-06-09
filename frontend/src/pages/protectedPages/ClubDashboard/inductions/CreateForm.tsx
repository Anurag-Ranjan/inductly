import React, { useEffect, useState } from "react";

export default function CreateForm() {
	const [progress, setProgress] = useState(0);

	// Trigger the progress bar animation on mount
	useEffect(() => {
		const timer = setTimeout(() => {
			setProgress(75);
		}, 100);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="min-h-screen flex flex-col items-center py-12 px-4 md:px-6 bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
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

			{/* Main Container */}
			<main className="w-full max-w-[800px]">
				{/* Progress Stepper */}
				<div className="mb-8 px-2">
					<div className="flex justify-between items-center mb-2">
						<span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">
							Step 3 of 4
						</span>
						<span className="text-xs font-semibold text-slate-500">
							75% Complete
						</span>
					</div>
					<div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
						<div
							className="h-full bg-indigo-600 rounded-full transition-all duration-700 ease-out"
							style={{ width: `${progress}%` }}
						></div>
					</div>
				</div>

				{/* Form Builder Card */}
				<div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 md:p-8 space-y-8">
					{/* Header Section */}
					<section className="space-y-6">
						<div>
							<h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
								Build Your Induction Form
							</h2>
							<p className="text-base text-slate-600">
								Define the fields and requirements for new member registration.
							</p>
						</div>

						<div className="grid grid-cols-1 gap-6">
							<div className="flex flex-col gap-2 group">
								<label className="text-sm font-medium text-slate-900 group-focus-within:text-indigo-600 transition-colors">
									Form Title
								</label>
								<input
									className="w-full p-4 border border-slate-300 rounded-lg text-base text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-shadow"
									placeholder="e.g., Chess Club Annual Membership"
									type="text"
								/>
							</div>
							<div className="flex flex-col gap-2 group">
								<label className="text-sm font-medium text-slate-900 group-focus-within:text-indigo-600 transition-colors">
									Form Description
								</label>
								<textarea
									className="w-full p-4 border border-slate-300 rounded-lg text-base text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-shadow resize-none"
									placeholder="Provide instructions for applicants..."
									rows="3"
								></textarea>
							</div>
						</div>
					</section>

					{/* Questions Area */}
					<section className="space-y-6">
						<div className="flex justify-between items-center">
							<h3 className="text-xl font-semibold text-slate-900">
								Questions
							</h3>
							<span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
								1 Question Added
							</span>
						</div>

						{/* Card-within-card: Sample Question */}
						<div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative overflow-hidden group">
							{/* Grab Handle (Visual) */}
							<div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity"></div>

							<div className="flex flex-col gap-6">
								<div className="flex justify-between items-start">
									<div className="flex items-center gap-2">
										<span className="material-symbols-outlined text-slate-400 text-[20px] cursor-grab">
											drag_indicator
										</span>
										<span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
											Question 1
										</span>
									</div>
									<button className="text-red-600 hover:bg-red-100/50 p-1 rounded-lg transition-colors">
										<span className="material-symbols-outlined text-[20px]">
											delete
										</span>
									</button>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="flex flex-col gap-2 md:col-span-2 group/input">
										<label className="text-sm font-medium text-slate-900 group-focus-within/input:text-indigo-600 transition-colors">
											Question Text
										</label>
										<input
											className="w-full p-3 border border-slate-300 rounded-lg text-base text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-shadow"
											type="text"
											defaultValue="What is your primary reason for joining Inductly?"
										/>
									</div>

									<div className="flex flex-col gap-2 group/input">
										<label className="text-sm font-medium text-slate-900 group-focus-within/input:text-indigo-600 transition-colors">
											Question Type
										</label>
										<div className="relative">
											<select className="w-full p-3 border border-slate-300 rounded-lg text-base text-slate-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-shadow cursor-pointer">
												<option>Short Answer</option>
												<option defaultValue>Paragraph</option>
												<option>Multiple Choice</option>
												<option>File Upload</option>
												<option>Date Picker</option>
											</select>
											<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
												expand_more
											</span>
										</div>
									</div>

									<div className="flex flex-col gap-2">
										<label className="text-sm font-medium text-slate-900">
											Metadata/Requirements
										</label>
										<div className="flex items-center gap-4 h-full px-1">
											<label className="flex items-center gap-2 cursor-pointer group/check">
												<input
													defaultChecked
													className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
													type="checkbox"
												/>
												<span className="text-sm text-slate-600 group-hover/check:text-slate-900 transition-colors">
													Required
												</span>
											</label>
											<label className="flex items-center gap-2 cursor-pointer group/check">
												<input
													className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
													type="checkbox"
												/>
												<span className="text-sm text-slate-600 group-hover/check:text-slate-900 transition-colors">
													Internal Only
												</span>
											</label>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Add Question Button */}
						<button className="w-full py-6 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 text-indigo-600 text-sm font-semibold hover:bg-slate-50 hover:border-indigo-600 transition-all group active:scale-[0.98]">
							<span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">
								add_circle
							</span>
							Add Question
						</button>
					</section>

					{/* Action Footer */}
					<footer className="pt-6 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-100">
						<button className="order-2 md:order-1 flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium px-4 py-2 rounded-lg transition-colors active:scale-95">
							<span className="material-symbols-outlined text-[20px]">
								arrow_back
							</span>
							Back to Step 2
						</button>
						<div className="order-1 md:order-2 flex items-center gap-4 w-full md:w-auto">
							<button className="flex-1 md:flex-none px-6 py-2.5 text-slate-700 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors active:scale-95">
								Save as Draft
							</button>
							<button className="flex-1 md:flex-none bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:opacity-95 transition-all active:scale-95">
								Continue to Step 4
								<span className="material-symbols-outlined text-[20px]">
									arrow_forward
								</span>
							</button>
						</div>
					</footer>
				</div>

				{/* Design Detail: Subtle Tip */}
				<div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
					<span className="material-symbols-outlined text-[16px]">info</span>
					<p className="text-[12px] font-semibold uppercase tracking-wider">
						Changes are auto-saved to cloud
					</p>
				</div>
			</main>
		</div>
	);
}
