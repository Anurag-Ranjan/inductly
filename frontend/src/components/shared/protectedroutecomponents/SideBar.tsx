import { NavLink } from "react-router";

function Icon({ name, className = "" }: { name: string; className?: string }) {
	return (
		<span
			className={`material-symbols-outlined ${className}`}
			style={{
				fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
			}}
		>
			{name}
		</span>
	);
}

const NAV_ITEMS = [
	{ icon: "dashboard", label: "Dashboard", path: "/dashboard" },
	{ icon: "groups", label: "My Clubs", path: "/my-clubs" },
	{ icon: "campaign", label: "Open Inductions", path: "/open-inductions" },
	{ icon: "description", label: "Applications", path: "/applications" },
	{ icon: "person", label: "Profile", path: "/profile" },
	{ icon: "settings", label: "Settings", path: "/settings" },
];

export default function SideBar({
	sidebarOpen,
	setSidebarOpen,
}: {
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
}) {
	return (
		<>
			<aside
				className={`flex flex-col gap-2 p-4 h-screen fixed left-0 top-0 border-r border-gray-200 w-64 z-50 transition-transform duration-300
					${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
				style={{ background: "#f5f2ff" }}
			>
				<div className="mb-8 px-3">
					<h1 className="text-xl font-bold text-indigo-600 leading-tight">
						Inductly
					</h1>
					<p className="text-xs font-semibold text-gray-400 tracking-wide mt-0.5">
						Student Portal
					</p>
				</div>

				<nav className="flex-1 space-y-1">
					{NAV_ITEMS.map(({ icon, label, path }) => (
						<NavLink
							key={label}
							to={path}
							end
							onClick={() => setSidebarOpen(false)}
							className={({ isActive }) =>
								`w-full flex items-center gap-4 rounded-lg px-4 py-2 text-sm font-medium transition-all text-left ${
									isActive
										? "bg-indigo-600 text-white font-bold"
										: "text-gray-500 hover:bg-gray-200"
								}`
							}
						>
							<Icon name={icon} className="text-xl" />
							{label}
						</NavLink>
					))}
				</nav>

				<div className="mt-auto border-t border-gray-200 pt-3">
					<button className="w-full flex items-center gap-4 text-red-500 hover:bg-red-50 rounded-lg px-4 py-2 text-sm font-medium transition-all">
						<Icon name="logout" className="text-xl" />
						Logout
					</button>
				</div>
			</aside>

			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black/30 z-40 md:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}
		</>
	);
}
