import { useState, useEffect } from "react";
import { useParams } from "react-router";
import dayjs from "dayjs";
import { useGetApplicationResponseQuery } from "../../../../features/application/applicationApi";
import Loader from "../../../../components/loaders/Loader";

// ── Inline SVG icons (replacing Material Symbols) ───────────────────────────

const MailIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<rect x="2" y="4" width="20" height="16" rx="2" />
		<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
	</svg>
);

const CodeIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polyline points="16 18 22 12 16 6" />
		<polyline points="8 6 2 12 8 18" />
	</svg>
);

const CheckIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polyline points="20 6 9 17 4 12" />
	</svg>
);

const PdfIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
		<polyline points="14 2 14 8 20 8" />
		<line x1="9" y1="15" x2="15" y2="15" />
		<line x1="9" y1="18" x2="12" y2="18" />
		<line x1="9" y1="12" x2="9.01" y2="12" />
	</svg>
);

const EyeIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
		<circle cx="12" cy="12" r="3" />
	</svg>
);

const LinkIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
		<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
	</svg>
);

const TrashIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polyline points="3 6 5 6 21 6" />
		<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
		<path d="M10 11v6M14 11v6" />
		<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
	</svg>
);

const InfoIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<circle cx="12" cy="12" r="10" />
		<line x1="12" y1="16" x2="12" y2="12" />
		<line x1="12" y1="8" x2="12.01" y2="8" />
	</svg>
);

const mapQuestions = (questions: any[]) =>
	(questions || []).map((q: any, index: number) => {
		const baseAnswer = q.answers?.[0]?.answer;

		if (q.question_type === "CHECKBOX") {
			return {
				id: index + 1,
				question: q.question_text,
				type: "checkbox",
				answer: typeof baseAnswer === "boolean" ? baseAnswer : false,
				label: q.metadata?.label || q.question_text,
			};
		}

		if (q.question_type === "FILE") {
			return {
				id: index + 1,
				question: q.question_text,
				type: "file",
				answer:
					typeof baseAnswer === "object" && baseAnswer !== null
						? baseAnswer
						: { name: baseAnswer || "Uploaded file", size: "—", updatedAt: "" },
			};
		}

		return {
			id: index + 1,
			question: q.question_text,
			type: q.question_type.toLowerCase(),
			answer: baseAnswer,
		};
	});

// ── Sub-components ───────────────────────────────────────────────────────────

function ResponseCard({ index, question, children }) {
	const [hovered, setHovered] = useState(false);
	return (
		<div
			className={`bg-white border rounded-xl p-6 shadow-sm transition-all duration-200 ${
				hovered ? "border-indigo-300 shadow-md" : "border-gray-200"
			}`}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
				{index}. {question}
			</label>
			{children}
		</div>
	);
}

function TextareaResponse({ answer }) {
	return (
		<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
			<p className="text-base text-gray-800 leading-relaxed italic">
				"{answer}"
			</p>
		</div>
	);
}

function SelectResponse({ answer }) {
	return (
		<div className="flex">
			<span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-sm font-semibold">
				<CodeIcon />
				{answer}
			</span>
		</div>
	);
}

function MultiSelectResponse({ answer }) {
	return (
		<div className="flex flex-wrap gap-2">
			{answer.map((tag) => (
				<span
					key={tag}
					className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg border border-gray-200 text-xs font-semibold tracking-wide"
				>
					{tag}
				</span>
			))}
		</div>
	);
}

function CheckboxResponse({ checked, label }) {
	return (
		<div className="flex items-center gap-3">
			<div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white flex-shrink-0">
				<CheckIcon />
			</div>
			<span className="text-base text-gray-800">{label}</span>
		</div>
	);
}

function FileResponse({ file }) {
	return (
		<div className="flex items-center justify-between p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50">
			<div className="flex items-center gap-4">
				<div className="w-12 h-12 bg-red-50 text-red-600 flex items-center justify-center rounded-lg shadow-sm">
					<PdfIcon />
				</div>
				<div>
					<p className="text-sm font-bold text-gray-900">{file.name}</p>
					<p className="text-sm text-gray-400">
						{file.size} • {file.updatedAt}
					</p>
				</div>
			</div>
			<button className="flex items-center gap-1.5 px-4 py-2 border border-indigo-600 text-indigo-600 text-sm font-semibold rounded-xl hover:bg-indigo-50 transition-all">
				<EyeIcon />
				View File
			</button>
		</div>
	);
}

