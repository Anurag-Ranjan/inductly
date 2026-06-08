import { apiUtil, METHODS } from "../../../services/api";

export const getMyClubsApi = async (page: number = 1, limit: number = 3) => {
    const result = await apiUtil("/clubs", METHODS.get, { params: { page, limit } });
    return result;
};
