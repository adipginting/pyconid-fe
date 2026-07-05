import { Form, Link } from "react-router";
import type { OrganizerListType } from "~/api/schema/organizer";

export const Table = ({ data }: { data: OrganizerListType["results"] }) => {
	return (
		<table className="min-w-[1000px] w-full border border-gray-200 rounded-lg overflow-hidden">
			<thead className="bg-gray-100">
				<tr>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						First Name
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Last Name
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Username
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Email
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Organizer Type
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Actions
					</th>
				</tr>
			</thead>
			<tbody>
				{data.map((organizer) => (
					<tr key={organizer.id} className="border-t">
						<td className="px-4 py-2">{organizer.user.first_name ?? "-"}</td>
						<td className="px-4 py-2">{organizer.user.last_name ?? "-"}</td>
						<td className="px-4 py-2">{organizer.user.username ?? "-"}</td>
						<td className="px-4 py-2">{organizer.user.email ?? "-"}</td>
						<td className="px-4 py-2">
							{organizer.organizer_type?.name ?? "-"}
						</td>
						<td className="px-4 py-2">
							<Link
								to={`/cms/organizer/${organizer.id}/edit`}
								className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 hover:cursor-pointer"
							>
								Edit
							</Link>
							<Form method="post" className="inline">
								<input type="hidden" name="id" value={organizer.id} />
								<button
									type="submit"
									name="intent"
									value="delete"
									className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 ml-2 hover:cursor-pointer"
								>
									Delete
								</button>
							</Form>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
