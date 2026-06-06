import Loader from "../../components/loaders/Loader";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const PublicRoute = () => {
	const { loading, isAuthenticated } = useSelector((state) => state.auth);

	if (loading) {
		return <Loader />;
	}

	if (isAuthenticated) {
		return <Navigate to="/dashboard" replace />;
	}

	return <Outlet />;
};

export default PublicRoute;
