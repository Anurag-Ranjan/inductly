import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export const baseApi = createApi({
	reducerPath: "api",

	baseQuery: axiosBaseQuery(),

	tagTypes: [
		"Club",
		"ClubMembers",
		"Applications",
		"MyClubs",
		"CreateInduction",
		"Stages",
		"Form",
		"OpenInductions",
		"MyApplications",
		"AllClubs",
	],

	endpoints: () => ({}),
});
