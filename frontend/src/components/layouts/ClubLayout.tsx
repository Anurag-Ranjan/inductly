import { Outlet, useParams } from "react-router";
import { useGetClubQuery } from "../../features/club/api/clubApi";
import Loader from "../loaders/Loader";

function ClubLayout() {
	const { clubId } = useParams();
	const { data, isLoading } = useGetClubQuery(Number(clubId));

	if (isLoading) return <Loader />;
	return (
		<>
			<Outlet context={{ ...data, isAdmin: data.data.role === "ADMIN" }} />
		</>
	);
}

export default ClubLayout;
