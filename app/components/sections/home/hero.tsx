import type { FC } from "react";

export const HeroSection: FC = () => {
	return (
		<section className="min-h-svh pt-32 pb-20 flex flex-col justify-center container mx-auto px-6 lg:px-12">
			{/* Big Typography */}
			<div className="font-sans font-black text-foreground uppercase leading-[0.8] tracking-tighter mb-16 lg:mb-24">
				<img src="/svg/jakarta-2026.svg" alt="Jakarta 2026" />
				{/* <h1 className="text-[16vw] md:text-[180px] lg:text-[220px]">Jakarta</h1>
				<h1 className="text-[16vw] md:text-[180px] lg:text-[220px]">2026</h1> */}
			</div>

			{/* Description & Details Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-end">
				<div className="text-xl md:text-2xl text-gray-700 leading-relaxed font-sans max-w-xl">
					Python Conference Indonesia or PyCon ID is annual conference where
					Python enthusiasts share their knowledge with the others, especially
					in Indonesia regional.
				</div>

				<div className="flex flex-col gap-10 md:text-right font-sans">
					<div>
						<p className="text-sm font-bold tracking-[0.2em] text-gray-500 mb-2">
							LOCATION
						</p>
						<p className="text-2xl lg:text-3xl font-bold text-foreground">
							BINUS University, Anggrek Campus,
							<br />
							Jakarta
						</p>
					</div>
					<div>
						<p className="text-sm font-bold tracking-[0.2em] text-gray-500 mb-2">
							DATES
						</p>
						<p className="text-2xl lg:text-3xl font-bold text-foreground">
							August 8th-9th, 2026
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};
