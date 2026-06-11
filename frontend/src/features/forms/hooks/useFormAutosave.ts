import { useEffect } from "react";

export function useFormAutosave(
	syncForm: () => Promise<void>,
	deps: any[],
	hasPendingChanges: boolean,
) {
	useEffect(() => {
		if (!hasPendingChanges) return;

		const timer = setTimeout(() => {
			syncForm();
		}, 6000);

		return () => clearTimeout(timer);
	}, deps);
}
