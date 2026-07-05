import type { Route } from ".react-router/types/app/routes/+types/streaming";
import type MuxPlayerElement from "@mux/mux-player";
import MuxPlayer from "@mux/mux-player-react";
import { BadgeCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRevalidator } from "react-router";
import { httpClient } from "~/lib/http/$.client";
import { cn, parseSpeakerImage } from "~/lib/utils";

export const StreamingSection = ({
	componentProps,
}: {
	componentProps: Route.ComponentProps;
}) => {
	const { revalidate } = useRevalidator();
	const [talkExpansion, setTalkExpansion] = useState(true);
	const [speakerBioExpansion, setSpeakerBioExpansion] = useState(true);
	const [speakerImageSrc, setSpeakerImageSrc] = useState(
		"/images/default-avatar.webp",
	);

	const scheduleDetail = componentProps.loaderData.scheduleDetail;
	const scheduleStream = componentProps.loaderData.scheduleStream;
	const streamId = scheduleStream.stream_id;
	const primarySpeaker = scheduleDetail.speakers?.[0]?.speaker ?? null;

	const playerRef = useRef<MuxPlayerElement>(null);
	const heartbeatTimerRef = useRef<number | null>(null);
	const clientSessionIdRef = useRef<string | null>(null);
	const watchSessionIdRef = useRef<string | null>(null);
	const isStartingRef = useRef(false);

	const speakerBio = primarySpeaker?.user.bio ?? "";

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
	const toggleSpeakerBioExpansion = () =>
		setSpeakerBioExpansion((prev) => !prev);

	const doesSocialMediaExist =
		primarySpeaker?.user.instagram_username ||
		primarySpeaker?.user.facebook_username ||
		primarySpeaker?.user.email;

	const first_name = primarySpeaker?.user.first_name;
	const last_name = primarySpeaker?.user.last_name;

	useEffect(() => {
		if (primarySpeaker?.id) {
			const imageUrl = parseSpeakerImage({ id: primarySpeaker.id });
			const img = new Image();

			img.onload = () => {
				setSpeakerImageSrc(imageUrl);
			};

			img.onerror = () => {
				console.log("Failed to load speaker image, using default avatar");
				setSpeakerImageSrc("/images/default-avatar.webp");
			};

			img.src = imageUrl;
		}
	}, [primarySpeaker?.id]);

	return (
		<section className="bg-[#F1F1F1] p-5">
			<div className="z-10 relative container m-auto">
				<div className="pt-[12vh]">
					<div className="flex flex-col p-2 gap-y-3">
						<div className="rounded-2xl overflow-hidden">
							<MuxPlayer
								ref={playerRef}
								className="w-full aspect-video bg-black"
								playbackId={scheduleStream.playback.id}
								streamType={
									scheduleStream.status === "STREAMING" ? "live" : "on-demand"
								}
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
						</div>
						<div className="flex justify-between items-center">
							<p className="font-display text-lg md:text-2xl font-bold">
								{scheduleDetail.title}
							</p>
							<p className="font-sans text-sm font-light">
								{scheduleDetail.room.name}
							</p>
						</div>
						<div className="flex flex-col rounded-md shadow-[6px_6px_12px_rgba(0,0,0,0.2)] p-3">
							<div className="flex items-center justify-between">
								{primarySpeaker?.user ? (
									<div className="flex items-center gap-x-5">
										<img
											src={speakerImageSrc}
											alt={`${first_name} ${last_name}`}
											className="w-10 h-10 rounded-full"
										/>
										<div className="flex flex-col">
											<div className="flex items-center gap-x-1">
												<p className="font-sans font-bold">
													{`${first_name} ${last_name}`}{" "}
													<span className="inline-block align-middle">
														<BadgeCheck fill="blue" color="white" />
													</span>
												</p>
											</div>
											{primarySpeaker?.user.job_title && (
												<p>
													{primarySpeaker?.user.job_title} at{" "}
													{primarySpeaker?.user.company}
												</p>
											)}
										</div>
									</div>
								) : (
									<div></div>
								)}

								<div className="font-sans font-semibold bg-[#93B2F5] rounded-sm p-2">
									{scheduleDetail.schedule_type.name}
								</div>
							</div>
							<div className="flex flex-col p-6">
								<p className="font-display font-semibold text-lg md:text-2xl text-[#224083]">
									{scheduleDetail.title}
								</p>
								{scheduleDetail.description ? (
									<div>
										<p
											className={cn(
												"font-sans text-sm md:text-base leading-loose",
												scheduleDetail.description.length > 100 && talkExpansion
													? "line-clamp-2"
													: "",
											)}
										>
											{scheduleDetail.description}
										</p>
										{scheduleDetail.description.length > 100 && (
											<div className="flex flex-col items-start">
												<button
													type="button"
													onClick={toggleTalkExpansion}
													className="text-base font-semibold text-blue-900"
												>
													{scheduleDetail.description.length > 100 &&
													talkExpansion
														? "...show more"
														: "show less..."}
												</button>
												<p className="mt-5">
													{!talkExpansion && scheduleDetail.slide_link ? (
														<a
															href={scheduleDetail.slide_link}
															className="text-base font-bold text-blue-900 underline"
														>
															Access presentation file
														</a>
													) : null}
												</p>
											</div>
										)}
									</div>
								) : null}
							</div>
						</div>
						{primarySpeaker?.user ? (
							<div className="flex md:flex-row md:gap-y-0 gap-y-5 flex-col gap-x-5 bg-[#F37F20] p-6 rounded-md">
								<img
									src={speakerImageSrc}
									alt={`${first_name} ${last_name} `}
									className="w-30 h-40 md:w-60 md:h-80 rounded-md object-cover"
								/>
								<div className="flex flex-col font-sans text-white">
									<p className="font-bold text-lg md:text-4xl">{`${primarySpeaker?.user.first_name} ${primarySpeaker?.user.last_name}`}</p>
									{primarySpeaker?.user.job_title ? (
										<p className="font-semibold text-base">
											{primarySpeaker?.user.job_title} at{" "}
											{primarySpeaker?.user.company}
										</p>
									) : null}

									{speakerBio ? (
										<div>
											<p className="font-semibold text-base md:text-xl mt-3">
												Bio
											</p>
											<div className="flex flex-col items-start gap-y-2">
												<p
													className={cn(
														"font-semibold text-sm md:text-base text-justify",
														speakerBio.length > 100 && speakerBioExpansion
															? "line-clamp-2"
															: "",
													)}
												>
													{speakerBio}
												</p>
												{speakerBio.length > 100 ? (
													<button
														type="button"
														onClick={toggleSpeakerBioExpansion}
													>
														{speakerBioExpansion
															? "...See more"
															: "See less... "}
													</button>
												) : null}
											</div>
										</div>
									) : null}

									{doesSocialMediaExist && (
										<div className="flex flex-col items-start gap-y-1">
											<p className="font-semibold text-xl mt-3">Social Media</p>
											<div className="flex items-center justify-center">
												{primarySpeaker?.user.instagram_username && (
													<a
														href={`https://instagram.com/${primarySpeaker?.user.instagram_username}`}
														target="_blank"
														rel="noreferrer noopener"
													>
														<img
															src="/svg/ig.svg"
															alt="IG"
															className="w-10 h-10"
														/>
													</a>
												)}
												{primarySpeaker?.user.email && (
													<a
														href={`mailto:${primarySpeaker?.user.email}`}
														target="_blank"
														rel="noreferrer noopener"
													>
														<img
															src="/svg/mail.svg"
															alt="Email"
															className="w-10 h-10"
														/>
													</a>
												)}
												{primarySpeaker?.user.twitter_username && (
													<a
														href={`https://x.com/${primarySpeaker?.user.twitter_username}`}
														target="_blank"
														rel="noreferrer noopener"
													>
														<img
															src="/svg/x.svg"
															alt="X formerly known as Twitter"
															className="w-10 h-10"
														/>
													</a>
												)}
											</div>
										</div>
									)}
								</div>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</section>
	);
};
