import { AxiosError } from "axios";
import { api } from "../../../services/api";
import { toast } from "react-toastify";

const METHODS = { get: "GET", post: "POST", patch: "PATCH", delete: "DELETE" };

const userApiUtil = async (path: string, method: string, payload: any) => {
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

export const onboardApi = async (payload: {
	branch: string;
	batch: string;
}) => {
	const result = await userApiUtil("/user/onboard", METHODS.post, payload);
	return result;
};

export const getProfileApi = async () => {
	const result = await userApiUtil("/user/profile", METHODS.get, {});
	return result;
};

export const updateGithubApi = async (payload: {
	gitHub: string;
}) => {
	const result = await userApiUtil("/user/socials/update/github", METHODS.patch, payload);
	return result;
};

export const updateLinkedInApi = async (payload: {
	linkedIn: string;
}) => {
	const result = await userApiUtil("/user/socials/update/linkedin", METHODS.patch, payload);
	return result;
};

export const updateProfileApi = async (payload: { mobile_number: string }) => {
	const result = await userApiUtil("/user/profile/update", METHODS.patch, payload);
	return result;
};

export const updateProfilePictureApi = async (file: File) => {
	try {
		const formData = new FormData();
		formData.append("file", file);
		const result = await api.patch("/user/profile/update/picture", formData);
		return result.data;
	} catch (error: any) {
		if (error instanceof AxiosError) {
			return error.response;
		}
	}
};
