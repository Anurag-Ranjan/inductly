import { apiUtil, METHODS } from "../../../services/api";

export const getDashboardApi = async () => {
	const result = await apiUtil("/dashboard", METHODS.get, null);
	return result;
};
