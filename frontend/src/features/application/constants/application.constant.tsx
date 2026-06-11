export const STATUS_CONFIG: any = {
	pending: {
		label: "Pending",
		pillBg: "bg-[#f5f2ff]",
		pillText: "text-[#464555]",
		icon: (
			// schedule icon
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="w-[18px] h-[18px]"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm.01 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
			</svg>
		),
	},
	shortlisted: {
		label: "Shortlisted",
		pillBg: "bg-[#e2dfff]",
		pillText: "text-[#3525cd]",
		icon: (
			// star filled
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="w-[18px] h-[18px]"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
			</svg>
		),
	},
	accepted: {
		label: "Accepted",
		pillBg: "bg-emerald-50",
		pillText: "text-emerald-700",
		icon: (
			// check_circle filled
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="w-[18px] h-[18px]"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.41 14.59L6.7 12.7a.996.996 0 1 1 1.41-1.41l2.47 2.47 5.3-5.3a.996.996 0 1 1 1.41 1.41l-5.99 6z" />
			</svg>
		),
	},
	rejected: {
		label: "Rejected",
		pillBg: "bg-[#ffdad6]",
		pillText: "text-[#ba1a1a]",
		icon: (
			// cancel filled
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="w-[18px] h-[18px]"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
			</svg>
		),
	},
};
