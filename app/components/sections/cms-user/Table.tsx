import { Link } from "react-router";
import type { UserQrType } from "~/api/schema/user";

export const Table = ({ data }: { data: UserQrType[] }) => {
	return (
		<table className="min-w-[1000px] w-full border border-gray-200 rounded-lg overflow-hidden">
			<thead className="bg-gray-100">
				<tr>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						ID
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Username
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						First Name
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Last Name
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Email
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Actions
					</th>
				</tr>
			</thead>
			<tbody>
				{data.map((user) => (
					<tr key={user.id} className="border-t">
						<td className="px-4 py-2">{user.id}</td>
						<td className="px-4 py-2">{user.username ?? "-"}</td>
						<td className="px-4 py-2">{user.first_name ?? "-"}</td>
						<td className="px-4 py-2">{user.last_name ?? "-"}</td>
						<td className="px-4 py-2">{user.email ?? "-"}</td>
						<td className="px-4 py-2">
							<Link
								to={`/cms/user/${user.id}/edit`}
								className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 hover:cursor-pointer"
							>
								Detail
							</Link>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
