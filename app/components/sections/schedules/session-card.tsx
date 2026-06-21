import { ChevronRight, Globe } from "lucide-react";
import type { ScheduleItemType } from "~/api/schema/schedule";
import { cn, onAvatarError, parseSpeakerImage } from "~/lib/utils";

interface SessionCardProps {
	onClick: () => void;
	data: ScheduleItemType;
	className?: string;
}

function SpeakerRow({
	speaker,
}: {
	speaker: ScheduleItemType["speakers"][number];
}) {
	const name = `${speaker.user.first_name} ${speaker.user.last_name}`;

	return (
		<div className="flex items-center gap-2">
			<div className="w-[26px] h-[26px] overflow-hidden shrink-0">
				<img
					src={parseSpeakerImage({ id: speaker.id })}
					alt={name}
					onError={onAvatarError}
					className="object-cover w-full h-full"
				/>
			</div>
			<div className="border border-schedule-heading-dark  px-2 py-1">
				<span className="text-schedule-heading-dark text-sm font-bold uppercase">
					{name}
				</span>
			</div>
		</div>
	);
}

function getLanguageLabel(language: ScheduleItemType["presentation_language"]) {
	if (language === "English") return "EN";
	if (language === "Bahasa Indonesia") return "ID";
	return language;
}

function formatDuration(start: string, end: string) {
	const startTime = new Date(start);
	const endTime = new Date(end);
	const minutes = Math.round(
		(endTime.getTime() - startTime.getTime()) / (1000 * 60),
	);
	return `${minutes} mins`;
}

export const SessionCard = ({ onClick, data, className }: SessionCardProps) => {
	const duration = formatDuration(data.start, data.end);

	return (
		<button
			onClick={onClick}
			type="button"
			className={cn(
				"w-full text-start bg-schedule-card-bg border border-schedule-card-border -2xl p-5 flex flex-col gap-3 cursor-pointer transition-shadow hover:shadow-md",
				className,
			)}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-center gap-1 text-schedule-muted-text">
					<img
						alt="Chevron right icon"
						src="/svg/chevron-right.svg"
						className="size-4.5 shrink-0"
					/>
					<span className="text-sm font-bold">{data.schedule_type.name}</span>
				</div>

				{data.presentation_language && (
					<div className="flex items-center gap-1 bg-schedule-time-pill-bg px-2 py-1 text-schedule-muted-text shrink-0">
						<Globe className="w-[18px] h-[18px]" />
						<span className="text-sm font-bold">
							{getLanguageLabel(data.presentation_language)}
						</span>
					</div>
				)}
			</div>

			<h3 className="text-schedule-heading-dark font-bold text-lg leading-snug">
				{data.title}
			</h3>

			{data.speakers.length > 0 && (
				<div className="flex flex-col gap-2">
					{data.speakers.map((speaker) => (
						<SpeakerRow key={speaker.id} speaker={speaker} />
					))}
				</div>
			)}

			<div className="flex items-center gap-2">
				<div className="h-px flex-1 bg-schedule-card-border" />
				<ChevronRight className="w-4 h-4 text-schedule-card-border shrink-0" />
			</div>
			<div className="flex items-center gap-2 text-sm text-schedule-muted-text">
				<div className="flex items-center gap-1">
					<span className="font-normal">Duration:</span>
					<span className="font-bold">{duration}</span>
				</div>

				<span className="w-1 h-1 bg-schedule-separator-dot" />

				<div className="flex items-center gap-1">
					<span className="font-normal">Location:</span>
					<span className="font-bold">{data.room.name}</span>
				</div>
			</div>
		</button>
	);
};
