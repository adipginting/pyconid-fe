import type { FC } from "react";
import { ErrorState } from "~/components/sections/error/error-state";

export const NotFoundSection: FC = () => {
	return (
		<ErrorState
			oopsSrc="/svg/error/oops.svg"
			illustrationSrc="/svg/error/404.svg"
			illustrationAlt="404 Not Found"
			heading="Ouups! You’ve found a 404 page"
			description="In case you keep encountering this issue or have any questions about our Pythonic adventures, feel free to contact our Python wranglers at pycon@python.or.id."
		/>
	);
};
