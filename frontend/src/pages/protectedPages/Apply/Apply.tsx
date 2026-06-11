import { Navigate, useParams } from "react-router";
import { useGetFormForApplicantQuery } from "../../../features/response/responseApi";
import Loader from "../../../components/loaders/Loader";

export default function Apply() {
	const { formId, clubId, inductionId } = useParams();

	if (!formId || !clubId || !inductionId || formId === "null") {
		return <Navigate to="/open-inductions" replace />;
	}

	const { data: formData, isLoading } = useGetFormForApplicantQuery({
		clubId: Number(clubId),
		formId: Number(formId),
		inductionId: Number(inductionId),
	});

	if (isLoading) return <Loader />;

	return (
		<div className="bg-[#fcf8ff] text-[#1b1b24] antialiased min-h-screen pb-32 font-['Inter',sans-serif] relative z-0">
			{/* NOTE: Ensure these links are in your public/index.html <head> for the fonts and icons to work:
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      */}
			<style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          vertical-align: middle;
        }
      `}</style>

			{/* Background Decoration */}
			<div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-40">
				<div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#4f46e5] blur-[120px] opacity-20"></div>
				<div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-[#712ae2] blur-[100px] opacity-10"></div>
			</div>

			{/* Main Content Container */}
			<main className="max-w-[720px] mx-auto px-4 md:px-0 py-8 space-y-8">
				{/* Header Card */}
				<header className="bg-white border border-[#c7c4d8] rounded-[16px] overflow-hidden shadow-md">
					<div className="h-2 bg-gradient-to-br from-[#4f46e5] to-[#712ae2]"></div>
					<div className="p-6 md:p-8">
						<div className="flex items-center gap-4 mb-6">
							<div className="w-16 h-16 rounded-xl bg-[#f0ecf9] flex items-center justify-center overflow-hidden border border-[#c7c4d8] flex-shrink-0">
								<img
									alt="Global Tech Club Logo"
									className="w-full h-full object-cover"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDRPBkuV2kYYtdA3I40ZAQwhuHL_j2WJK0jr_Oy9HunlrKnHAkNqESXbwdnMPhkMmQLA4IWkF0e0KnrzukGrSWI2X6CYRa_4A5Slfl2fH-cjW--bWxtQn_v1-CL3bBrTfvn95ELBSMt0W6RcUOtkEphP_LdW_N3CPAcc66DHLTKxPuYiuc26vBJFZTT3qMh256ooVFrkktIukKdTsDv7_kST1HbPE12KQr3S_knMZDgQ7F72zDotkFZKMhyWlbsfP76eIYzCJyQQz2"
								/>
							</div>
							<div>
								<h2 className="text-2xl font-semibold text-[#1b1b24]">
									Global Tech Club
								</h2>
								<span className="text-xs font-semibold text-[#777587] uppercase tracking-wider block mt-1">
									Application Form
								</span>
							</div>
						</div>

						<h1 className="text-[28px] md:text-[32px] font-bold leading-tight text-[#1b1b24] mb-4">
							2024 Core Committee Application
						</h1>
						<p className="text-base text-[#464555] leading-relaxed mb-6">
							Please fill out this form to apply for the core committee
							positions. Ensure all required fields are completed before
							submission.
						</p>

						<div className="pt-4 border-t border-[#c7c4d8]">
							<p className="text-[#ba1a1a] font-medium text-sm">
								* Indicates required question
							</p>
						</div>
					</div>
				</header>

				{/* Question 1: TEXT */}
				<section className="bg-white border border-[#c7c4d8] rounded-[16px] p-6 shadow-md">
					<label className="block mb-4">
						<span className="text-base font-semibold text-[#1b1b24]">
							Full Name <span className="text-[#ba1a1a]">*</span>
						</span>
					</label>
					<div className="relative group">
						<input
							className="w-full px-4 py-3 rounded-lg border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none transition-all placeholder:text-[#777587]/60 bg-[#f5f2ff] text-base"
							placeholder="Enter your answer"
							type="text"
						/>
						<div className="mt-2 flex justify-between">
							<span className="text-[11px] font-medium text-[#777587] uppercase tracking-tight">
								Minimum 10 characters • Maximum 100 characters
							</span>
						</div>
					</div>
				</section>

				{/* Question 2: TEXTAREA (With Error State) */}
				<section className="bg-white border-2 border-[#ba1a1a] rounded-[16px] p-6 shadow-md">
					<label className="block mb-4">
						<span className="text-base font-semibold text-[#1b1b24]">
							Why do you want to join the club?{" "}
							<span className="text-[#ba1a1a]">*</span>
						</span>
					</label>
					<div className="relative">
						<textarea
							className="w-full px-4 py-3 rounded-lg border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none transition-all placeholder:text-[#777587]/60 bg-[#f5f2ff] resize-none text-base"
							placeholder="Describe your experience..."
							rows={4}
						></textarea>
						<div className="mt-2 flex justify-between items-center">
							<div className="flex items-center gap-1 text-[#ba1a1a]">
								<span className="material-symbols-outlined text-[18px]">
									error
								</span>
								<span className="text-sm font-medium">
									This field is required.
								</span>
							</div>
							<span className="text-xs font-semibold text-[#777587]">
								0 / 500
							</span>
						</div>
					</div>
				</section>

				{/* Question 3: SELECT (Radios) */}
				<section className="bg-white border border-[#c7c4d8] rounded-[16px] p-6 shadow-md">
					<label className="block mb-4">
						<span className="text-base font-semibold text-[#1b1b24]">
							Choose your branch
						</span>
					</label>
					<div className="space-y-3">
						<label className="flex items-center gap-3 p-4 rounded-lg bg-[#f5f2ff] border border-[#3525cd]/20 cursor-pointer transition-all">
							<input
								type="radio"
								name="branch"
								value="CS"
								className="w-5 h-5 text-[#3525cd] focus:ring-[#3525cd] border-[#c7c4d8] cursor-pointer"
								defaultChecked
							/>
							<span className="text-base font-medium text-[#1b1b24]">
								Computer Science
							</span>
						</label>
						<label className="flex items-center gap-3 p-4 rounded-lg bg-white border border-transparent hover:bg-gray-50 cursor-pointer transition-all">
							<input
								type="radio"
								name="branch"
								value="Electronics"
								className="w-5 h-5 text-[#3525cd] focus:ring-[#3525cd] border-[#c7c4d8] cursor-pointer"
							/>
							<span className="text-base text-[#1b1b24]">Electronics</span>
						</label>
						<label className="flex items-center gap-3 p-4 rounded-lg bg-white border border-transparent hover:bg-gray-50 cursor-pointer transition-all">
							<input
								type="radio"
								name="branch"
								value="Mechanical"
								className="w-5 h-5 text-[#3525cd] focus:ring-[#3525cd] border-[#c7c4d8] cursor-pointer"
							/>
							<span className="text-base text-[#1b1b24]">Mechanical</span>
						</label>
						<label className="flex items-center gap-3 p-4 rounded-lg bg-white border border-transparent hover:bg-gray-50 cursor-pointer transition-all">
							<input
								type="radio"
								name="branch"
								value="Civil"
								className="w-5 h-5 text-[#3525cd] focus:ring-[#3525cd] border-[#c7c4d8] cursor-pointer"
							/>
							<span className="text-base text-[#1b1b24]">Civil</span>
						</label>
					</div>
				</section>

				{/* Question 4: MULTI_SELECT (Checkboxes) */}
				<section className="bg-white border border-[#c7c4d8] rounded-[16px] p-6 shadow-md">
					<label className="block mb-4">
						<span className="text-base font-semibold text-[#1b1b24]">
							Programming Languages
						</span>
					</label>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<label className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer group transition-colors">
							<input
								type="checkbox"
								className="w-5 h-5 rounded border-[#c7c4d8] text-[#3525cd] focus:ring-[#3525cd] cursor-pointer"
							/>
							<span className="text-base text-[#1b1b24] group-hover:text-[#3525cd] transition-colors">
								C++
							</span>
						</label>
						<label className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer group transition-colors">
							<input
								type="checkbox"
								className="w-5 h-5 rounded border-[#c7c4d8] text-[#3525cd] focus:ring-[#3525cd] cursor-pointer"
								defaultChecked
							/>
							<span className="text-base text-[#1b1b24] group-hover:text-[#3525cd] transition-colors">
								Java
							</span>
						</label>
						<label className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer group transition-colors">
							<input
								type="checkbox"
								className="w-5 h-5 rounded border-[#c7c4d8] text-[#3525cd] focus:ring-[#3525cd] cursor-pointer"
							/>
							<span className="text-base text-[#1b1b24] group-hover:text-[#3525cd] transition-colors">
								Python
							</span>
						</label>
						<label className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer group transition-colors">
							<input
								type="checkbox"
								className="w-5 h-5 rounded border-[#c7c4d8] text-[#3525cd] focus:ring-[#3525cd] cursor-pointer"
							/>
							<span className="text-base text-[#1b1b24] group-hover:text-[#3525cd] transition-colors">
								JavaScript
							</span>
						</label>
						<label className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer group transition-colors">
							<input
								type="checkbox"
								className="w-5 h-5 rounded border-[#c7c4d8] text-[#3525cd] focus:ring-[#3525cd] cursor-pointer"
							/>
							<span className="text-base text-[#1b1b24] group-hover:text-[#3525cd] transition-colors">
								Rust
							</span>
						</label>
					</div>
				</section>

				{/* Question 5: SINGLE CHECKBOX */}
				<section className="bg-white border border-[#c7c4d8] rounded-[16px] p-6 shadow-md">
					<label className="flex items-start gap-3 cursor-pointer group">
						<div className="mt-[2px]">
							<input
								className="w-5 h-5 rounded border-[#c7c4d8] text-[#3525cd] focus:ring-[#3525cd] cursor-pointer"
								type="checkbox"
							/>
						</div>
						<span className="text-base text-[#1b1b24] group-hover:text-[#3525cd] transition-colors leading-tight">
							I agree to the club's code of conduct{" "}
							<span className="text-[#ba1a1a]">*</span>
						</span>
					</label>
				</section>

				{/* Question 6: FILE (With Validation Error) */}
				<section className="bg-white border border-[#c7c4d8] rounded-[16px] p-6 shadow-md">
					<label className="block mb-4">
						<span className="text-base font-semibold text-[#1b1b24]">
							Upload your Resume <span className="text-[#ba1a1a]">*</span>
						</span>
					</label>

					{/* Drag and Drop Area */}
					<div className="border-2 border-dashed border-[#c7c4d8] rounded-xl p-8 bg-[#f5f2ff] flex flex-col items-center justify-center hover:bg-[#e4e1ee] hover:border-[#3525cd] transition-all group cursor-pointer">
						<span className="material-symbols-outlined text-[48px] text-[#777587] group-hover:text-[#3525cd] mb-3 transition-colors">
							cloud_upload
						</span>
						<p className="text-base font-medium text-[#1b1b24] mb-1">
							Drop files here or click to upload
						</p>
						<p className="text-xs text-[#777587]">
							Maximum size: 10 MB. Allowed types: PDF, DOCX, PNG
						</p>
					</div>

					{/* File Preview List */}
					<div className="mt-6 space-y-3">
						<div className="flex items-center justify-between p-3 border border-[#c7c4d8] rounded-lg bg-white group">
							<div className="flex items-center gap-3 overflow-hidden">
								<div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
									<span className="material-symbols-outlined">description</span>
								</div>
								<div className="overflow-hidden">
									<p className="text-sm font-semibold text-[#1b1b24] truncate">
										Resume_Alex_Miller.pdf
									</p>
									<p className="text-[12px] text-[#777587]">2.4 MB</p>
								</div>
							</div>
							<button className="p-1.5 rounded-full hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-colors text-[#777587] flex-shrink-0">
								<span className="material-symbols-outlined text-[20px]">
									close
								</span>
							</button>
						</div>

						{/* Error Message */}
						<div className="flex items-center gap-1 text-[#ba1a1a] px-1 mt-2">
							<span className="material-symbols-outlined text-[18px]">
								warning
							</span>
							<span className="text-sm font-medium">
								Maximum upload size exceeded.
							</span>
						</div>
					</div>
				</section>
			</main>

			{/* Footer Actions (Fixed Bottom Bar) */}
			<footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#c7c4d8] z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
				<div className="max-w-[720px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between py-4 gap-4">
					<div className="flex items-center gap-2 text-[#777587] order-2 md:order-1">
						<span
							className="material-symbols-outlined text-[20px] text-emerald-500 animate-pulse"
							style={{ fontVariationSettings: "'FILL' 1" }}
						>
							check_circle
						</span>
						<span className="text-sm">Draft saved automatically</span>
					</div>

					<div className="flex items-center w-full md:w-auto order-1 md:order-2 gap-4">
						<button className="flex-1 md:flex-none px-6 py-3 rounded-lg border border-[#777587] text-[#1b1b24] font-semibold text-base hover:bg-[#f5f2ff] active:scale-[0.98] transition-all">
							Save as Draft
						</button>
						<button className="flex-1 md:flex-none px-6 py-3 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#712ae2] text-white font-semibold text-base shadow-lg shadow-[#3525cd]/20 hover:shadow-[#3525cd]/30 active:scale-[0.98] transition-all">
							Submit Application
						</button>
					</div>
				</div>
			</footer>
		</div>
	);
}
