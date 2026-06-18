import { useEffect, useRef, useState } from "react";

export function useSyncedSelection<T extends { value: string }>(
	value: string | null,
	items: T[],
): [T | null, React.Dispatch<React.SetStateAction<T | null>>] {
	const [selectedItem, setSelectedItem] = useState<T | null>(
		value ? items.find((item) => item.value === value) || null : null,
	);

	const lastSyncedValueRef = useRef(value);

	useEffect(() => {
		if (lastSyncedValueRef.current !== value) {
			lastSyncedValueRef.current = value;
			setSelectedItem(
				value ? items.find((item) => item.value === value) || null : null,
			);
		}
	}, [value, items]);

	return [selectedItem, setSelectedItem];
}
