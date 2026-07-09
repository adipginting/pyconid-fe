import type MuxPlayerElement from "@mux/mux-player";
import MuxPlayer from "@mux/mux-player-react";
import { Facebook, Globe, Link2, Linkedin, Tag } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRevalidator } from "react-router";
import { httpClient } from "~/lib/http/$.client";
import { cn, parseSpeakerImage } from "~/lib/utils";
import type { Route } from "../../../routes/+types/streaming";

const SocialLink = ({
	href,
	children,
	label,
}: {
	href: string;
	children: ReactNode;
	label: string;
}) => (
	<a
		href={href}
		target="_blank"
		rel="noreferrer noopener"
		aria-label={label}
		className="inline-flex items-center justify-center"
	>
		{children}
	</a>
);

const SpeakerCard = ({ speakerItem }: { speakerItem: ScheduleSpeaker }) => {
	const { speaker } = speakerItem;
	const { user, id } = speaker;
	const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
	const role =
		user.job_title && user.company
			? `${user.job_title} @ ${user.company}`
			: (user.job_title ?? user.company ?? "");

	const socials = [
		{
			value: user.website,
			href: user.website || "",
			icon: <Globe className="w-5 h-5 text-[#282828]" />,
			label: "Website",
		},
		{
			value: user.facebook_username,
			href: `https://www.facebook.com/${user.facebook_username}`,
			icon: <Facebook className="w-5 h-5 text-[#282828]" />,
			label: "Facebook",
		},
		{
			value: user.linkedin_username,
			href: `https://www.linkedin.com/in/${user.linkedin_username}`,
			icon: <Linkedin className="w-5 h-5 text-[#282828]" />,
			label: "LinkedIn",
		},
		{
			value: user.instagram_username,
			href: `https://www.instagram.com/${user.instagram_username}`,
			icon: <img src="/svg/ig-dark.svg" alt="Instagram" className="w-5 h-5" />,
			label: "Instagram",
		},
		{
			value: user.email,
			href: `mailto:${user.email}`,
			icon: <img src="/svg/mail-dark.svg" alt="Email" className="w-5 h-5" />,
			label: "Email",
		},
		{
			value: user.twitter_username,
			href: `https://x.com/${user.twitter_username}`,
			icon: <img src="/svg/x-dark.svg" alt="X" className="w-5 h-5" />,
			label: "X",
		},
	].filter((item) => item.value);

	const [imageSrc, setImageSrc] = useState("/images/default-avatar.webp");

	useEffect(() => {
		if (!id) return;
		const url = parseSpeakerImage({ id });
		const img = new Image();
		img.onload = () => setImageSrc(url);
		img.onerror = () => setImageSrc("/images/default-avatar.webp");
		img.src = url;
	}, [id]);

	return (
		<div className="flex gap-4">
			<img
				src={imageSrc}
				alt={fullName}
				className="w-[120px] h-[120px] rounded-lg object-cover shrink-0"
			/>
			<div className="flex flex-col gap-2 min-w-0">
				<h3 className="font-sans font-bold text-sm text-[#282828] uppercase">
					{fullName}
				</h3>
				{role && <p className="text-sm text-[#282828]">{role}</p>}
				{user.bio && (
					<div>
						<h4 className="text-[#909090] font-sans font-bold text-sm">Bio</h4>
						<p className="text-sm text-[#282828] leading-relaxed">{user.bio}</p>
					</div>
				)}
				{socials.length > 0 && (
					<div>
						<h4 className="text-[#909090] font-sans font-bold text-sm">
							Social Media
						</h4>
						<div className="flex items-center gap-3">
							{socials.map((item) => (
								<SocialLink
									key={item.label}
									href={item.href}
									label={item.label}
								>
									{item.icon}
								</SocialLink>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

type ScheduleSpeaker =
	Route.ComponentProps["loaderData"]["scheduleDetail"]["speakers"][number];

export const StreamingSection = ({
	componentProps,
}: {
	componentProps: Route.ComponentProps;
}) => {
	const { revalidate } = useRevalidator();
	const [talkExpansion, setTalkExpansion] = useState(true);

	const scheduleDetail = componentProps.loaderData.scheduleDetail;
	const scheduleStream = componentProps.loaderData.scheduleStream;
	const streamId = scheduleStream.stream_id;

	const playerRef = useRef<MuxPlayerElement>(null);
	const heartbeatTimerRef = useRef<number | null>(null);
	const clientSessionIdRef = useRef<string | null>(null);
	const watchSessionIdRef = useRef<string | null>(null);
	const isStartingRef = useRef(false);

	const getCurrentPosition = useCallback(() => {
		return Number(playerRef.current?.currentTime ?? 0);
	}, []);

	const stopHeartbeat = useCallback(() => {
		if (heartbeatTimerRef.current) {
			window.clearInterval(heartbeatTimerRef.current);
			heartbeatTimerRef.current = null;
		}
	}, []);

	const sendHeartbeat = useCallback(async () => {
		if (!watchSessionIdRef.current || !clientSessionIdRef.current) return;

		try {
			await httpClient.post(`/streaming/${streamId}/watch/heartbeat`, {
				body: {
					watch_session_id: watchSessionIdRef.current,
					client_session_id: clientSessionIdRef.current,
					position_seconds: getCurrentPosition(),
				},
			});
		} catch (error) {
			console.error("Failed to send heartbeat", error);
		}
	}, [getCurrentPosition, streamId]);

	const heartbeatIntervalRef = useRef<number>(15);

	const startWatch = useCallback(async () => {
		if (isStartingRef.current || watchSessionIdRef.current) return;

		isStartingRef.current = true;

		if (!clientSessionIdRef.current) {
			const storageKey = `pyconid_client_session_${streamId}`;
			let sessionId = sessionStorage.getItem(storageKey);
			if (!sessionId) {
				sessionId = crypto.randomUUID();
				sessionStorage.setItem(storageKey, sessionId);
			}
			clientSessionIdRef.current = sessionId;
		}

		try {
			const response = await httpClient.post(
				`/streaming/${streamId}/watch/start`,
				{
					body: {
						client_session_id: clientSessionIdRef.current,
						position_seconds: getCurrentPosition(),
					},
				},
			);

			if (!response.status) return;

			const data = await response.json();
			watchSessionIdRef.current = data.watch_session_id;
			if (data.heartbeat_interval) {
				heartbeatIntervalRef.current = data.heartbeat_interval;
			}

			stopHeartbeat();
			heartbeatTimerRef.current = window.setInterval(
				sendHeartbeat,
				heartbeatIntervalRef.current * 1000,
			);
		} catch (error) {
			console.error("Failed to start watch session", error);
		} finally {
			isStartingRef.current = false;
		}
	}, [getCurrentPosition, sendHeartbeat, stopHeartbeat, streamId]);

	const pauseWatch = useCallback(async () => {
		await sendHeartbeat();
		stopHeartbeat();
	}, [sendHeartbeat, stopHeartbeat]);

	const endWatch = useCallback(async () => {
		stopHeartbeat();

		if (!watchSessionIdRef.current || !clientSessionIdRef.current) return;

		const watchSessionId = watchSessionIdRef.current;
		const clientSessionId = clientSessionIdRef.current;

		watchSessionIdRef.current = null;
		clientSessionIdRef.current = null;
		sessionStorage.removeItem(`pyconid_client_session_${streamId}`);

		try {
			await httpClient.post(`/streaming/${streamId}/watch/end`, {
				body: {
					watch_session_id: watchSessionId,
					client_session_id: clientSessionId,
					position_seconds: getCurrentPosition(),
				},
			});
			revalidate();
		} catch (error) {
			console.error("Failed to end watch session", error);
		}
	}, [getCurrentPosition, stopHeartbeat, streamId, revalidate]);

	const endWatchWithKeepalive = useCallback(() => {
		if (!watchSessionIdRef.current || !clientSessionIdRef.current) return;

		const watchSessionId = watchSessionIdRef.current;
		const clientSessionId = clientSessionIdRef.current;

		watchSessionIdRef.current = null;
		clientSessionIdRef.current = null;
		stopHeartbeat();

		httpClient
			.post(`/streaming/${streamId}/watch/end`, {
				body: {
					watch_session_id: watchSessionId,
					client_session_id: clientSessionId,
					position_seconds: getCurrentPosition(),
				},
				// @ts-ignore
				keepalive: true,
			})
			.catch(() => {});
	}, [getCurrentPosition, stopHeartbeat, streamId]);

	useEffect(() => {
		window.addEventListener("pagehide", endWatchWithKeepalive);
		return () => {
			window.removeEventListener("pagehide", endWatchWithKeepalive);
			void endWatch();
		};
	}, [endWatch, endWatchWithKeepalive]);

	const toggleTalkExpansion = () => setTalkExpansion((prev) => !prev);

	const isLive = scheduleStream.status === "STREAMING";

	const duration = useMemo(() => {
		const start = new Date(scheduleDetail.start);
		const end = new Date(scheduleDetail.end);
		const diffMinutes = Math.round(
			(end.getTime() - start.getTime()) / 1000 / 60,
		);
		return `${diffMinutes} mins`;
	}, [scheduleDetail.start, scheduleDetail.end]);

	const languageLabel = useMemo(() => {
		switch (scheduleDetail.presentation_language) {
			case "Bahasa Indonesia":
				return "ID";
			case "English":
				return "EN";
			default:
				return scheduleDetail.presentation_language ?? "-";
		}
	}, [scheduleDetail.presentation_language]);

	const description = scheduleDetail.description ?? "";
	const hasLongDescription = description.length > 180;

	return (
		<section className="bg-[#FAF9F7] min-h-screen pt-20">
			<div className="container mx-auto px-4 md:px-12 py-10 md:py-20 flex flex-col gap-10 md:gap-16">
				<div className="relative w-full h-[220px] md:h-[640px] bg-[#EAEAEA] rounded-lg overflow-hidden">
					<MuxPlayer
						ref={playerRef}
						className="w-full h-full bg-black"
						playbackId={scheduleStream.playback.id}
						streamType={isLive ? "live" : "on-demand"}
						tokens={
							scheduleStream.playback.token
								? {
										playback: scheduleStream.playback.token,
										thumbnail: scheduleStream.thumbnail?.token ?? undefined,
									}
								: undefined
						}
						metadata={{
							video_id: streamId,
							video_title: scheduleDetail.title,
							viewer_user_id: scheduleStream.metadata.user_id || undefined,
						}}
						onPlay={() => {
							void startWatch();
						}}
						onPause={() => {
							void pauseWatch();
						}}
						onEnded={() => {
							void endWatch();
						}}
					/>

					<div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6">
						<div className="flex items-start justify-between">
							<img
								src="/svg/logo/2026/logo_horizontal-white.svg"
								alt="PyCon ID 2026"
								className="h-6 md:h-8"
							/>
							{isLive && (
								<div className="flex items-center gap-1.5 md:gap-2 bg-[#ED2324] text-white px-2 py-1 md:px-2.5 md:py-1.5 rounded">
									<span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white" />
									<span className="font-sans font-bold text-[8px] md:text-xs tracking-[0.25em]">
										LIVE
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-wrap items-center gap-2 md:gap-3">
						<div className="inline-flex items-center gap-1.5 md:gap-2 text-[#909090] font-sans font-bold text-sm">
							<Tag className="w-4 h-4" />
							<span>{scheduleDetail.schedule_type.name}</span>
						</div>
						<div className="inline-flex items-center gap-1.5 md:gap-2 bg-[#F1F1F1] text-[#909090] font-sans font-bold text-sm px-2 py-1 rounded">
							<Globe className="w-4 h-4" />
							<span>{languageLabel}</span>
						</div>
					</div>

					<h1 className="font-sans font-bold text-xl md:text-2xl text-[#282828]">
						{scheduleDetail.title}
					</h1>

					<div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-[#909090]">
						<div className="flex items-center gap-1.5">
							<p>Duration:</p>
							<span className="font-sans font-bold pl-1">{duration}</span>
						</div>
						<span className="w-1 h-1 rounded-full bg-[#C4C4C4]" />
						<div className="flex items-center gap-1.5">
							<p>Location: </p>
							<span className="font-sans font-bold pl-1">
								{scheduleDetail.room.name}
							</span>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-4">
					<h2 className="text-[#909090] font-sans font-bold text-base">
						About the Session
					</h2>

					{description ? (
						<div className="flex flex-col gap-3">
							<p
								className={cn(
									"text-sm md:text-base text-[#282828] leading-relaxed",
									hasLongDescription && talkExpansion && "line-clamp-3",
								)}
							>
								{description}
							</p>
							{hasLongDescription && (
								<button
									type="button"
									onClick={toggleTalkExpansion}
									className="self-start font-sans font-bold text-sm text-[#282828]"
								>
									{talkExpansion ? "Show more" : "Show less"}
								</button>
							)}
						</div>
					) : null}

					{scheduleDetail.slide_link && (
						<a
							href={scheduleDetail.slide_link}
							target="_blank"
							rel="noreferrer noopener"
							className="inline-flex items-center gap-2.5 self-start bg-[#FAFAFA] text-[#282828] px-4 py-3 rounded font-sans font-bold text-sm"
						>
							<Link2 className="w-4 h-4" />
							Presentation File
						</a>
					)}
				</div>

				<hr className="border-[#909090]/30" />
				{scheduleDetail.speakers && scheduleDetail.speakers.length > 0 && (
					<div className="flex flex-col gap-6">
						<h2 className="text-[#909090] font-sans font-bold text-base">
							About the Speaker
							{scheduleDetail.speakers.length > 1 ? "s" : ""}
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
							{scheduleDetail.speakers.map((speakerItem) => (
								<SpeakerCard
									key={speakerItem.speaker.id}
									speakerItem={speakerItem}
								/>
							))}
						</div>
					</div>
				)}
			</div>
		</section>
	);
};
