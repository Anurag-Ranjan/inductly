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
		scoreApplicant: builder.mutation({
			query: ({
				applicationId,
				stageId,
				clubId,
				body,
			}: {
				applicationId: number;
				stageId: number;
				clubId: number;
				body: { status: string; notes?: string; score?: number };
			}) => ({
				url: `/applications/${applicationId}/stages/${stageId}`,
				method: "PATCH",
				params: { clubId },
				data: body,
			}),
			invalidatesTags: ["MyApplications", "Applications"],
		}),
		moveToNextStage: builder.mutation({
			query: ({
				applicationId,
				stageId,
				clubId,
			}: {
				applicationId: number;
				stageId: number;
				clubId: number;
			}) => ({
				url: `/applications/${applicationId}/stages/${stageId}/next-stage`,
				method: "PATCH",
				params: { clubId },
			}),
			invalidatesTags: ["MyApplications", "Applications"],
		}),
	}),
});

export const {
	useGetMyApplicationsQuery,
	useGetApplicationDetailsQuery,
	useScoreApplicantMutation,
	useMoveToNextStageMutation,
} = applicationApi;
