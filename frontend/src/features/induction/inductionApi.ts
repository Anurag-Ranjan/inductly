import { baseApi } from "../../app/api/baseApi";

const inductionsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		createInduction: builder.mutation({
			query: ({
				body,
				clubId,
			}: {
				body: { title: string; description: string };
				clubId: string | number;
			}) => ({
				url: `/clubs/${clubId}/inductions`,
				method: "POST",
				data: body,
			}),
			invalidatesTags: ["CreateInduction", "Club"],
		}),
		getOpenInductions: builder.query({
			query: (page: number = 1) => ({
				url: `/inductions/open`,
				method: "GET",
				params: { page },
			}),
			providesTags: ["OpenInductions"],
		}),
		getInductions: builder.query({
			query: (clubId: string | number) => ({
				url: `/clubs/${clubId}/inductions`,
				method: "GET",
			}),
		}),
		getStages: builder.query({
			query: ({
				clubId,
				inductionId,
			}: {
				clubId: string | number;
				inductionId: string | number;
			}) => ({
				url: `/clubs/${clubId}/inductions/${inductionId}/stages`,
				method: "GET",
			}),
			providesTags: ["Stages"],
		}),
		createStages: builder.mutation({
			query: ({
				clubId,
				inductionId,
				body,
			}: {
				clubId: string | number;
				inductionId: string | number;
				body: {
					name: string;
					description?: string | null;
					order_index: number;
				}[];
			}) => ({
				url: `/clubs/${clubId}/inductions/${inductionId}/stages`,
				method: "POST",
				data: body,
			}),
			invalidatesTags: ["Stages"],
		}),
		getInductionDetails: builder.query({
			query: (params: {
				clubId: number | string;
				inductionId: number | string;
			}) => ({
				url: `clubs/${params.clubId}/inductions/${params.inductionId}`,
				method: "GET",
			}),
		}),
		updateInductionDetails: builder.mutation({
			query: (params: {
				clubId: number | string;
				inductionId: number | string;
				body: { title: string; description: string };
			}) => ({
				url: `clubs/${params.clubId}/inductions/${params.inductionId}/update`,
				method: "PATCH",
				data: params.body,
			}),
		}),
		getIsInductionPublished: builder.query({
			query: (params: {
				clubId: number | string;
				inductionId: number | string;
			}) => ({
				url: `clubs/${params.clubId}/inductions/${params.inductionId}/ispublished`,
				method: "GET",
			}),
		}),
		publishInduction: builder.mutation({
			query: (params: {
				clubId: number | string;
				inductionId: number | string;
				body: { opened_on: string; closing_on: string };
			}) => ({
				url: `clubs/${params.clubId}/inductions/${params.inductionId}`,
				method: "PATCH",
				data: params.body,
			}),
			invalidatesTags: ["CreateInduction", "Club"],
		}),
		getInductionDashboard: builder.query({
			query: (params: {
				clubId: number | string;
				inductionId: number | string;
			}) => ({
				url: `clubs/${params.clubId}/inductions/${params.inductionId}/dashboard`,
				method: "GET",
			}),
		}),
	}),
});

export const {
	useCreateInductionMutation,
	useGetInductionsQuery,
	useGetStagesQuery,
	useCreateStagesMutation,
	useGetOpenInductionsQuery,
	useGetInductionDetailsQuery,
	useUpdateInductionDetailsMutation,
	useGetIsInductionPublishedQuery,
	usePublishInductionMutation,
	useGetInductionDashboardQuery,
} = inductionsApi;
