import type { FC } from "react";
import { Link } from "react-router";

type ErrorStateProps = {
	oopsSrc: string;
	illustrationSrc: string;
	illustrationAlt: string;
	heading: string;
	description: string;
};

export const ErrorState: FC<ErrorStateProps> = ({
	oopsSrc,
	illustrationSrc,
	illustrationAlt,
	heading,
	description,
}) => {
	return (
		<div className="flex flex-col items-center gap-8 lg:gap-10 text-center mt-10">
			<div className="flex flex-col items-center gap-5">
				<img src={oopsSrc} alt="Oops" className="h-12 md:h-16 lg:h-20 w-auto" />
				<img
					src={illustrationSrc}
					alt={illustrationAlt}
					className="h-32 md:h-44 lg:h-56 w-auto"
				/>
			</div>

			<div className="flex flex-col items-center gap-6 max-w-[748px]">
				<h1 className="font-sans font-bold text-[#282828] text-[32px] leading-tight tracking-[-0.005em] md:text-5xl lg:text-[60px] lg:leading-[1.25] whitespace-pre-line">
					{heading}
				</h1>

				<p className="font-sans text-lg lg:text-xl leading-[135%] tracking-[0.005em] text-[#333333] max-w-[673px]">
					{description}
				</p>

				<Link
					to="/"
					className="inline-flex items-center justify-center bg-[#282828] hover:bg-[#282828]/90 text-white font-sans font-bold text-lg lg:text-xl tracking-[0.0125em] px-[34px] py-4 rounded-xl transition-colors w-full max-w-[274px]"
				>
					Back to Home
				</Link>
			</div>
		</div>
	);
};
