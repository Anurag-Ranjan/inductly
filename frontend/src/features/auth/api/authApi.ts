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
		console.log(error.response?.data);
		return error.response?.data;
	}
};

export const loginApi = async (payload: LoginPayload) => {
	const result = await api.post(`/user/login`, payload);
	return result.data;
};

export const verifyTokenApi = async (payload: { token: string }) => {
	try {
		return await api.get(`/user/verify/${payload.token}`);
	} catch (error: any) {
		console.log(error.response);
		return error.response.data;
	}
};
