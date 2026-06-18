import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordInputProps {
	id: string;
	name: string;
	placeholder?: string;
	label?: string;
}

export function PasswordInput({
	id,
	name,
	placeholder = "******************",
	label,
}: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="flex flex-col">
			{label && (
				<label htmlFor={id} className="text-xs font-bold mb-1.5 text-gray-800">
					{label}
				</label>
			)}
			<div className="relative">
				<input
					id={id}
					name={name}
					placeholder={placeholder}
					type={showPassword ? "text" : "password"}
					className="border border-neutral-200 bg-neutral-50/50 w-full h-12 text-gray-800 px-4 pr-12 focus:outline-none focus:border-surface focus:ring-1 focus:ring-surface transition-all"
				/>
				<button
					type="button"
					onClick={() => setShowPassword(!showPassword)}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
					aria-label={showPassword ? "Hide password" : "Show password"}
				>
					{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
				</button>
			</div>
		</div>
	);
}
