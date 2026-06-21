import { Facebook, Globe, Linkedin, X } from "lucide-react";
import type { ScheduleByIdResponseType } from "~/api/schema/schedule";
import { cn, onAvatarError, parseSpeakerImage } from "~/lib/utils";

export interface SpeakerModalProps {
	isOpen: boolean;
	onClose: () => void;
	scheduleDetail: ScheduleByIdResponseType | null;
}

function formatDuration(start: string, end: string) {
	const startTime = new Date(start);
	const endTime = new Date(end);
	const minutes = Math.round(
		(endTime.getTime() - startTime.getTime()) / (1000 * 60),
	);
	return `${minutes} mins`;
}

function getLanguageLabel(
	language: ScheduleByIdResponseType["presentation_language"],
) {
	if (language === "English") return "EN";
	if (language === "Bahasa Indonesia") return "ID";
	return language;
}

function SocialLink({
	href,
	icon,
	label,
}: {
	href: string;
	icon: React.ReactNode;
	label: string;
}) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={label}
			className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-schedule-heading-light/10 hover:bg-schedule-heading-light/20 transition-colors"
		>
			{icon}
		</a>
	);
}

function SpeakerDetailBlock({
	speaker,
}: {
	speaker: ScheduleByIdResponseType["speakers"][number];
}) {
	const first_name = speaker.user.first_name;
	const last_name = speaker.user.last_name;
	const company = speaker.user.company;
	const job_title = speaker.user.job_title;
	const bio = speaker.user.bio;

	const iconClass = "w-4 h-4 md:w-5 md:h-5 text-schedule-heading-light";

	const socials = [
		{
			href: speaker.user.website || "",
			icon: <Globe className={iconClass} />,
			label: "Website",
			value: speaker.user.website,
		},
		{
			href: `https://www.facebook.com/${speaker.user.facebook_username}`,
			icon: <Facebook className={iconClass} />,
			label: "Facebook",
			value: speaker.user.facebook_username,
		},
		{
			href: `https://www.linkedin.com/in/${speaker.user.linkedin_username}`,
			icon: <Linkedin className={iconClass} />,
			label: "LinkedIn",
			value: speaker.user.linkedin_username,
		},
		{
			href: `https://www.instagram.com/${speaker.user.instagram_username}`,
			icon: (
				<img
					src="/svg/ig.svg"
					alt="Instagram"
					className="w-4 h-4 md:w-5 md:h-5"
				/>
			),
			label: "Instagram",
			value: speaker.user.instagram_username,
		},
		{
			href: `mailto:${speaker.user.email}`,
			icon: (
				<img
					src="/svg/mail.svg"
					alt="Email"
					className="w-4 h-4 md:w-5 md:h-5"
				/>
			),
			label: "Email",
			value: speaker.user.email,
		},
		{
			href: `https://x.com/${speaker.user.twitter_username}`,
			icon: <img src="/svg/x.svg" alt="X" className="w-4 h-4 md:w-5 md:h-5" />,
			label: "X",
			value: speaker.user.twitter_username,
		},
	].filter((item) => item.value);

	return (
		<div className="flex flex-col md:flex-row gap-4 md:gap-6">
			<div className="shrink-0 mx-auto md:mx-0">
				<div className="size-30 overflow-hidden bg-schedule-heading-light/10">
					<img
						src={parseSpeakerImage({ id: speaker.id })}
						alt={`${first_name} ${last_name}`}
						onError={onAvatarError}
						className="object-cover w-full h-full"
					/>
				</div>
			</div>

			<div className="flex-1 min-w-0 space-y-4">
				<div>
					<p className="text-schedule-heading-light font-bold text-sm md:text-base uppercase">
						{`${first_name} ${last_name}`}
					</p>
					<p className="text-schedule-heading-light text-sm md:text-base">
						{job_title && company
							? `${job_title} @ ${company}`
							: job_title || company}
					</p>
				</div>

				{bio && (
					<div>
						<p className="text-schedule-muted-text font-bold text-sm mb-1">
							Bio
						</p>
						<p className="text-schedule-heading-light text-sm leading-relaxed">
							{bio}
						</p>
					</div>
				)}

				{socials.length > 0 && (
					<div>
						<p className="text-schedule-muted-text font-bold text-sm mb-2">
							Social Media
						</p>
						<div className="flex gap-2">
							{socials.map((social) => (
								<SocialLink
									key={social.label}
									href={social.href}
									icon={social.icon}
									label={social.label}
								/>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export const SpeakerModal = ({
	isOpen,
	onClose,
	scheduleDetail,
}: SpeakerModalProps) => {
	if (!isOpen || !scheduleDetail) return null;

	const duration = formatDuration(scheduleDetail.start, scheduleDetail.end);
	const speakers = scheduleDetail.speakers;

	return (
		<div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-0 md:p-6">
			<button
				type="button"
				className="absolute inset-0 bg-black/30 backdrop-blur-md"
				onClick={onClose}
				aria-label="Close modal"
			/>

			<div
				className={cn(
					"relative z-10 w-[calc(100%-3rem)] md:w-full md:max-w-2xl lg:max-w-3xl max-h-[90dvh] overflow-y-auto mx-auto",
					"bg-schedule-surface text-schedule-heading-light",
					"p-6 md:p-12",
				)}
			>
				<img
					src="/svg/hero-accent.svg"
					alt=""
					className="absolute -top-13 -left-8 w-20 md:w-28 opacity-50 pointer-events-none"
				/>

				<div className="flex justify-end mb-4">
					<button
						type="button"
						onClick={onClose}
						className="p-2 hover:bg-white/10 transition-colors cursor-pointer"
						aria-label="Close modal"
					>
						<X className="w-6 h-6 text-schedule-heading-light" />
					</button>
				</div>

				<div className="flex items-center justify-between gap-4 mb-3">
					<div className="flex items-center gap-1 text-schedule-muted-text">
						<img
							alt="Chevron right icon"
							src="/svg/chevron-right.svg"
							className="size-4.5 shrink-0"
						/>
						<span className="text-sm font-bold">
							{scheduleDetail.schedule_type.name}
						</span>
					</div>

					{scheduleDetail.presentation_language && (
						<div className="flex items-center gap-1 bg-schedule-time-pill-bg px-2 py-1 text-schedule-muted-text">
							<Globe className="w-[18px] h-[18px]" />
							<span className="text-sm font-bold">
								{getLanguageLabel(scheduleDetail.presentation_language)}
							</span>
						</div>
					)}
				</div>

				<h2 className="text-schedule-heading-light font-display text-xl md:text-2xl font-bold mb-4">
					{scheduleDetail.title}
				</h2>

				<div className="flex flex-wrap items-center gap-2 text-sm text-schedule-muted-text mb-6">
					<div className="flex items-center gap-1">
						<span className="font-normal">Duration:</span>
						<span className="font-bold">{duration}</span>
					</div>
					<span className="w-1 h-1 bg-schedule-separator-dot" />
					<div className="flex items-center gap-1">
						<span className="font-normal">Location:</span>
						<span className="font-bold">{scheduleDetail.room.name}</span>
					</div>
				</div>

				{scheduleDetail.description && (
					<div className="mb-6">
						<h3 className="text-schedule-muted-text font-bold text-base mb-1">
							About the Session
						</h3>
						<p className="text-schedule-heading-light text-sm md:text-base leading-relaxed">
							{scheduleDetail.description}
						</p>
					</div>
				)}

				<div className="h-px bg-schedule-card-border/50 mb-6" />

				{speakers.length > 0 && (
					<div className="space-y-6">
						<h3 className="text-schedule-muted-text font-bold text-base">
							About the Speaker{speakers.length > 1 ? "s" : ""}
						</h3>
						{speakers.map((speaker) => (
							<SpeakerDetailBlock key={speaker.id} speaker={speaker} />
						))}
					</div>
				)}

				<div className="mt-8">
					<a
						href={`/schedule/${scheduleDetail.id}`}
						className="block w-full text-center bg-schedule-card-bg text-schedule-surface font-bold text-sm md:text-base uppercase px-6 py-3 hover:bg-white transition-colors"
					>
						Watch now
					</a>
				</div>
			</div>
		</div>
	);
};
