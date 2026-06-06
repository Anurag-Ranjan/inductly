import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useNavigate } from "react-router";
import Loader from "../../../components/loaders/Loader";
import { handleverifyToken } from "../../../features/auth/services/authServices";
import { useDispatch } from "react-redux";

function VerifyToken() {
	const [searchParams] = useSearchParams();
	const dispatch = useDispatch();
	const token: string = searchParams.get("token")!;
	const navigate = useNavigate();
	useEffect(() => {
		Promise.resolve(handleverifyToken(dispatch, navigate, { token }));
	});
	return <Loader />;
}

export default VerifyToken;
