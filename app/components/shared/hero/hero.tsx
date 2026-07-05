import { cn } from "~/lib/utils";

type Props = {
	text: string;
	nav?: React.ReactNode;
	className?: string;
};

export const Hero = ({ text, nav, className }: Props) => {
	return (
		<section
			className={cn(
				"relative bg-surface overflow-hidden pt-32 pb-16 lg:pt-44 lg:pb-32",
				className,
			)}
		>
			{/* Decorative Ellipse */}
			<div className="absolute -right-25 top-[125px] w-[522px] h-[522px] rounded-full border-[75px] border-[#909090] opacity-20" />
			{nav ? <div>{nav}</div> : null}

			{/* Accent decorations */}
			<div className="absolute left-5 top-5 w-[100px]">
				<img
					src="/svg/hero-accent.svg"
					alt=""
					className="w-full h-auto"
					aria-hidden="true"
				/>
			</div>
			<div className="absolute left-[30%] top-[75%] w-[100px] hidden lg:block">
				<img
					src="/svg/hero-accent.svg"
					alt=""
					className="w-full h-auto"
					aria-hidden="true"
				/>
			</div>
			<div className="absolute right-[25%] top-8 w-[100px] hidden lg:block">
				<img
					src="/svg/hero-accent.svg"
					alt=""
					className="w-full h-auto"
					aria-hidden="true"
				/>
			</div>

			<div className="container mx-auto px-6 lg:px-12 relative z-10">
				<div className="flex justify-between items-start">
					<h1 className="text-[#F1F2F3] text-4xl md:text-5xl lg:text-[60px] font-bold font-sans tracking-tight max-w-[600px]">
						{text}
					</h1>
				</div>
			</div>
		</section>
	);
};
