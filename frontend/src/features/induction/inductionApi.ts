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
	}),
});

export const {
	useCreateInductionMutation,
	useGetInductionsQuery,
	useGetStagesQuery,
	useCreateStagesMutation,
	useGetOpenInductionsQuery,
} = inductionsApi;
