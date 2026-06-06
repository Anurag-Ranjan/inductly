import { toast } from "react-toastify";
import { setLoading, setUser } from "../../auth/authSlice";
import { onboardApi } from "../api/userApi";

export const handleUserOnboarding = async (
	payload: {
		batch: string;
		branch: string;
	},
	dispatch: any,
	navigate: any,
	user: any,
) => {
	dispatch(setLoading(true));
	const result = await onboardApi(payload);
	if (!result.success) {
		toast.error(result.data.message);
		return;
	}
	dispatch(setUser({ ...user, isOnboarded: true }));
	dispatch(setLoading(false));
	toast.success(result.message);
	// navigate("/dashboard");
};
