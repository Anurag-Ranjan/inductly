import type { QuestionType } from "../types/forms.types";
import type { QuestionOption } from "../types/forms.types";

export default function QuestionMetadataFields({
	question_type,
	metadata,
	onChange,
	onBlur,
}: {
	question_type: QuestionType;
	metadata: Record<string, any> | null;
	onChange: (meta: Record<string, any> | null) => void;
	onBlur?: () => void;
}) {
	const m = metadata ?? {};

	const set = (key: string, value: any) => {
		const next = { ...m, [key]: value };
		onChange(Object.keys(next).length === 0 ? null : next);
	};

	switch (question_type) {
		case "TEXT":
		case "TEXTAREA":
			return (
				<div className="grid grid-cols-3 gap-4">
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
							Min Length
						</label>
						<input
							type="number"
							min={0}
							placeholder="0"
							value={(m as any).minLength ?? ""}
							onChange={(e) =>
								set(
									"minLength",
									e.target.value ? Number(e.target.value) : undefined,
								)
							}
							onBlur={onBlur}
							className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
							Max Length
						</label>
						<input
							type="number"
							min={0}
							placeholder="—"
							value={(m as any).maxLength ?? ""}
							onChange={(e) =>
								set(
									"maxLength",
									e.target.value ? Number(e.target.value) : undefined,
								)
							}
							onBlur={onBlur}
							className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
							Placeholder
						</label>
						<input
							type="text"
							placeholder="e.g. Your answer…"
							value={(m as any).placeholder ?? ""}
							onChange={(e) => set("placeholder", e.target.value || undefined)}
							onBlur={onBlur}
							className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
						/>
					</div>
				</div>
			);

		case "SELECT":
		case "MULTI_SELECT":
			return (
				<div className="space-y-3">
					<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
						Options
					</label>
					{((m as any).options as QuestionOption[] | undefined)?.map(
						(opt, idx) => (
							<div key={idx} className="flex items-center gap-3">
								<span className="text-xs font-semibold text-slate-400 w-5">
									{idx + 1}.
								</span>
								<input
									type="text"
									placeholder="Label"
									value={opt.label}
									onChange={(e) => {
										const next = [...((m as any).options ?? [])];
										next[idx] = { ...next[idx], label: e.target.value };
										set("options", next);
									}}
									onBlur={onBlur}
									className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
								/>
								<input
									type="text"
									placeholder="Value"
									value={opt.value}
									onChange={(e) => {
										const next = [...((m as any).options ?? [])];
										next[idx] = { ...next[idx], value: e.target.value };
										set("options", next);
									}}
									onBlur={onBlur}
									className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
								/>
								<button
									type="button"
									onClick={() => {
										const next = ((m as any).options ?? []).filter(
											(_: any, i: number) => i !== idx,
										);
										set("options", next.length ? next : undefined);
									}}
									onBlur={onBlur}
									className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
								>
									<span className="material-symbols-outlined text-[18px]">
										close
									</span>
								</button>
							</div>
						),
					)}
					<button
						type="button"
						onClick={() => {
							const next = [
								...((m as any).options ?? []),
								{ label: "", value: "" },
							];
							set("options", next);
						}}
						onBlur={onBlur}
						className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
					>
						<span className="material-symbols-outlined text-[18px]">add</span>
						Add Option
					</button>
				</div>
			);

		case "CHECKBOX":
			return (
				<div className="flex flex-col gap-1.5 max-w-xs">
					<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
						Label
					</label>
					<input
						type="text"
						placeholder="e.g. I agree to the terms"
						value={(m as any).label ?? ""}
						onChange={(e) => set("label", e.target.value || undefined)}
						onBlur={onBlur}
						className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
					/>
				</div>
			);

		case "FILE":
			return (
				<div className="grid grid-cols-2 gap-4">
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
							Max Size (MB)
						</label>
						<input
							type="number"
							min={0}
							step={0.5}
							placeholder="10"
							value={(m as any).maxSizeMB ?? ""}
							onChange={(e) =>
								set(
									"maxSizeMB",
									e.target.value ? Number(e.target.value) : undefined,
								)
							}
							onBlur={onBlur}
							className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
							Allowed Types
						</label>
						<input
							type="text"
							placeholder="pdf, doc, png"
							value={((m as any).allowedTypes ?? []).join(", ")}
							onChange={(e) => {
								const types = e.target.value
									.split(",")
									.map((s) => s.trim())
									.filter(Boolean);
								set("allowedTypes", types.length ? types : undefined);
							}}
							onBlur={onBlur}
							className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
						/>
					</div>
				</div>
			);
	}
}
