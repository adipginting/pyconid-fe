import { useMemo } from "react";
import { cn } from "~/lib/utils";

export const Checkbox = ({
	label,
	id,
	name,
	value = false,
	onChange,
	errorMessage,
	labelClassName,
	disabled = false,
}: {
	label: string | React.ReactNode;

	id: string;
	name: string;
	value?: boolean | null;
	onChange: (value: boolean) => void;
	errorMessage?: string;
	labelClassName?: string;
	disabled?: boolean;
}) => {
	const isChecked = useMemo(() => {
		return value === true;
	}, [value]);
	return (
		<>
			<div className="flex gap-2 items-center">
				<input
					className="w-5 h-5 disabled:opacity-50 disabled:cursor-not-allowed"
					id={id}
					name={name}
					type="checkbox"
					checked={isChecked}
					value={isChecked ? "true" : "false"}
					disabled={disabled}
					onChange={(e) => onChange(e.target.checked)}
				/>
				<span
					className={cn(
						labelClassName,
						disabled && "opacity-50 cursor-not-allowed",
					)}
				>
					{label}
				</span>
			</div>
			{errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
		</>
	);
};
