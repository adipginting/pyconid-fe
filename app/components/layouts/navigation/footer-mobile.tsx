import { NavLink } from "react-router";
import MENU from "~/lib/menu";
import { cn } from "~/lib/utils";

export const FooterMobile = ({ path }: { path: string }) => {
	return (
		<ul className="flex bg-black gap-x-2 items-center justify-center bottom-5 fixed z-50 px-2 w-full lg:hidden">
			{MENU.map((menu) => {
				return (
					<li key={menu.name}>
						<NavLink
							to={menu.href}
							className={cn(
								"block font-sans text-base text-center ",
								path === menu.href ? "text-white" : "text-white/50",
							)}
						>
							{menu.name}
						</NavLink>
					</li>
				);
			})}
		</ul>
	);
};
