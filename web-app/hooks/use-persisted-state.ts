import { useEffect, useState } from "react";

export function usePersistedState<T>(key: string, initialValue: T): [T, (value: T) => void] {
	const [state, setState] = useState<T>(() => {
		if (typeof window === "undefined") return initialValue;
		try {
			const stored = localStorage.getItem(key);
			return stored ? (JSON.parse(stored) as T) : initialValue;
		} catch (err) {
			console.error("Error reading localStorage key", key, err);
			return initialValue;
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(state));
		} catch (err) {
			console.error("Error writing localStorage key", key, err);
		}
	}, [key, state]);

	return [state, setState];
}
