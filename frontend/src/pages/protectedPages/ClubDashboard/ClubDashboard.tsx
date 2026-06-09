import { Link } from "react-router";
import VisitorView from "./views/VisitorView";
import MemberView from "./views/MemberView";
import AdminView from "./views/AdminView";

export default function ClubDashboard() {
	const role = "admin";

	const view = {
		visitor: <VisitorView />,
		member: <MemberView />,
		admin: <AdminView />,
	}[role];

	return (
		<div
			className="min-h-screen bg-violet-50 text-slate-900"
			style={{ fontFamily: "'Inter', sans-serif" }}
		>
			<main className="mx-auto px-4 md:px-6 py-8">
				<Link
					to="/my-clubs"
					className="inline-flex items-center gap-2 text-indigo-600 text-sm font-medium hover:bg-violet-100 transition-colors px-4 py-2 rounded-lg active:scale-95 -ml-4 mb-6"
				>
					<span className="material-symbols-outlined">arrow_back</span>
					Back to Clubs
				</Link>
				{view}
			</main>
		</div>
	);
}
