import { ScanLine, User } from "lucide-react";
import { NavLink } from "react-router";

type DashboardMenuProps = {
	showCheckIn?: boolean;
};

const tabClassName =
	"group relative flex items-center gap-3 pl-[11px] pr-4 w-[168px] h-8 text-sm font-bold transition-colors";
const clipPath = "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 0 100%)";

function TabContent({
	isActive,
	icon,
	label,
}: {
	isActive: boolean;
	icon: React.ReactNode;
	label: string;
}) {
	return (
		<>
			{isActive ? (
				<span className="absolute inset-0 bg-[#FAFAFA]" />
			) : (
				<>
					<span className="absolute inset-0 bg-white" style={{ clipPath }} />
					<span
						className="absolute inset-[1px] bg-[#282828]"
						style={{ clipPath }}
					/>
				</>
			)}
			<span
				className={`relative z-10 flex items-center gap-3 ${
					isActive ? "text-[#282828]" : "text-[#F1F2F3] group-hover:text-white"
				}`}
			>
				{icon}
				<span>{label}</span>
			</span>
		</>
	);
}

export const DashboardMenu = ({ showCheckIn = false }: DashboardMenuProps) => {
	return (
		<div className="flex items-center gap-4 px-6 lg:px-12 pt-6 absolute top-15 lg:top-20 left-0 right-0 z-20">
			<NavLink
				to="/auth/dashboard"
				end
				className={tabClassName}
				style={{ clipPath }}
			>
				{({ isActive }) => (
					<TabContent
						isActive={isActive}
						icon={<User className="w-5 h-5" />}
						label="My Profile"
					/>
				)}
			</NavLink>

			<NavLink to="/auth/payment" className={tabClassName} style={{ clipPath }}>
				{({ isActive }) => (
					<TabContent
						isActive={isActive}
						icon={
							<img
								src="/svg/user-profile/ticket-icon.svg"
								alt=""
								width="20"
								height="20"
							/>
						}
						label="My Ticket"
					/>
				)}
			</NavLink>

			{showCheckIn && (
				<NavLink
					to="/auth/check-in"
					className={tabClassName}
					style={{ clipPath }}
				>
					{({ isActive }) => (
						<TabContent
							isActive={isActive}
							icon={<ScanLine className="w-5 h-5" />}
							label="Check In"
						/>
					)}
				</NavLink>
			)}
		</div>
	);
};
