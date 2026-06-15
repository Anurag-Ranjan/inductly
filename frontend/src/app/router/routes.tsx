import { createRoutesFromElements, Route } from "react-router";
import Home from "../../pages/Home/Home";
import SignUp from "../../pages/auth/SignUP/SignUp";
import VerifyToken from "../../pages/auth/VerifyToken/VerifyToken";
import SignIn from "../../pages/auth/SignIn/SignIn";
import DashBoard from "../../pages/protectedPages/Dashboard/DashBoard";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Onboarding from "../../pages/protectedPages/Onboarding/Onboarding";
import Profile from "../../pages/protectedPages/Profile/Profile";
import ProtectedLayout from "../layout/ProtectedLayout";
import MyClubs from "../../pages/protectedPages/MyClubs/MyClubs";
import { MyClubsLayout } from "../../components/layouts/MyClubLayout";
import ClubDashboard from "../../pages/protectedPages/ClubDashboard/ClubDashboard";
import ClubLayout from "../../components/layouts/ClubLayout";
import CreateInduction from "../../pages/protectedPages/ClubDashboard/inductions/CreateInduction";
import CreateStages from "../../pages/protectedPages/ClubDashboard/inductions/CreateStages";
import CreateForm from "../../pages/protectedPages/ClubDashboard/inductions/CreateForm/CreateForm";
import OpenInductions from "../../pages/protectedPages/OpenInductions/OpenInductions";
import Apply from "../../pages/protectedPages/Apply/Apply";
import MyApplications from "../../pages/protectedPages/MyApplications/MyApplications";
import ScheduleInduction from "../../pages/protectedPages/ClubDashboard/inductions/ScheduleInduction/ScheduleInduction";
import ExploreClubs from "../../pages/protectedPages/ExploreClubs/ExploreClubs";

export const routes = createRoutesFromElements(
	<>
		<Route path="/" element={<Home />}></Route>
		<Route path="/verify-email" element={<VerifyToken />}></Route>
		<Route element={<PublicRoute />}>
			<Route path="sign-up" element={<SignUp />}></Route>
			<Route path="sign-in" element={<SignIn />}></Route>
		</Route>

		<Route element={<PrivateRoute />}>
			<Route path="onboard" element={<Onboarding />}></Route>
			<Route element={<ProtectedLayout />}>
				<Route path="dashboard" element={<DashBoard />}></Route>
				<Route path="explore/clubs" element={<ExploreClubs />}></Route>
				<Route path="profile" element={<Profile />}></Route>
				<Route path="my-clubs" element={<MyClubsLayout />}>
					<Route path="" element={<MyClubs />} />
					<Route path=":clubId" element={<ClubLayout />}>
						<Route path="" element={<ClubDashboard />} />
						<Route path="create-induction" element={<CreateInduction />} />
						<Route
							path=":inductionId/edit-induction"
							element={<CreateInduction />}
						/>
						<Route path=":inductionId/add-stages" element={<CreateStages />} />
						<Route
							path=":inductionId/create-form/:formId?"
							element={<CreateForm />}
						/>
						<Route
							path=":inductionId/schedule-induction"
							element={<ScheduleInduction />}
						/>
					</Route>
				</Route>
				<Route path="open-inductions" element={<OpenInductions />}></Route>
				<Route
					path=":clubId/:inductionId/:formId/apply"
					element={<Apply />}
				></Route>
				<Route path="my-applications" element={<MyApplications />} />
			</Route>
		</Route>
	</>,
);
