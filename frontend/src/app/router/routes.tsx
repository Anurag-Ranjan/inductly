import { createRoutesFromElements, Route } from "react-router";
import Home from "../../pages/Home/Home";
import SignUp from "../../pages/auth/SignUP/SignUp";
import VerifyToken from "../../pages/auth/VerifyToken/VerifyToken";

export const routes = createRoutesFromElements([
	<Route path="/" element={<Home />}></Route>,
	<Route path="sign-up" element={<SignUp />}></Route>,
	<Route path="verify-email" element={<VerifyToken />}></Route>,
]);
