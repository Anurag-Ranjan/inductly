import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../constants";

export const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
});

export const METHODS = {
	get: "GET",
	post: "POST",
	patch: "PATCH",
	delete: "DELETE",
};

export const apiUtil = async (path: string, method: string, payload: any) => {
	try {
		switch (method) {
			case "GET": {
				const result = await api.get(path, payload);
				return result.data;
				break;
			}
			case "POST": {
				const result = await api.post(path, payload);
				return result.data;
				break;
			}
			case "PATCH": {
				const result = await api.patch(path, payload);
				return result.data;
				break;
			}
			case "DELETE": {
				const result = await api.delete(path, payload);
				return result.data;
				break;
			}
			default:
				throw new Error();
		}
	} catch (error: any) {
		if (error instanceof AxiosError) {
			return error.response;
		}
	}
};
