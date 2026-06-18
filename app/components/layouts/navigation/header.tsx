import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Form, Link, NavLink } from "react-router";
import MENU from "~/lib/menu";
import { cn } from "~/lib/utils";
import { useRootLoaderData } from "~/root";

export const Header = () => {
	const [expand, setExpand] = useState(false);
	const { credentials } = useRootLoaderData();

	return (
		<header className="bg-surface text-white fixed inset-x-0 top-0 z-50 w-full">
			<div className="flex items-center justify-between container mx-auto py-5 px-6 lg:px-12">
				<div>
					<Link to="/">
						<img
							src="/svg/logo/2026/logo-white.svg"
							alt="PyconID 2026"
							className="h-8 lg:h-10"
						/>
					</Link>
				</div>
				<div
					className={cn(
						"absolute top-[72px] p-6 bg-surface w-full transition-all duration-300 border-t border-white/10",
						"lg:static lg:w-auto lg:p-0 lg:border-none lg:bg-transparent",
						expand ? "left-0" : "-left-[120%]",
					)}
				>
					<ul className="flex flex-col gap-6 font-sans lg:flex-row lg:gap-8 lg:items-center">
						{MENU.map((menu) => (
							<li key={menu.name}>
								<NavLink
									to={menu.href}
									className={({ isActive }) =>
										isActive
											? "text-white font-bold"
											: "text-gray-300 hover:text-white"
									}
								>
									{menu.name}
								</NavLink>
							</li>
						))}
						<li className="w-full lg:hidden pt-4 border-t border-white/10">
							{credentials ? (
								<div className="flex flex-col gap-4">
									<NavLink to="/auth/dashboard">My Profile</NavLink>
									<Form action="/auth/logout" method="post">
										<button
											type="submit"
											className="bg-white text-surface px-6 py-2 font-bold w-full"
										>
											Logout
										</button>
									</Form>
								</div>
							) : (
								<Link to="/login" className="block w-full">
									<button
										type="button"
										className="bg-white text-surface px-6 py-2 font-bold w-full"
									>
										Login
									</button>
								</Link>
							)}
						</li>
					</ul>
				</div>

				<div className="hidden lg:block">
					{credentials ? (
						<div className="flex gap-4 items-center">
							<NavLink
								to="/auth/dashboard"
								className="text-white hover:text-gray-200"
							>
								My Profile
							</NavLink>
							<Form action="/auth/logout" method="post">
								<button
									type="submit"
									className="bg-white text-surface text-sm px-6 py-2.5 font-bold cursor-pointer"
								>
									Logout
								</button>
							</Form>
						</div>
					) : (
						<Link to="/login">
							<button
								type="button"
								className="bg-white text-surface text-sm px-8 py-2 font-bold cursor-pointer"
							>
								Login
							</button>
						</Link>
					)}
				</div>

				<button
					type="button"
					className="lg:hidden text-white"
					onClick={() => setExpand((prev) => !prev)}
				>
					{expand ? <XIcon /> : <MenuIcon />}
				</button>
			</div>
		</header>
	);
};
