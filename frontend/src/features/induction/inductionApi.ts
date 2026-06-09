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
	}),
});

export const { useCreateInductionMutation } = inductionsApi;
