import { Outlet, useParams } from "react-router";
import Loader from "../loaders/Loader";
import {
	useGetClubQuery,
	useGetMyClubsQuery,
} from "../../features/club/api/clubApi";
import { toast } from "react-toastify";
import { useEffect } from "react";

export function ClubLayout() {
	const { clubId } = useParams();

	const {
		data: club,
		isLoading,
		isError,
		error,
	} = useGetClubQuery(Number(clubId));

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message ?? "Failed to load club");
		}
	}, [isError, error]);

	if (isLoading) {
		return <Loader />;
	}

	return <Outlet />;
}
