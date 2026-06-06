import { Navigate, Outlet } from "react-router";
import Loader from "../../components/loaders/Loader";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
	const { loading, isAuthenticated } = useSelector((state) => state.auth);

	if (loading) {
		return <Loader />;
	}

	if (!isAuthenticated) {
		return <Navigate to="/sign-in" replace />;
	}

	return <Outlet />;
};

export default PrivateRoute;
