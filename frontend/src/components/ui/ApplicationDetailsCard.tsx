import { useState } from "react";
import { useNavigate } from "react-router";
import { useGetApplicationDetailsQuery } from "../../features/application/applicationApi";
import dayjs from "dayjs";

const IconCheck = ({ size = 14 }: { size?: number }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
		<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
	</svg>
);

const IconClose = ({ size = 14 }: { size?: number }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
		<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
	</svg>
);

const IconCancel = ({ size = 16 }: { size?: number }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
		<path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
	</svg>
);

const IconLock = ({ size = 14 }: { size?: number }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
		<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
	</svg>
);

const IconHelp = ({ size = 18 }: { size?: number }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
		<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
	</svg>
);

const STATUS_COLORS: Record<string, string> = {
	PASSED: "bg-emerald-500",
	FAILED: "bg-red-600",
	PENDING: "bg-gray-300",
};

const STATUS_LABELS: Record<string, string> = {
	PASSED: "Passed",
	FAILED: "Failed",
	PENDING: "Pending",
};

function StageItem({
	stage,
	isLast,
}: {
	stage: {
		name: string;
		status: string;
		score: number | null;
		notes: string | null;
	};
	isLast: boolean;
}) {
	const isPassed = stage.status === "PASSED";
	const isFailed = stage.status === "FAILED";
	const isPending = stage.status === "PENDING";

	return (
		<div className={`flex gap-6 ${isPending ? "opacity-40 grayscale" : ""}`}>
			<div className="flex flex-col items-center">
				{isPassed && (
					<div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-4 ring-emerald-50 relative z-10">
						<IconCheck size={14} />
					</div>
				)}
				{isFailed && (
					<div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white ring-4 ring-red-100 relative z-10">
						<IconClose size={14} />
					</div>
				)}
				{isPending && (
					<div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 relative z-10">
						<IconLock size={14} />
					</div>
				)}
				{!isLast && (
					<div
						className={`w-0.5 flex-grow mt-0 ${
							isPassed ? "bg-emerald-500" : "bg-gray-200"
						}`}
						style={{ minHeight: "64px" }}
					/>
				)}
			</div>

			<div className={`flex-1 ${!isLast ? "pb-8" : ""}`}>
				<div className="flex justify-between items-start">
					<div>
						<h3 className="text-xl font-semibold leading-tight text-gray-900">
							{stage.name}
						</h3>
						<p
							className={`text-xs font-semibold tracking-wider mt-1 uppercase ${
								isPassed
									? "text-emerald-600"
									: isFailed
										? "text-red-600"
										: "text-gray-500"
							}`}
						>
							{STATUS_LABELS[stage.status] ?? stage.status}
						</p>
					</div>

					<div className="text-right">
						<span
							className={`text-base font-semibold ${
								isFailed
									? "text-red-600"
									: isPending
										? "text-gray-400"
										: "text-gray-900"
							}`}
						>
							{stage.score != null ? `${stage.score}/10` : "--"}
						</span>
					</div>
				</div>

				{stage.notes && (
					<div className="mt-3 p-3 bg-gray-100 rounded-lg border border-gray-200">
						<p className="text-sm text-gray-500">Feedback: {stage.notes}</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default function ApplicationDetailsCard({
	applicationId,
	clubId,
	onClose,
}: {
	applicationId: number;
	clubId?: number;
	onClose?: () => void;
}) {
	const [visible, setVisible] = useState(true);
	const navigate = useNavigate();
	const { data: raw, isLoading } = useGetApplicationDetailsQuery(applicationId);

	const handleClose = () => {
		setVisible(false);
		onClose?.();
	};

	if (!visible) return null;

	const application = raw?.data;
	const appliedDate = application?.created_at
		? dayjs(application.created_at).format("MMM D, YYYY")
		: null;

	const stages = application?.induction?.stages ?? [];
	const stageProgress = application?.stageProgress ?? [];

	const mergedStages = stages.map((stage: { id: number; name: string }) => {
		const progress = stageProgress.find(
			(p: { stage_id: number }) => p.stage_id === stage.id,
		);
		return {
			name: stage.name,
			status: progress?.status ?? "PENDING",
			score: progress?.score ?? null,
			notes: progress?.notes ?? null,
		};
	});

	const statusBadge = (() => {
		switch (application?.status) {
			case "REJECTED":
				return (
					<span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold border border-red-200 flex items-center gap-1">
						<IconCancel size={16} />
						REJECTED
					</span>
				);
			case "ACCEPTED":
				return (
					<span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold border border-emerald-200 flex items-center gap-1">
						<IconCheck size={14} />
						ACCEPTED
					</span>
				);
			case "SHORTLISTED":
				return (
					<span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold border border-indigo-200">
						SHORTLISTED
					</span>
				);
			default:
				return (
					<span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold border border-gray-200">
						PENDING
					</span>
				);
		}
	})();

	return (
		<div className="min-h-screen bg-gray-200 flex items-center justify-center p-4 overflow-hidden">
			<div
				className="w-full max-w-2xl bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden"
				style={{ animation: "fadeInScale 0.3s ease-out forwards" }}
			>
				<header className="p-6 border-b border-gray-200 flex justify-between items-start bg-white/50">
					<div className="space-y-1">
						<h1 className="text-2xl font-semibold tracking-tight text-gray-900">
							Application Status
						</h1>
						{isLoading ? (
							<p className="text-sm text-gray-500">Loading...</p>
						) : (
							appliedDate && (
								<p className="text-sm text-gray-500">
									Applied on {appliedDate}
								</p>
							)
						)}
					</div>

					<div className="flex flex-col items-end gap-2">
						{statusBadge}
						<button
							onClick={handleClose}
							className="text-gray-400 hover:text-gray-700 transition-colors"
							aria-label="Close"
						>
							<IconClose size={20} />
						</button>
					</div>
				</header>

				<main className="p-6">
					{isLoading ? (
						<div className="flex items-center justify-center py-16">
							<div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
						</div>
					) : (
						<div>
							{mergedStages.map((stage: any, idx: number) => (
								<StageItem
									key={idx}
									stage={stage}
									isLast={idx === mergedStages.length - 1}
								/>
							))}
						</div>
					)}
				</main>

				<footer className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
					<button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-2">
						<IconHelp size={18} />
						Support
					</button>

					<div className="flex gap-3">
						{clubId && (
							<button
								onClick={() =>
									navigate(`/my-clubs/${clubId}/${applicationId}/response`)
								}
								className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-all"
							>
								View Full Response
							</button>
						)}
						<button
							onClick={handleClose}
							className="px-4 py-2 bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-95 transition-all"
						>
							Close Window
						</button>
					</div>
				</footer>
			</div>

			<style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
		</div>
	);
}
