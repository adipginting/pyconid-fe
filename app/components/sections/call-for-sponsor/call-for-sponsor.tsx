import { Calendar, MapPinned } from "lucide-react";
import type { FC } from "react";

export const CallForSponsorSection: FC = () => (
	<section className="bg-white">
		<div className="">
			<div className="z-10 relative container m-auto">
				<div className="pt-[12vh] sm:pt-[23vh]">
					<div className="flex flex-col items-center justify-center">
						<div className="font-extrabold px-8 py-4 text-base lg:text-3xl pt-2 pr-4 pb-2 pl-4">
							Be our Sponsor
						</div>
						<div className="text-center text-[40px] lg:text-5xl mt-[0.4vh] font-bold font-weight-700 p-2">
							<p>
								<span className="text-black">Let's Support PyCon ID 2026</span>
							</p>
							<div className="flex gap-x-1">
								<p className="text-black">We are open for Sponsorship</p>
							</div>
						</div>
						<div className="mt-[2vh]">
							<div className="flex flex-row gap-x-10 font-sans p-2">
								<div className="font-bold flex flex-row gap-2 items-center">
									<Calendar />
									8-9 August 2026
								</div>
								<div className="font-bold flex flex-row gap-2 items-center">
									<MapPinned />
									Jakarta, Indonesia
								</div>
							</div>
						</div>
						<a
							href="https://pycon.id/sponsor-us"
							target="_blank"
							rel="noreferrer"
						>
							<button
								className="cursor-pointer bg-black hover:bg-black/50 backdrop-blur-lg text-white px-8 py-4 text-lg lg:text-2xl pt-2 pr-4 pb-2 pl-4 mt-[3vh] font-bold outline-white/50 outline-offset-1 shadow-white/20"
								type="button"
							>
								See Our Sponsorship Prospectus
							</button>
						</a>
						<div className="mt-[5vh] flex gap-x-5 flex-col gap-y-3 lg:flex-row items-center justify-center mx-2 text-justify px-10">
							<div className="border border-black rounded-lg backdrop-blur-xl p-2">
								<p className="border-b-1 border-black font-bold text-black text-lg">
									Engage with the Python Community
								</p>
								<p className="font-sans font-normal text-black my-5">
									Connect directly with developers, professionals, and
									decision-makers who use Python in diverse industries.
									Sponsoring PyCon ID 2026 gives your company the chance to
									showcase your brand, share your expertise, and engage with a
									vibrant tech community.
								</p>
							</div>
							<div className="border border-black  rounded-lg backdrop-blur-xl p-2">
								<p className="border-b-1 border-black font-bold text-black text-lg">
									Amplify Your Brand Visibility
								</p>
								<p className="font-sans font-normal text-black my-5">
									As a sponsor, your brand will be highlighted before, during,
									and after the conference—across our website, social media, and
									event materials. With hundreds of attendees from Indonesia and
									beyond, PyCon ID 2026 offers powerful exposure to a wide and
									engaged audience.
								</p>
							</div>
							<div className="border border-black  rounded-lg backdrop-blur-xl p-2">
								<p className="border-b-1 border-black font-bold text-black text-lg">
									Support Open Source & Innovation
								</p>
								<p className="font-sans font-normal text-black my-5">
									By sponsoring, you help sustain Python and its ecosystem in
									Indonesia. Your contribution supports knowledge sharing,
									community growth, and opportunities for students and
									professionals to learn, collaborate, and build the future of
									technology together.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
);