function UrlResponse({ href, answer }) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noreferrer"
			className="inline-flex items-center gap-1.5 text-indigo-600 text-base font-medium hover:underline"
		>
			<LinkIcon />
			{answer}
		</a>
	);
}

function EmptyResponse() {
	return (
		<p className="text-base text-gray-400 italic opacity-60">
			No response provided
		</p>
	);
}

// ── Toast ────────────────────────────────────────────────────────────────────

function Toast({ visible }) {
	return (
		<div
			className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 ${
				visible
					? "opacity-100 translate-y-0"
					: "opacity-0 translate-y-4 pointer-events-none"
			}`}
		>
			<span className="text-indigo-300">
				<InfoIcon />
			</span>
			<span className="text-sm font-medium">
				Application marked as 'Under Review'
			</span>
		</div>
	);
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function ApplicantResponse() {
	const { clubId, applicationId } = useParams();
	const {
		data: raw,
		isLoading,
		isError,
	} = useGetApplicationResponseQuery(
		{
			applicationId: Number(applicationId),
			clubId: Number(clubId),
		},
		{ skip: !applicationId || !clubId },
	);

	const [toastVisible, setToastVisible] = useState(false);

	useEffect(() => {
		const showTimer = setTimeout(() => setToastVisible(true), 1500);
		const hideTimer = setTimeout(() => setToastVisible(false), 4500);
		return () => {
			clearTimeout(showTimer);
			clearTimeout(hideTimer);
		};
	}, []);

	const renderResponse = (response: any) => {
		if (!response.answer && response.type !== "checkbox")
			return <EmptyResponse />;

		switch (response.type) {
			case "textarea":
				return <TextareaResponse answer={response.answer} />;
			case "select":
				return <SelectResponse answer={response.answer} />;
			case "multi_select":
				return <MultiSelectResponse answer={response.answer} />;
			case "checkbox":
				return (
					<CheckboxResponse checked={response.answer} label={response.label} />
				);
			case "file":
				return <FileResponse file={response.answer} />;
			case "url":
				return <UrlResponse href={response.href} answer={response.answer} />;
			case "text":
				return (
					<p className="text-base text-gray-800">{response.answer}</p>
				);
			default:
				return <EmptyResponse />;
		}
	};

	if (isLoading) return <Loader />;
	if (isError || !raw?.data)
		return (
			<div className="min-h-screen bg-purple-50 flex items-center justify-center text-gray-500 text-lg">
				Failed to load application response.
			</div>
		);

	const data = raw.data;
	const responses = mapQuestions(data.form?.questions);

	return (
		<div
			className="bg-purple-50 text-gray-900 min-h-screen"
			style={{ fontFamily: "'Inter', sans-serif" }}
		>
			{/* ── Main content ── */}
			<main className="max-w-[950px] mx-auto px-6 py-8">
				{/* Header */}
				<header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
					<div>
						<h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-1">
							Application Details
						</h1>
						<p className="text-base text-gray-500">
							Reviewing candidate response for application #
							{data.application_id}.
						</p>
					</div>
				</header>

				{/* Applicant Info Card */}
				<section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-12">
					<div className="flex flex-col md:flex-row gap-8 items-start">
						{/* Avatar */}
						<div className="relative flex-shrink-0">
							{data.applicant_profile_picture ? (
								<img
									alt={data.applicant_name}
									src={data.applicant_profile_picture}
									className="w-24 h-24 rounded-xl object-cover"
								/>
							) : (
								<div className="w-24 h-24 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
									{data.applicant_name?.charAt(0) || "?"}
								</div>
							)}
						</div>

						{/* Details grid */}
						<div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
							{/* Name */}
							<div className="col-span-full md:col-span-2">
								<div className="flex items-center gap-2 mb-1">
									<h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
										{data.applicant_name}
									</h2>
								</div>
								<p className="text-sm text-gray-500 flex items-center gap-1.5">
									<MailIcon />
									{data.applicant_email}
								</p>
							</div>

							{/* Submitted date */}
							<div className="md:text-right flex flex-col justify-center">
								<p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
									Submitted Date
								</p>
								<p className="text-base font-semibold text-gray-900">
									{data.applied_on
										? dayjs(data.applied_on).format("MMM D, YYYY")
										: "—"}
								</p>
							</div>

							{/* Meta row */}
							<div className="border-t border-gray-200 pt-4 col-span-full grid grid-cols-2 md:grid-cols-4 gap-4">
								<div>
									<p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
										Branch
									</p>
									<p className="text-sm text-gray-800">
										{data.applicant_branch || "—"}
									</p>
								</div>
								<div>
									<p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
										Batch
									</p>
									<p className="text-sm text-gray-800">
										{data.applicant_batch || "—"}
									</p>
								</div>
								<div>
									<p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
										Github URL
									</p>
									{data.applicant_github &&
									data.applicant_github !== "Not Provided" ? (
										<a
											href={
												data.applicant_github.startsWith("http")
													? data.applicant_github
													: `https://${data.applicant_github}`
											}
											target="_blank"
											rel="noreferrer"
											className="text-indigo-600 text-sm hover:underline"
										>
											{data.applicant_github}
										</a>
									) : (
										<p className="text-sm text-gray-400">—</p>
									)}
								</div>
								<div>
									<p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
										LinkedIn URL
									</p>
									{data.applicant_linkedin &&
									data.applicant_linkedin !== "Not Provided" ? (
										<a
											href={
												data.applicant_linkedin.startsWith("http")
													? data.applicant_linkedin
													: `https://${data.applicant_linkedin}`
											}
											target="_blank"
											rel="noreferrer"
											className="text-indigo-600 text-sm hover:underline"
										>
											{data.applicant_linkedin}
										</a>
									) : (
										<p className="text-sm text-gray-400">—</p>
									)}
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Form Responses */}
				<div className="space-y-4">
					<h3 className="text-xl font-semibold text-gray-900 border-l-4 border-indigo-600 pl-4">
						Form Submissions
					</h3>

					{responses.length > 0 ? (
						responses.map((response: any) => (
							<ResponseCard
								key={response.id}
								index={response.id}
								question={response.question}
							>
								{renderResponse(response)}
							</ResponseCard>
						))
					) : (
						<p className="text-gray-400 text-sm italic">
							No form responses submitted.
						</p>
					)}
				</div>

				{/* Footer action bar */}
				<div className="mt-16 pt-12 border-t border-gray-200 flex items-center justify-between">
					<button className="flex items-center gap-1.5 text-gray-400 text-sm font-semibold hover:text-red-500 transition-colors">
						<TrashIcon />
						Reject Application
					</button>
					<div className="flex gap-4">
						<button className="px-8 py-2.5 bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-indigo-200 hover:shadow-xl transition-all active:scale-95">
							Shortlist for Induction
						</button>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="mt-16 py-12 bg-gray-100 border-t border-gray-200">
				<div className="max-w-[950px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
					<div className="flex items-center gap-2">
						<span className="text-xl font-bold text-indigo-600">InductPro</span>
						<span className="text-gray-400 text-sm border-l border-gray-300 pl-2">
							Academic Excellence System
						</span>
					</div>
					<div className="flex gap-8 text-gray-400 text-xs font-semibold uppercase tracking-wide">
						<a href="#" className="hover:text-indigo-600 transition-colors">
							Documentation
						</a>
						<a href="#" className="hover:text-indigo-600 transition-colors">
							Support
						</a>
						<a href="#" className="hover:text-indigo-600 transition-colors">
							Legal
						</a>
					</div>
					<p className="text-gray-400 text-sm">
						© 2024 InductPro. All rights reserved.
					</p>
				</div>
			</footer>

			{/* Toast */}
			<Toast visible={toastVisible} />
		</div>
	);
}
