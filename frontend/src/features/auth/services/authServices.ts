import {
	loginApi,
	logoutApi,
	signUpApi,
	verifyAuthTokens,
	verifyTokenApi,
} from "../api/authApi";
import { toast } from "react-toastify";
import { clearUser, setLoading, setUser } from "../authSlice";

export const handleUserLogin = async (
	dispatch: any,
	navigate: any,
	payload: any,
) => {
	dispatch(setLoading(true));
	const result = await loginApi(payload);

	if (!result.success) {
		toast.error(result.data.message);
		dispatch(setLoading(false));
		return;
	}
	toast.success(result.message);
	dispatch(setUser(result.data));
};

export const handleUserSignUp = async (dispatch: any, payload: any) => {
	dispatch(setLoading(true));
	const result = await signUpApi(payload);
	if (!result.success) {
		toast.error(result.data.message);
		dispatch(setLoading(false));
		return;
	}
	toast.success("Verification link sent to email");
	dispatch(setLoading(false));
};

export const handleUserLogout = async (dispatch: any, navigate: any) => {
	dispatch(setLoading(true));
	const result = await logoutApi();
	if (!result?.success) {
		toast.error(result?.data?.message || "Error Logging out User");
		dispatch(setLoading(false));
		return;
	}
	dispatch(clearUser());
	toast.success("Logged Out Successfully");
	dispatch(setLoading(false));
	navigate("/");
};

export const handleverifyToken = async (
	dispatch: any,
	navigate: any,
	payload: { token: string },
) => {
	const result = await verifyTokenApi(payload);
	dispatch(setLoading(true));
	if (!result.success) {
		toast.error(result.data.message);
		dispatch(setLoading(false));
		return;
	}
	toast.success(result.message);
	dispatch(setLoading(false));
	navigate("/sign-in");
};

export async function initializeAuth(dispatch: any) {
	try {
		dispatch(setLoading(true));
		const result = await verifyAuthTokens();
		if (!result.success) {
			throw new Error();
		}

		dispatch(setUser(result.data));
	} catch {
		dispatch(clearUser());
	} finally {
		dispatch(setLoading(false));
	}
}
