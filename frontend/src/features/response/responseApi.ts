import { baseApi } from "../../app/api/baseApi";

export const responseApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getFormForApplicant: builder.query({
			query: ({
				clubId,
				inductionId,
				formId,
			}: {
				clubId: number;
				inductionId: number;
				formId: number;
			}) => ({
				url: `/clubs/${clubId}/inductions/${inductionId}/form/${formId}/respond`,
				method: "GET",
			}),
		}),
		uploadFile: builder.mutation({
			query: ({
				clubId,
				inductionId,
				formId,
				formData,
			}: {
				clubId: number;
				inductionId: number;
				formId: number;
				formData: FormData;
			}) => ({
				url: `/clubs/${clubId}/inductions/${inductionId}/form/${formId}/upload`,
				method: "POST",
				data: formData,
			}),
		}),

		saveFormDraft: builder.mutation({
			query: ({
				clubId,
				inductionId,
				formId,
				formAnswers,
			}: {
				clubId: number;
				inductionId: number;
				formId: number;
				formAnswers: { question_id: number; answer: string }[];
			}) => ({
				url: `/clubs/${clubId}/inductions/${inductionId}/form/${formId}/save-draft`,
				method: "POST",
				data: { formAnswers },
			}),
		}),
		submitApplication: builder.mutation({
			query: ({
				clubId,
				inductionId,
				formId,
				formAnswers,
			}: {
				clubId: number;
				inductionId: number;
				formId: number;
				formAnswers: { question_id: number; answer: string }[];
			}) => ({
				url: `/clubs/${clubId}/inductions/${inductionId}/form/${formId}/submit`,
				method: "POST",
				data: { formAnswers },
			}),
		}),
	}),
});

export const {
	useGetFormForApplicantQuery,
	useUploadFileMutation,
	useSaveFormDraftMutation,
	useSubmitApplicationMutation,
} = responseApi;
