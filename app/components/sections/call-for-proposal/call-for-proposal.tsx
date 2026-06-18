import { Calendar, MapPinned } from "lucide-react";
import { type FC, useState } from "react";
import acceptedSessions from "../../../data/accepted-talks-2026";

export const CallForProposalSection: FC = () => {
	const [sessions] = useState(
		acceptedSessions as Array<{
			talkType: string;
			speakers: string;
			title: string;
		}>,
	);

	return (
		<section className="bg-white">
			<div className="z-10 relative container m-auto">
				<div className="pt-[12vh] sm:pt-[23vh]">
					<div className="flex flex-col items-center justify-center">
						<div className="px-8 py-4 text-base lg:text-3xl pt-2 pr-4 pb-2 pl-4 font-extrabold">
							Call for Proposal
						</div>
						<div className="text-center text-[40px] lg:text-5xl mt-[0.4vh] font-bold font-weight-700 p-2">
							<p>
								<span className="text-black">Let's talk at PyCon ID 2026</span>
							</p>
						</div>
						<div className="mt-[2vh]">
							<div className="flex flex-row gap-x-10 font-sans p-2">
								<div className="text-black font-bold flex flex-row gap-2 items-center">
									<Calendar />
									August 8th-9th, 2026
								</div>
								<div className="text-black font-bold flex flex-row gap-2 items-center">
									<MapPinned />
									Jakarta, Indonesia
								</div>
							</div>
						</div>

						<p className="mt-[1vh]">
							<span className="text-black font-bold">Proposal Deadline:</span>{" "}
							<span className="font-semibold text-black ">June 6th, 2026</span>
						</p>

						<button
							className="cursor-pointer bg-black hover:bg-blue/50 text-white px-8 py-4 text-lg lg:text-2xl pt-2 pr-4 pb-2 pl-4 mt-[3vh] font-bold"
							type="button"
						>
							Submission Closed
						</button>

						<div className="mt-[5vh] m-2 grid grid-cols-1 lg:grid-cols-3 gap-5 mb-[5vh]">
							<div className="border border-black backdrop-blur-xl p-4 flex flex-col">
								<p className="border-b border-black font-bold text-black">
									Conference Format:
								</p>
								<p className="font-sans font-normal text-black mt-2">
									We will have two talk formats for PyCon ID 2026. First is a
									30-minutes Regular Talk session where you can talk about
									library, method, or other deep topic of python. Second is a
									15-minutes Short Talk session for those who are a first timer
									or just want to talk about lighter topic about python.
								</p>
							</div>
							<div className="border border-black backdrop-blur-xl p-4 flex flex-col">
								<p className="border-b border-black font-bold text-black">
									Topics
								</p>
								<p className="font-sans font-normal text-black mt-2">
									You can talk about anything, as long as it involves python in
									it. We are accepting a lot of topics such as web development,
									artificial intelligence, data engineering, computer vision,
									dev ops, and even topic about cool libraries
								</p>
							</div>
							<div className="border border-black backdrop-blur-xl p-4 flex flex-col">
								<p className="border-b border-black font-bold text-black">
									Your Submission:
								</p>
								<p className="font-sans font-normal text-black mt-2">
									Please submit the proposal to our Sessionize page. Submission
									are reviewed on a rolling basis so please check your
									submission regularly. Submission closed at June 6th, 2026.
								</p>
							</div>
						</div>

						<div className="w-full px-4 mb-16">
							<h3 className="text-2xl font-bold mb-4">Accepted Sessions</h3>
							<div className="overflow-x-auto">
								<table className="min-w-full table-auto border-collapse">
									<thead>
										<tr>
											<th className="text-left border-b px-3 py-2">
												Talk Type
											</th>
											<th className="text-left border-b px-3 py-2">
												Speaker(s)
											</th>
											<th className="text-left border-b px-3 py-2">Title</th>
										</tr>
									</thead>
									<tbody>
										{sessions.length === 0 ? (
											<tr>
												<td
													colSpan={3}
													className="px-3 py-4 text-sm text-gray-600"
												>
													Loading accepted sessions…
												</td>
											</tr>
										) : (
											sessions.map((s, i) => {
												const key = encodeURIComponent(
													`${s.talkType}||${s.speakers}||${s.title}`,
												);
												return (
													<tr
														key={key}
														className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
													>
														<td className="px-3 py-2 align-top">
															{s.talkType}
														</td>
														<td className="px-3 py-2 align-top">
															{s.speakers}
														</td>
														<td className="px-3 py-2 align-top">{s.title}</td>
													</tr>
												);
											})
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
