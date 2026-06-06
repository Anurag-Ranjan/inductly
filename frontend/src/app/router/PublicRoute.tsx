import Loader from "../../components/loaders/Loader";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

const PublicRoute = () => {
	const { loading, isAuthenticated, user } = useSelector((state) => state.auth);
	const location = useLocation();

	if (loading) {
		return <Loader />;
	}

	if (isAuthenticated) {
		const from = location.state?.from || (user?.isOnboarded ? "/dashboard" : "/onboard");
		return <Navigate to={from} replace />;
	}

	return <Outlet />;
};

export default PublicRoute;
