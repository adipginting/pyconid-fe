import type { FC } from "react";
import { ErrorState } from "~/components/sections/error/error-state";

export const InternalErrorSection: FC = () => {
	return (
		<ErrorState
			oopsSrc="/svg/error/oops.svg"
			illustrationSrc="/svg/error/505.svg"
			illustrationAlt="505 Internal Server Error"
			heading="Oh Snakes! There’s an error!"
			description="In case you keep encountering this issue or have any questions about our Pythonic adventures, feel free to contact our Python wranglers at pycon@python.or.id."
		/>
	);
};
