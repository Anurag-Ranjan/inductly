import type { AxiosRequestConfig } from "axios";
import { AxiosError } from "axios";
import { api } from "../../services/api";

export const axiosBaseQuery =
	() =>
	async ({
		url,
		method,
		data,
		params,
	}: {
		url: string;
		method: AxiosRequestConfig["method"];
		data?: unknown;
		params?: unknown;
	}) => {
		try {
			const result = await api({
				url,
				method,
				data,
				params,
			});

			return {
				data: result.data,
			};
		} catch (error) {
			const err = error as AxiosError;

			return {
				error: {
					status: err.response?.status,
					data: err.response?.data,
				},
			};
		}
	};
