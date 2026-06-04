import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { verifyTokenApi } from "../../../features/auth/api/authApi";

function VerifyToken() {
	const [searchParams] = useSearchParams();
	const token: string = searchParams.get("token")!;
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setLoading(true);
		Promise.resolve(verifyTokenApi({ token })).then(() => setLoading(false));
	});
	return loading ? (
		<h1>Verifying Token......</h1>
	) : (
		<div>
			<h1>Token verified, please sign in</h1>
		</div>
	);
}

export default VerifyToken;
