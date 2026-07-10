import { SpeakerCard } from "~/components/shared/card/speaker";

export const SpeakersSection = () => {
	const speakers = [
		{
			name: "Pahlevi Fikri Auliya",
			description: "VP of Engineering",
			company: "Ruangguru",
			instagram: "https://www.instagram.com/levifikri/",
			twitter: "https://x.com/levifikri",
			linkedin: "https://www.linkedin.com/in/levifikri/",
			image: "/images/keynote-speakers/2026/PahleviFikri.webp",
		},
		{
			name: "Eko Kurniawan Khannedy",
			description: "Technical Architect at Blibli",
			company: "Content Creator at Programmer Zaman Now",
			instagram: "https://www.instagram.com/khannedy/",
			twitter: "https://x.com/khannedy",
			linkedin: "https://www.linkedin.com/in/khannedy/",
			image: "/images/keynote-speakers/2026/EkoKhannedy.webp",
		},
	];

	return (
		<section className="pt-9 sm:pt-36 relative ">
			<div className="container mx-auto relative">
				<div className="mb-20 relative w-max mx-auto z-10">
					<h1 className="relative text-center text-3xl md:text-4xl lg:text-[4rem] font-bold text-secondary">
						KEYNOTE <span className="text-foreground">SPEAKERS</span>
					</h1>
				</div>

				<div className="flex justify-center pb-4 px-5 2xl:px-0">
					<div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4 md:gap-x-6 lg:gap-x-8 gap-y-4">
						{speakers.map((speaker) => (
							<SpeakerCard key={speaker.name} {...speaker} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
