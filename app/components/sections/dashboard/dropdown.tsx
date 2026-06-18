// biome-ignore-all lint: Anoying
import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useClickOutside } from "~/hooks/use-click-outside";
import { useSyncedSelection } from "~/hooks/use-synced-selection";

const DropdownChevron = () => (
	<img
		src="/svg/user-profile/dropdown-chevron.svg"
		alt=""
		width="24"
		height="24"
	/>
);

export const Dropdown = ({
	label,
	id,
	name,
	placeholder,
	dropdownItems,
	value = null,
	onChange,
	errorMessage = undefined,
	className,
	disabled = false,
}: {
	label: string;
	id: string;
	name: string;
	placeholder: string;
	dropdownItems: { label: string; value: string }[];
	value?: string | null;
	onChange?: (value: string) => void;
	errorMessage?: string;
	className?: string;
	disabled?: boolean;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useSyncedSelection(
		value,
		dropdownItems,
	);

	const containerRef = useRef<HTMLDivElement>(null);

	useClickOutside(containerRef, () => setIsOpen(false));

	const handleSelectItem = (item: { label: string; value: string }) => {
		setSelectedItem(item);
		setIsOpen(false);
		onChange?.(item.value);
	};

	return (
		<div ref={containerRef} className={twMerge("w-full relative", className)}>
			<label htmlFor={id} className="block mb-2 text-xs text-[#282828]">
				{label}
			</label>
			<input
				id={id}
				name={name}
				type="hidden"
				placeholder={placeholder}
				value={selectedItem?.value || ""}
			/>
			<div
				className={twMerge(
					"w-full flex justify-between px-4 py-3 border bg-white text-sm",
					errorMessage ? "border-red-500" : "border-[#282828]",
					disabled ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer",
				)}
				onClick={() => {
					if (!disabled) setIsOpen(!isOpen);
				}}
			>
				<span
					className={twMerge(selectedItem ? "text-black" : "text-gray-500")}
				>
					{selectedItem ? selectedItem.label : placeholder}
				</span>
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
				{dropdownItems.map((item) => {
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
				})}
			</ul>
		</div>
	);
};
