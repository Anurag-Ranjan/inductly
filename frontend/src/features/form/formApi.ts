import { baseApi } from "../../app/api/baseApi";

const formApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		createForm: builder.mutation({
			query: ({
				clubId,
				inductionId,
				body,
			}: {
				clubId: string | number;
				inductionId: string | number;
				body: { title: string; description?: string | null };
			}) => ({
				url: `/clubs/${clubId}/inductions/${inductionId}/form`,
				method: "POST",
				data: body,
			}),
			invalidatesTags: ["Form"],
		}),
		getFormByInduction: builder.query({
			query: ({
				clubId,
				inductionId,
			}: {
				clubId: string | number;
				inductionId: string | number;
			}) => ({
				url: `/clubs/${clubId}/inductions/${inductionId}/form`,
				method: "GET",
			}),
			providesTags: ["Form"],
		}),
		getForm: builder.query({
			query: ({
				clubId,
				inductionId,
				formId,
			}: {
				clubId: string | number;
				inductionId: string | number;
				formId: string | number;
			}) => ({
				url: `/clubs/${clubId}/inductions/${inductionId}/form/${formId}`,
				method: "GET",
			}),
			providesTags: ["Form"],
		}),
		updateForm: builder.mutation({
			query: ({
				clubId,
				inductionId,
				formId,
				body,
			}: {
				clubId: string | number;
				inductionId: string | number;
				formId: string | number;
				body: { title?: string; description?: string | null };
			}) => ({
				url: `/clubs/${clubId}/inductions/${inductionId}/form/${formId}`,
				method: "PATCH",
				data: body,
			}),
			invalidatesTags: ["Form"],
		}),
		createQuestions: builder.mutation({
			query: ({
				clubId,
				inductionId,
				formId,
				body,
			}: {
				clubId: string | number;
				inductionId: string | number;
				formId: string | number;
				body: Record<string, any>[];
			}) => ({
				url: `/clubs/${clubId}/inductions/${inductionId}/form/${formId}/questions`,
				method: "POST",
				data: body,
			}),
			invalidatesTags: ["Form"],
		}),
		updateQuestion: builder.mutation({
			query: ({
				clubId,
				inductionId,
				formId,
				questionId,
				body,
			}: {
				clubId: string | number;
				inductionId: string | number;
				formId: string | number;
				questionId: string | number;
				body: Record<string, any>;
			}) => ({
				url: `/clubs/${clubId}/inductions/${inductionId}/form/${formId}/questions/${questionId}`,
				method: "PATCH",
				data: body,
			}),
			invalidatesTags: ["Form"],
		}),
		deleteQuestion: builder.mutation({
			query: ({
				clubId,
				inductionId,
				formId,
				questionId,
			}: {
				clubId: string | number;
				inductionId: string | number;
				formId: string | number;
				questionId: string | number;
			}) => ({
				url: `/clubs/${clubId}/inductions/${inductionId}/form/${formId}/questions/${questionId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Form"],
		}),
		publishForm: builder.mutation({
			query: ({
				clubId,
				inductionId,
				formId,
			}: {
				clubId: string | number;
				inductionId: string | number;
				formId: string | number;
			}) => ({
				url: `/clubs/${clubId}/inductions/${inductionId}/form/${formId}/publish`,
				method: "POST",
			}),
			invalidatesTags: ["Form"],
		}),
		submitForm: builder.mutation({
			query: ({
				clubId,
				inductionId,
				formId,
				applicationId,
				body,
			}: {
				clubId: string | number;
				inductionId: string | number;
				formId: string | number;
				applicationId: string | number;
				body: { formAnswers: { question_id: number; answer: string }[] };
			}) => ({
				url: `/clubs/${clubId}/inductions/${inductionId}/form/${formId}/applications/${applicationId}`,
				method: "POST",
				data: body,
			}),
			invalidatesTags: ["Form"],
		}),
	}),
});

export const {
	useCreateFormMutation,
	useGetFormByInductionQuery,
	useGetFormQuery,
	useUpdateFormMutation,
	useCreateQuestionsMutation,
	useUpdateQuestionMutation,
	useDeleteQuestionMutation,
	usePublishFormMutation,
	useSubmitFormMutation,
} = formApi;
