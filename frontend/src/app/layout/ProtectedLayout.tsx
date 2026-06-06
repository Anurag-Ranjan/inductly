import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import SideBar from "../../components/shared/protectedroutecomponents/SideBar";
import NavBar from "../../components/shared/protectedroutecomponents/NavBar";

export default function ProtectedLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href =
			"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
		document.head.appendChild(link);
	}, []);

	return (
		<div
			className="min-h-screen flex font-sans text-gray-900"
			style={{ background: "#fcf8ff" }}
		>
			<SideBar
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
			/>

			<div className="md:ml-64 flex-1 flex flex-col min-h-screen">
				<NavBar
					setSidebarOpen={setSidebarOpen}
				/>

				<main className="flex-1" style={{ background: "#fcf8ff" }}>
					<Outlet />
				</main>
			</div>
		</div>
	);
}
