// biome-ignore-all lint: Anoying
import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useClickOutside } from "~/hooks/use-click-outside";
import { useDebouncedCallback } from "~/hooks/use-debounce";

const DropdownChevron = () => (
	<img
		src="/svg/user-profile/dropdown-chevron-search.svg"
		alt=""
		width="24"
		height="24"
	/>
);

export const DropdownSearch = ({
	label,
	id,
	name,
	placeholder,
	dropdownItems,
	searchInputValue = "",
	onSearchInputChange = () => {},
	value = null,
	onChange,
	disabled = false,
	errorMessage,
	isLoading = false,
	className,
}: {
	label: string;
	id: string;
	name: string;
	placeholder: string;
	dropdownItems: { label: string; value: string }[];
	searchInputValue?: string | null;
	onSearchInputChange?: (value: string) => void;
	value?: {
		label: string;
		value: string;
	} | null;
	onChange: (value: { label: string; value: string }) => void;
	disabled?: boolean;
	errorMessage?: string;
	isLoading?: boolean;
	className?: string;
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [localSearch, setLocalSearch] = useState(searchInputValue ?? "");

	useClickOutside(containerRef, () => setIsOpen(false));

	const debouncedNotifyParent = useDebouncedCallback(onSearchInputChange, 300);

	const handleSelectItem = (item: { label: string; value: string }) => {
		setIsOpen(false);
		onChange(item);
	};

	return (
		<div ref={containerRef} className={twMerge("w-full relative", className)}>
			<label htmlFor={id} className="block mb-2 text-sm font-medium text-black">
				{label}
			</label>
			<input
				id={id}
				name={name}
				value={value?.value ?? ""}
				type="hidden"
				placeholder={placeholder}
			/>
			<input
				type="text"
				className={twMerge(
					"w-full flex justify-between p-2 border rounded-lg",
					disabled
						? "bg-gray-100 cursor-not-allowed"
						: "bg-white hover:cursor-pointer",
					errorMessage ? "border-red-500" : "border-gray-300",
				)}
				onClick={() => {
					if (!isOpen) {
						setLocalSearch(searchInputValue ?? "");
					}
					setIsOpen(!isOpen);
				}}
				value={isOpen ? localSearch : (value?.label ?? "")}
				onChange={(e) => {
					const val = e.target.value;
					setLocalSearch(val);
					debouncedNotifyParent(val);
				}}
				disabled={disabled}
			/>
			<div className="absolute top-9 right-2">
				<DropdownChevron />
			</div>
			{errorMessage && (
				<p className="mt-2 text-sm text-red-500">{errorMessage}</p>
			)}
			<ul
				className={twMerge(
					"max-h-[300px] overflow-y-scroll absolute top-16 p-2 bg-white border border-gray-300 rounded-lg w-full mt-1 z-10 shadow-lg",
					isOpen ? "block" : "hidden",
				)}
			>
				{isLoading ? (
					<li className="px-2 py-1 text-gray-500 text-sm">Loading...</li>
				) : dropdownItems.length === 0 ? (
					<li className="px-2 py-1 text-gray-500 text-sm">No results found</li>
				) : (
					dropdownItems.map((item) => {
						return (
							<li
								key={item.value}
								onClick={() => {
									handleSelectItem(item);
								}}
								className="hover:cursor-pointer hover:bg-[#224083] hover:text-white rounded-sm px-2"
							>
								{item.label}
							</li>
						);
					})
				)}
			</ul>
		</div>
	);
};
