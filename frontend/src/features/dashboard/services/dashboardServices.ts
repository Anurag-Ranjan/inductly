import { toast } from "react-toastify";
import { setLoading } from "../../auth/authSlice";
import { getDashboardApi } from "../api/dashboardApi";

export const getDashboardService = async (dispatch: any) => {
	dispatch(setLoading(true));
	const result = await getDashboardApi();
	if (!result?.success) {
		toast.error(result?.data?.message || "Failed to fetch dashboard");
		dispatch(setLoading(false));
		return;
	}
	dispatch(setLoading(false));
	return result.data;
};
