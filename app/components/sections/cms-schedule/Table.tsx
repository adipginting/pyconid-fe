import { Form, Link, useNavigation } from "react-router";
import type { getScheduleCmsResultResponseType } from "~/api/schema/schedule";

function formatSpeakers(
	speakers: getScheduleCmsResultResponseType[number]["speakers"],
) {
	return (
		speakers
			?.slice()
			.sort((a, b) => a.order - b.order)
			.map(({ speaker, type }) => {
			const firstName = speaker.user.first_name ?? "";
			const lastName = speaker.user.last_name ?? "";
			const fullName = `${firstName} ${lastName}`.trim();

			return {
				name: fullName || speaker.user.email || speaker.id,
				type,
			};
		}) ?? []
	);
}

export const Table = ({ data }: { data: getScheduleCmsResultResponseType }) => {
	const navigation = useNavigation();

	return (
		<table className="min-w-[1000px] w-full border border-gray-200 rounded-lg overflow-x-scroll">
			<thead className="bg-gray-100">
				<tr>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Start
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						End
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Title
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Speaker
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Room
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Schedule Type
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Stream Key
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Actions
					</th>
				</tr>
			</thead>
			<tbody>
				{data.map((schedule) => (
					<tr key={schedule.id} className="border-t">
						<td className="px-4 py-2">
							{schedule.start
								? new Date(schedule.start).toLocaleDateString("id-ID", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})
								: "-"}
						</td>
						<td className="px-4 py-2">
							{schedule.end
								? new Date(schedule.end).toLocaleDateString("id-ID", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})
								: "-"}
						</td>
						<td className="px-4 py-2">{schedule.title}</td>
						<td className="px-4 py-2">
							<div className="flex flex-wrap gap-2">
								{formatSpeakers(schedule.speakers).length > 0 ? (
									formatSpeakers(schedule.speakers).map((speakerData) => (
										<span
											key={`${schedule.id}-${speakerData.type}-${speakerData.name}`}
											className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
										>
											<span>{speakerData.name}</span>
											<span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600">
												{speakerData.type}
											</span>
										</span>
									))
								) : (
									<span className="text-gray-500">-</span>
								)}
							</div>
						</td>
						<td className="px-4 py-2">{schedule.room.name ?? "-"}</td>
						<td className="px-4 py-2">{schedule.schedule_type?.name ?? "-"}</td>
						<td className="px-4 py-2">{schedule.stream_key ?? "-"}</td>
						<td className="px-4 py-2">
							{/* Actions such as Edit/Delete can be placed here */}
							<Link
								to={`/cms/schedule/${schedule.id}/edit`}
								className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 ml-2 hover:cursor-pointer"
							>
								Edit
							</Link>
							<Form method="post" className="inline">
								<input type="hidden" name="id" value={schedule.id} />
								<button
									type="submit"
									name="intent"
									value="delete"
									className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 ml-2 hover:cursor-pointer"
									disabled={navigation.state === "submitting"}
								>
									Delete
								</button>
							</Form>
							<Form method="post" className="inline">
								<input type="hidden" name="id" value={schedule.id} />
								<button
									type="submit"
									name="intent"
									value="recreate-stream"
									className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 ml-2 hover:cursor-pointer"
									disabled={navigation.state === "submitting"}
								>
									Recreate Stream
								</button>
							</Form>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
