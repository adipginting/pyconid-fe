import { useEffect, useRef, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);

	return debouncedValue;
}

export function useDebouncedCallback<
	T extends (...args: Parameters<T>) => void,
>(callback: T, delay: number): (...args: Parameters<T>) => void {
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	return (...args: Parameters<T>) => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}
		timerRef.current = setTimeout(() => {
			callbackRef.current(...args);
		}, delay);
	};
}
