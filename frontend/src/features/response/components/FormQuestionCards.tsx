import { useState, useRef } from "react";
import type { QuestionOption } from "../../forms/types/forms.types";

interface FormQuestionCardsProps {
	question: {
		id: number;
		question_text: string;
		question_type: string;
		is_required: boolean;
		order_index: number;
		metadata: Record<string, any> | null;
	};
	value?: string;
	onAnswer?: (questionId: number, answer: string) => void;
	onFileUpload?: (
		questionId: number,
		file: File,
		allowedTypes: string[],
		maxSizeMB: number,
	) => Promise<string | null>;
}

const requiredMarker = <span className="text-[#ba1a1a]">*</span>;

function TextQuestion({ question, value, onAnswer }: FormQuestionCardsProps) {
	const meta = question.metadata || {};
	return (
		<section className="bg-white border border-[#c7c4d8] rounded-[16px] p-6 shadow-md">
			<label className="block mb-4">
				<span className="text-base font-semibold text-[#1b1b24]">
					{question.question_text}{" "}
					{question.is_required && requiredMarker}
				</span>
			</label>
			<div className="relative group">
				<input
					className="w-full px-4 py-3 rounded-lg border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none transition-all placeholder:text-[#777587]/60 bg-[#f5f2ff] text-base"
					placeholder={meta.placeholder || "Enter your answer"}
					type="text"
					value={value || ""}
					onChange={(e) => onAnswer?.(question.id, e.target.value)}
				/>
				{(meta.minLength || meta.maxLength) && (
					<div className="mt-2 flex justify-between">
						<span className="text-[11px] font-medium text-[#777587] uppercase tracking-tight">
							{meta.minLength && `Minimum ${meta.minLength} characters`}
							{meta.minLength && meta.maxLength && " • "}
							{meta.maxLength && `Maximum ${meta.maxLength} characters`}
						</span>
					</div>
				)}
			</div>
		</section>
	);
}

function TextareaQuestion({ question, value, onAnswer }: FormQuestionCardsProps) {
	const meta = question.metadata || {};
	return (
		<section className="bg-white border border-[#c7c4d8] rounded-[16px] p-6 shadow-md">
			<label className="block mb-4">
				<span className="text-base font-semibold text-[#1b1b24]">
					{question.question_text}{" "}
					{question.is_required && requiredMarker}
				</span>
			</label>
			<div className="relative">
				<textarea
					className="w-full px-4 py-3 rounded-lg border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none transition-all placeholder:text-[#777587]/60 bg-[#f5f2ff] resize-none text-base"
					placeholder={meta.placeholder || "Enter your answer"}
					rows={4}
					value={value || ""}
					onChange={(e) => onAnswer?.(question.id, e.target.value)}
				></textarea>
				{meta.maxLength && (
					<div className="mt-2 flex justify-end">
						<span className="text-xs font-semibold text-[#777587]">
							{(value || "").length} / {meta.maxLength}
						</span>
					</div>
				)}
			</div>
		</section>
	);
}

