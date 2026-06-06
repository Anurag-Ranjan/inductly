import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { initializeAuth } from "../../features/auth/services/authServices";

export default function AuthInitializer() {
	const dispatch = useDispatch();

	useEffect(() => {
		initializeAuth(dispatch);
	}, []);

	return null;
}
