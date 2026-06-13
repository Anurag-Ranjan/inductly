import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface ControlledCalendarProps {
	selectedDate: Dayjs | null;
	onDateChange: (date: Dayjs | null) => void;
}

export default function ControlledCalendar({
	selectedDate,
	onDateChange,
}: ControlledCalendarProps) {
	const [view, setView] = useState("day");

	const handleViewChange = (_event: any, newView: string | null) => {
		if (newView !== null) {
			setView(newView);
		}
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Box sx={{ width: 320, margin: "auto" }}>
				<ToggleButtonGroup
					value={view}
					exclusive
					onChange={handleViewChange}
					fullWidth
					sx={{ mb: 2 }}
				>
					<ToggleButton value="year">Year</ToggleButton>
					<ToggleButton value="month">Month</ToggleButton>
					<ToggleButton value="day">Day</ToggleButton>
				</ToggleButtonGroup>

				<DateCalendar
					value={selectedDate}
					onChange={onDateChange}
					view={view as "year" | "month" | "day"}
					onViewChange={(newView) => setView(newView)}
					views={["year", "month", "day"]}
				/>
			</Box>
		</LocalizationProvider>
	);
}
