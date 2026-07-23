import { useMemo, useState } from "react";
import type { OrganizerPublicType } from "~/api/schema/organizer";
import type { VolunteerPublicType } from "~/api/schema/volunteer";
import {
	OurTeamCard,
	type OurTeamCardProps,
} from "~/components/shared/card/our-team";
import {
	SpeakerCard,
	type SpeakerCardProps,
} from "~/components/shared/card/speaker";
import { Hero } from "~/components/shared/hero/hero";
import { cn, parseOrganizerImage, parseVolunteerImage } from "~/lib/utils";
import { OrganizerModal } from "./organizer-modal";

interface OrganizersSectionProps {
	organizers: OrganizerPublicType[];
	volunteers: VolunteerPublicType[];
}

// Helper function to get full name
const getFullName = (organizer: OrganizerPublicType | VolunteerPublicType) => {
	if (!organizer?.user) return "Unknown Organizer";
	const firstName = organizer.user.first_name || "";
	const lastName = organizer.user.last_name || "";
	return `${firstName} ${lastName}`.trim() || "Unknown Speaker";
};

export const OrganizersSection = ({
	organizers,
	volunteers,
}: OrganizersSectionProps) => {
	const [selectedPerson, setSelectedPerson] = useState<
		OrganizerPublicType | VolunteerPublicType | null
	>(null);

	const parsedOrganizers = useMemo(() => {
		const lead: (SpeakerCardProps & { id: string })[] = [];
		const program: (OurTeamCardProps & { id: string })[] = [];
		const website: (OurTeamCardProps & { id: string })[] = [];
		const coordinator: (OurTeamCardProps & { id: string })[] = [];
		const experience: (OurTeamCardProps & { id: string })[] = [];
		const logistic: (OurTeamCardProps & { id: string })[] = [];
		const creative: (OurTeamCardProps & { id: string })[] = [];
		const volunteer: (OurTeamCardProps & { id: string })[] = [];

		if (organizers?.length) {
			organizers.forEach((organizer) => {
				const organizerType = organizer.organizer_type?.name?.toLowerCase();
				const name = getFullName(organizer);
				const profilePicture = parseOrganizerImage({ id: organizer.id });
				const email = organizer?.user?.email || undefined;

				if (organizerType?.includes("lead")) {
					lead.push({
						id: organizer.id,
						name,
						description: organizer.organizer_type?.name || "",
						company: "",
						image: profilePicture,
						twitter:
							(organizer?.user?.twitter_username &&
								`https://twitter.com/${organizer?.user?.twitter_username}`) ||
							undefined,
						instagram:
							(organizer?.user?.instagram_username &&
								`https://www.instagram.com/${organizer?.user?.instagram_username}`) ||
							undefined,
						linkedin:
							(organizer?.user?.linkedin_username &&
								`https://www.linkedin.com/in/${organizer?.user?.linkedin_username}`) ||
							undefined,
						email,
					});
					return;
				}

				const ourTeamItem: OurTeamCardProps & { id: string } = {
					id: organizer.id,
					name,
					jobTitle: organizer.organizer_type?.name || "",
					profile_picture: profilePicture,
					twitter_username:
						(organizer?.user?.twitter_username &&
							`https://twitter.com/${organizer?.user?.twitter_username}`) ||
						undefined,
					instagram_username:
						(organizer?.user?.instagram_username &&
							`https://www.instagram.com/${organizer?.user?.instagram_username}`) ||
						undefined,
					linkedin_username:
						(organizer?.user?.linkedin_username &&
							`https://www.linkedin.com/in/${organizer?.user?.linkedin_username}`) ||
						undefined,
					email,
				};

				if (organizerType?.includes("program")) {
					program.push(ourTeamItem);
				} else if (organizerType?.includes("website")) {
					website.push(ourTeamItem);
				} else if (organizerType?.includes("coordinator")) {
					coordinator.push(ourTeamItem);
				} else if (organizerType?.includes("experience")) {
					experience.push(ourTeamItem);
				} else if (organizerType?.includes("logistic")) {
					logistic.push(ourTeamItem);
				} else if (organizerType?.includes("creative")) {
					creative.push(ourTeamItem);
				}
			});
		}

		if (volunteers?.length) {
			volunteers.forEach((volunteerItem) => {
				const parsedItem: OurTeamCardProps & { id: string } = {
					id: volunteerItem.id,
					name: getFullName(volunteerItem),
					email: volunteerItem?.user?.email || undefined,
					profile_picture:
						volunteerItem.user.profile_picture ||
						parseVolunteerImage({ id: volunteerItem.id }),
					twitter_username:
						(volunteerItem?.user?.twitter_username &&
							`https://twitter.com/${volunteerItem?.user?.twitter_username}`) ||
						undefined,
					instagram_username:
						(volunteerItem?.user?.instagram_username &&
							`https://www.instagram.com/${volunteerItem?.user?.instagram_username}`) ||
						undefined,
					facebook_username:
						(volunteerItem?.user?.facebook_username &&
							`https://www.facebook.com/${volunteerItem?.user?.facebook_username}`) ||
						undefined,
					linkedin_username:
						(volunteerItem?.user?.linkedin_username &&
							`https://www.linkedin.com/in/${volunteerItem?.user?.linkedin_username}`) ||
						undefined,
					website: volunteerItem?.user?.website || undefined,
				};
				volunteer.push(parsedItem);
			});
		}

		return [
			{ name: "Lead Organizers", items: lead },
			{ name: "Programs", items: program },
			{ name: "Website", items: website },
			{ name: "Participant Experience", items: experience },
			{ name: "Logistic", items: logistic },
			{ name: "Creative", items: creative },
			{ name: "Volunteer", items: volunteer },
		];
	}, [organizers, organizers.length, volunteers, volunteers.length]);

	return (
		<section className="bg-[#F1F1F1] relative w-full overflow-x-hidden pb-20">
			<Hero text="Organizers" />

			<div className="py-20">
				{parsedOrganizers.map((group) => {
					const isLeadOrganizer = group.name === "Lead Organizers";
					const isVolunteer = group.name === "Volunteer";
					return (
						<div
							key={group.name}
							className="container mx-auto px-6 lg:px-12 relative mb-24"
						>
							<div className="mb-16 relative w-max mx-auto z-10 text-center">
								{/* Title accent - left */}
								<div
									className={cn(
										"absolute -left-16 md:-left-24 -translate-y-1/2 pointer-events-none opacity-70",
										isLeadOrganizer ? "-bottom-20" : "top-1",
									)}
								>
									<img
										src="/svg/square-decoration-bw-alt.svg"
										alt=""
										width={80}
										className="rotate-[-135deg]"
									/>
								</div>
								{/* Title accent - right */}
								<div
									className={cn(
										"absolute -right-16 md:-right-24 -translate-y-1/2 pointer-events-none opacity-70",
										isLeadOrganizer ? "top-1" : "-bottom-20",
									)}
								>
									<img
										src="/svg/square-decoration-bw-alt.svg"
										alt=""
										width={80}
										className="rotate-[-135deg]"
									/>
								</div>

								<h2 className="font-display relative text-3xl md:text-4xl lg:text-[4rem] font-bold text-foreground uppercase">
									{group.name}
								</h2>
							</div>

							<div
								className={cn(
									"grid gap-8 justify-items-center place-items-center sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto",
									group.items.length === 1 &&
										"sm:grid-cols-1 lg:grid-cols-1 max-w-xl",
									group.items.length === 2 &&
										"sm:grid-cols-2 lg:grid-cols-2 max-w-4xl",
								)}
							>
								{group.items.length > 0 ? (
									group.items.map(({ id, ...rest }) => {
										const handleOrganizerClick = (
											items: OrganizerPublicType[] | VolunteerPublicType[],
										) => {
											const org = items.find((o) => o.id === id);
											if (org) setSelectedPerson(org);
										};

										if (!isLeadOrganizer) {
											return (
												<OurTeamCard
													key={id}
													{...(rest as OurTeamCardProps)}
													onClick={() => {
														handleOrganizerClick(
															isVolunteer ? volunteers : organizers,
														);
													}}
												/>
											);
										}

										return (
											<SpeakerCard
												key={id}
												{...(rest as SpeakerCardProps)}
												onClick={() => handleOrganizerClick(organizers)}
											/>
										);
									})
								) : (
									<div className="col-span-full text-center text-gray-500 py-8 h-[300px] flex items-center justify-center">
										No {group.name} available
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>

			<OrganizerModal
				isOpen={!!selectedPerson}
				onClose={() => setSelectedPerson(null)}
				organizer={selectedPerson}
			/>
		</section>
	);
};
