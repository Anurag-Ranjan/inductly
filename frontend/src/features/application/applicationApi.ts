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
		getApplicationDetails: builder.query({
			query: (applicationId: number) => ({
				url: `/applications/${applicationId}/details`,
				method: "GET",
			}),
		}),
	}),
});

export const { useGetMyApplicationsQuery, useGetApplicationDetailsQuery } =
	applicationApi;
