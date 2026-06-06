import { toast } from "react-toastify";
import { setLoading, setUser } from "../../auth/authSlice";
import {
	onboardApi,
	getProfileApi,
	updateGithubApi,
	updateLinkedInApi,
} from "../api/userApi";

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
	navigate("/dashboard");
};

export const handleGetUserProfile = async (dispatch: any) => {
	dispatch(setLoading(true));
	const result = await getProfileApi();
	if (!result.success) {
		toast.error(result.data.message);
		dispatch(setLoading(false));
		return;
	}
	dispatch(setLoading(false));
	toast.success(result.message);
	return result.data;
};

export const handleUpdateGithub = async (dispatch: any, gitHub: string) => {
	dispatch(setLoading(true));
	const result = await updateGithubApi({ gitHub });
	if (!result.success) {
		toast.error(result.data?.message || "Failed to update GitHub");
		dispatch(setLoading(false));
		return;
	}
	dispatch(setLoading(false));
	toast.success(result.message);
	return result.data;
};

export const handleUpdateLinkedIn = async (dispatch: any, linkedIn: string) => {
	dispatch(setLoading(true));
	const result = await updateLinkedInApi({ linkedIn });
	if (!result.success) {
		toast.error(result.data?.message || "Failed to update LinkedIn");
		dispatch(setLoading(false));
		return;
	}
	dispatch(setLoading(false));
	toast.success(result.message);
	return result.data;
};
