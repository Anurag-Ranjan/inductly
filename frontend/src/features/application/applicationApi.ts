import { baseApi } from "../../app/api/baseApi";

const applicationApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getMyApplications: builder.query({
			query: () => ({
				url: "/applications/me",
				method: "GET",
			}),
			providesTags: ["MyApplications"],
		}),
	}),
});

export const { useGetMyApplicationsQuery } = applicationApi;
