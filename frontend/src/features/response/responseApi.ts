import { baseApi } from "../../app/api/baseApi";

export const responseApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getForm: builder.query({
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
	}),
});
