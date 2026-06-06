import { api } from "../../../services/api";

type LoginPayload = {
	email: string;
	password: string;
};

type SignUpPayload = {
	name: string;
	email: string;
	password: string;
};

export const signUpApi = async (payload: SignUpPayload) => {
	try {
		const result = await api.post("/user/signup", payload);
		return result.data;
	} catch (error: any) {
		// console.log(error.response?.data);
		return error.response;
	}
};

export const loginApi = async (payload: LoginPayload) => {
	try {
		const result = await api.post(`/user/login`, payload);
		return result.data;
	} catch (error: any) {
		console.log(error.response.status);
		return error.response;
	}
};

export const verifyTokenApi = async (payload: { token: string }) => {
	try {
		console.log(payload.token);
		const result = await api.get(`/user/verify/${payload.token}`);
		return result.data;
	} catch (error: any) {
		console.log(error.response);
		return error.response;
	}
};

export const logoutApi = async () => {
	try {
		const result = await api.get("/user/logout");
		return result.data;
	} catch (error: any) {
		return error.response;
	}
};

export const verifyAuthTokens = async () => {
	try {
		const result = await api.get("/user/refresh-access-token");
		return result.data;
	} catch (error: any) {
		return error.response;
	}
};
