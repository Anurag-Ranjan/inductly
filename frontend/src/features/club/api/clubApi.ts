import { apiUtil, METHODS } from "../../../services/api";
import { baseApi } from "../../../app/api/baseApi";

export const getMyClubsApi = async (page: number = 1, limit: number = 3) => {
	const result = await apiUtil("/clubs", METHODS.get, {
		params: { page, limit },
	});
	return result;
};

export const clubsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getMyClubs: builder.query({
			query: (page: number) => ({
				url: "/clubs",
				method: "GET",
				params: { page },
			}),
			providesTags: ["MyClubs", "Club"],
		}),
		getClub: builder.query({
			query: (clubId: number) => ({
				url: `/clubs/${clubId}`,
				method: "GET",
			}),

			providesTags: ["Club"],
		}),
		getAllClubs: builder.query({
			query: () => ({
				url: "/clubs/all",
				method: "GET",
			}),
			providesTags: ["AllClubs"],
		}),
	}),
});

export const { useGetClubQuery, useGetMyClubsQuery, useGetAllClubsQuery } =
	clubsApi;
