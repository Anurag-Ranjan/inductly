import { useSelector } from "react-redux";

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

export default function NavBar({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) {
	const user = useSelector((state: any) => state.auth?.user);

	return (
		<header className="flex justify-between items-center w-full px-6 h-20 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
			<button
				className="md:hidden mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
				onClick={() => setSidebarOpen(true)}
			>
				<Icon name="menu" className="text-gray-500 text-2xl" />
			</button>

			<div className="flex items-center gap-4 flex-1">
				<div className="relative w-full max-w-md">
					<Icon
						name="search"
						className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none"
					/>
					<input
						type="text"
						placeholder="Search clubs, inductions..."
						className="w-full bg-gray-100 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
					/>
				</div>
			</div>

			<div className="flex items-center gap-5">
				<button className="relative hover:bg-gray-100 rounded-full p-2 transition-all active:scale-95">
					<Icon name="notifications" className="text-gray-500 text-xl" />
					<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
				</button>
				<button className="hover:bg-gray-100 rounded-full p-2 transition-all active:scale-95">
					<Icon name="help" className="text-gray-500 text-xl" />
				</button>
				<div className="h-8 w-px bg-gray-200 mx-1" />
				<div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-1 transition-all">
					<div className="text-right hidden sm:block">
						<p className="text-sm font-medium text-gray-900 leading-tight">
							{user?.name || "User"}
						</p>
					</div>
					<div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-200">
						{user?.profile_picture ? (
							<img
								src={user.profile_picture}
								alt={user.name || "User"}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
								{user?.name?.charAt(0) || "U"}
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
