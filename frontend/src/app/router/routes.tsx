import { createRoutesFromElements, Route } from "react-router";
import Home from "../../pages/Home/Home";
import SignUp from "../../pages/auth/SignUP/SignUp";
import VerifyToken from "../../pages/auth/VerifyToken/VerifyToken";
import SignIn from "../../pages/auth/SignIn/SignIn";
import DashBoard from "../../pages/protectedPages/Dashboard/DashBoard";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Onboarding from "../../pages/protectedPages/Onboarding/Onboarding";

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
			<Route path="dashboard" element={<DashBoard />}></Route>
		</Route>
	</>,
);
