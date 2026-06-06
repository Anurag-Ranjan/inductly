import { Navigate, Outlet, useLocation } from "react-router";
import Loader from "../../components/loaders/Loader";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
	const { loading, isAuthenticated, user } = useSelector((state) => state.auth);
	const location = useLocation();

	if (loading) {
		return <Loader />;
	}

	if (!isAuthenticated) {
		return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
	}

	if (user?.isOnboarded && location.pathname === "/onboard") {
		return <Navigate to="/dashboard" replace />;
	}

	if (!user?.isOnboarded && location.pathname === "/dashboard") {
		return <Navigate to="/onboard" replace />;
	}

	return <Outlet />;
};

export default PrivateRoute;
