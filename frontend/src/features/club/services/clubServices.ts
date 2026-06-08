import { toast } from "react-toastify";
import { setLoading } from "../../auth/authSlice";
import { getMyClubsApi } from "../api/clubApi";

export const getMyClubsServices = async (dispatch: any, page: number = 1) => {
    dispatch(setLoading(true));
    const result = await getMyClubsApi(page);
    if (!result?.success) {
        toast.error(result?.data?.message || "Failed to fetch clubs");
        dispatch(setLoading(false));
        return;
    }
    dispatch(setLoading(false));
    return result.data;
};