function SelectQuestion({ question, value, onAnswer }: FormQuestionCardsProps) {
	const meta = question.metadata || {};
	const options: QuestionOption[] = meta.options || [];
	const name = `q_${question.id}`;

	return (
		<section className="bg-white border border-[#c7c4d8] rounded-[16px] p-6 shadow-md">
			<label className="block mb-4">
				<span className="text-base font-semibold text-[#1b1b24]">
					{question.question_text}{" "}
					{question.is_required && requiredMarker}
				</span>
			</label>
			<div className="space-y-3">
				{options.map((opt, idx) => (
					<label
						key={idx}
						className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
							value === opt.value
								? "bg-[#f5f2ff] border border-[#3525cd]/20"
								: "bg-white border border-transparent hover:bg-gray-50"
						}`}
					>
						<input
							type="radio"
							name={name}
							value={opt.value}
							checked={value === opt.value}
							onChange={(e) => onAnswer?.(question.id, e.target.value)}
							className="w-5 h-5 text-[#3525cd] focus:ring-[#3525cd] border-[#c7c4d8] cursor-pointer"
						/>
						<span className="text-base text-[#1b1b24]">{opt.label}</span>
					</label>
				))}
			</div>
		</section>
	);
}

function MultiSelectQuestion({ question, value, onAnswer }: FormQuestionCardsProps) {
	const meta = question.metadata || {};
	const options: QuestionOption[] = meta.options || [];
	const selected: string[] = value ? value.split(",").filter(Boolean) : [];

	const toggleOption = (optValue: string) => {
		const next = selected.includes(optValue)
			? selected.filter((v) => v !== optValue)
			: [...selected, optValue];
		onAnswer?.(question.id, next.join(","));
	};

	return (
		<section className="bg-white border border-[#c7c4d8] rounded-[16px] p-6 shadow-md">
			<label className="block mb-4">
				<span className="text-base font-semibold text-[#1b1b24]">
					{question.question_text}{" "}
					{question.is_required && requiredMarker}
				</span>
			</label>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{options.map((opt, idx) => (
					<label
						key={idx}
						className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer group transition-colors"
					>
						<input
							type="checkbox"
							className="w-5 h-5 rounded border-[#c7c4d8] text-[#3525cd] focus:ring-[#3525cd] cursor-pointer"
							checked={selected.includes(opt.value)}
							onChange={() => toggleOption(opt.value)}
						/>
						<span className="text-base text-[#1b1b24] group-hover:text-[#3525cd] transition-colors">
							{opt.label}
						</span>
					</label>
				))}
			</div>
		</section>
	);
}

function CheckboxQuestion({ question, value, onAnswer }: FormQuestionCardsProps) {
	const meta = question.metadata || {};
	const checked = value === "true";

	return (
		<section className="bg-white border border-[#c7c4d8] rounded-[16px] p-6 shadow-md">
			<label className="flex items-start gap-3 cursor-pointer group">
				<div className="mt-[2px]">
					<input
						className="w-5 h-5 rounded border-[#c7c4d8] text-[#3525cd] focus:ring-[#3525cd] cursor-pointer"
						type="checkbox"
						checked={checked}
						onChange={(e) =>
							onAnswer?.(question.id, e.target.checked ? "true" : "false")
						}
					/>
				</div>
				<span className="text-base text-[#1b1b24] group-hover:text-[#3525cd] transition-colors leading-tight">
					{meta.label || question.question_text}{" "}
					{question.is_required && requiredMarker}
				</span>
			</label>
		</section>
	);
}

function FileQuestion({
	question,
	value,
	onAnswer,
	onFileUpload,
}: FormQuestionCardsProps) {
	const meta = question.metadata || {};
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [fileName, setFileName] = useState<string | null>(null);
	const [uploadError, setUploadError] = useState<string | null>(null);

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !onFileUpload) return;

		setUploadError(null);
		setUploading(true);

		const allowedTypes: string[] = meta.allowedTypes || [];
		const maxSizeMB: number = meta.maxSizeMB || 10;

		const url = await onFileUpload(question.id, file, allowedTypes, maxSizeMB);

		setUploading(false);

		if (url) {
			setFileName(file.name);
			onAnswer?.(question.id, url);
		} else {
			setUploadError("Upload failed. Please try again.");
		}

		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleRemove = () => {
		setFileName(null);
		onAnswer?.(question.id, "");
	};

	if (value && fileName) {
		return (
			<section className="bg-white border border-[#c7c4d8] rounded-[16px] p-6 shadow-md">
				<label className="block mb-4">
					<span className="text-base font-semibold text-[#1b1b24]">
						{question.question_text}{" "}
						{question.is_required && requiredMarker}
					</span>
				</label>
				<div className="flex items-center justify-between p-4 border border-[#c7c4d8] rounded-lg bg-white">
					<div className="flex items-center gap-3 overflow-hidden">
						<div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
							<span className="material-symbols-outlined">description</span>
						</div>
						<div className="overflow-hidden">
							<p className="text-sm font-semibold text-[#1b1b24] truncate">
								{fileName}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<label className="p-1.5 rounded-full hover:bg-[#f0ecf9] cursor-pointer transition-colors text-[#3525cd] flex-shrink-0">
							<span className="material-symbols-outlined text-[20px]">
								refresh
							</span>
							<input
								ref={fileInputRef}
								type="file"
								className="hidden"
								onChange={handleFileSelect}
							/>
						</label>
						<button
							onClick={handleRemove}
							className="p-1.5 rounded-full hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-colors text-[#777587] flex-shrink-0"
						>
							<span className="material-symbols-outlined text-[20px]">
								close
							</span>
						</button>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="bg-white border border-[#c7c4d8] rounded-[16px] p-6 shadow-md">
			<label className="block mb-4">
				<span className="text-base font-semibold text-[#1b1b24]">
					{question.question_text}{" "}
					{question.is_required && requiredMarker}
				</span>
			</label>
			<input
				ref={fileInputRef}
				type="file"
				className="hidden"
				onChange={handleFileSelect}
			/>
			<div
				onClick={() => fileInputRef.current?.click()}
				className="border-2 border-dashed border-[#c7c4d8] rounded-xl p-8 bg-[#f5f2ff] flex flex-col items-center justify-center hover:bg-[#e4e1ee] hover:border-[#3525cd] transition-all group cursor-pointer"
			>
				{uploading ? (
					<>
						<span className="material-symbols-outlined text-[48px] text-[#3525cd] mb-3 animate-spin">
							progress_activity
						</span>
						<p className="text-base font-medium text-[#1b1b24] mb-1">
							Uploading...
						</p>
					</>
				) : (
					<>
						<span className="material-symbols-outlined text-[48px] text-[#777587] group-hover:text-[#3525cd] mb-3 transition-colors">
							cloud_upload
						</span>
						<p className="text-base font-medium text-[#1b1b24] mb-1">
							Drop files here or click to upload
						</p>
					</>
				)}
				{(meta.maxSizeMB || meta.allowedTypes) && (
					<p className="text-xs text-[#777587]">
						{meta.maxSizeMB && `Maximum size: ${meta.maxSizeMB} MB`}
						{meta.maxSizeMB && meta.allowedTypes?.length && ". "}
						{meta.allowedTypes?.length &&
							`Allowed types: ${meta.allowedTypes.join(", ").toUpperCase()}`}
					</p>
				)}
			</div>
			{uploadError && (
				<div className="flex items-center gap-1 text-[#ba1a1a] mt-3 px-1">
					<span className="material-symbols-outlined text-[18px]">
						warning
					</span>
					<span className="text-sm font-medium">{uploadError}</span>
				</div>
			)}
		</section>
	);
}

const questionRenderers: Record<
	string,
	(props: FormQuestionCardsProps) => JSX.Element
> = {
	TEXT: TextQuestion,
	TEXTAREA: TextareaQuestion,
	SELECT: SelectQuestion,
	MULTI_SELECT: MultiSelectQuestion,
	CHECKBOX: CheckboxQuestion,
	FILE: FileQuestion,
};

export default function FormQuestionCards(props: FormQuestionCardsProps) {
	const Renderer = questionRenderers[props.question.question_type];
	if (!Renderer) return null;
	return <Renderer {...props} />;
}
