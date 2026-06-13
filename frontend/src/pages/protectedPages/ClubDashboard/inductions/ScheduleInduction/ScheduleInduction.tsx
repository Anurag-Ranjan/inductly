import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
	useGetIsInductionPublishedQuery,
	usePublishInductionMutation,
} from "../../../../../features/induction/inductionApi";
import Loader from "../../../../../components/loaders/Loader";
import ControlledCalendar from "./ControlledCalendar";

export default function ScheduleInduction() {
	const { clubId, inductionId } = useParams();
	const navigate = useNavigate();
	const { data: publishedData, isLoading: isCheckingPublished } =
		useGetIsInductionPublishedQuery({
			clubId: Number(clubId),
			inductionId: Number(inductionId),
		});

	const [startDate, setStartDate] = useState(dayjs());
	const [endDate, setEndDate] = useState(dayjs().add(7, "day"));

	const [publishInduction, { isLoading: isPublishing }] =
		usePublishInductionMutation();

	useEffect(() => {
		if (!isCheckingPublished && publishedData?.data?.isPublished) {
			toast.warning("Induction is already live");
			navigate(`/my-clubs/${clubId}`, { replace: true });
		}
	}, [isCheckingPublished, publishedData, clubId, navigate]);

	if (isCheckingPublished) return <Loader />;

	const handlePublish = async () => {
		try {
			await publishInduction({
				clubId: Number(clubId),
				inductionId: Number(inductionId),
				body: {
					opened_on: startDate.toISOString(),
					closing_on: endDate.toISOString(),
				},
			}).unwrap();
			toast.success("Induction published successfully");
			navigate(`/my-clubs/${clubId}`);
		} catch {
			toast.error("Failed to publish induction");
		}
	};

	const formatDate = (d: dayjs.Dayjs | null) => {
		if (!d) return "—";
		return d.format("MMM D, YYYY");
	};

	return (
		<div className="bg-purple-50 text-gray-900 font-sans min-h-screen flex flex-col items-center justify-center py-16 px-4">
			<main className="w-full max-w-4xl">
				{/* Stepper */}
				<div className="mb-8 text-center">
					<span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest block mb-2">
						Final Configuration
					</span>
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Step 4 of 4: Scheduling
					</h1>
					<div className="flex items-center justify-center gap-1 mt-4">
						{[0, 1, 2, 3].map((i) => (
							<div key={i} className="h-1 w-16 bg-indigo-600 rounded-full" />
						))}
					</div>
				</div>

				{/* Card */}
				<div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
					<div className="p-6 md:p-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* Start Date */}
							<div className="flex flex-col gap-3">
								<label className="text-sm font-medium text-gray-500 flex items-center gap-1">
									<svg
										className="w-4 h-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									Start Date
								</label>
								<ControlledCalendar
									selectedDate={startDate}
									onDateChange={setStartDate}
								/>
							</div>

							{/* End Date */}
							<div className="flex flex-col gap-3">
								<label className="text-sm font-medium text-gray-500 flex items-center gap-1">
									<svg
										className="w-4 h-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									End Date
								</label>
								<ControlledCalendar
									selectedDate={endDate}
									onDateChange={setEndDate}
								/>
							</div>
						</div>

						{/* Selected range summary */}
						<div className="mt-8 pt-8 border-t border-gray-100">
							<div className="flex flex-wrap gap-4 text-sm text-gray-500">
								<span>
									<span className="font-medium text-gray-700">Start:</span>{" "}
									{formatDate(startDate)}
								</span>
								<span className="text-gray-300">→</span>
								<span>
									<span className="font-medium text-gray-700">End:</span>{" "}
									{formatDate(endDate)}
								</span>
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3 border-t border-gray-100">
						<button
							onClick={() =>
								navigate(
									`/my-clubs/${clubId}/${inductionId}/create-form`,
								)
							}
							className="w-full md:w-auto px-6 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-all active:scale-95"
						>
							Back to Step 3
						</button>
						<button
							onClick={handlePublish}
							disabled={isPublishing}
							className={[
								"w-full md:w-auto px-8 py-3 rounded-lg text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2",
								"bg-gradient-to-br from-indigo-600 to-purple-600",
								isPublishing && "opacity-70 pointer-events-none",
							].join(" ")}
						>
							Publish Induction
							<svg
								className="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
						</button>
						{isPublishing && <Loader />}
					</div>
				</div>
			</main>

		</div>
	);
}
