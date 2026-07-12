import { Form, Link } from "react-router";
import {
	deletePatron,
	getPatronImage,
	getPatrons,
} from "~/api/endpoint/.server/patron";
import { patronListResponseSchema } from "~/api/schema/patron";
import type { Route } from "./+types/patron";

const imageDataUrl = async (id: string) => {
	const response = await getPatronImage({ patron_id: id });
	if (!response.ok) return null;

	const contentType = response.headers.get("content-type") || "image/*";
	const bytes = Buffer.from(await response.arrayBuffer()).toString("base64");
	return `data:${contentType};base64,${bytes}`;
};

export const loader = async () => {
	const response = await getPatrons();
	if (!response.ok) {
		throw new Response("Failed to fetch patron data", {
			status: response.status,
		});
	}

	const patrons = patronListResponseSchema.parse(await response.json());
	const images = Object.fromEntries(
		await Promise.all(
			patrons.results
				.filter((patron) => patron.has_image)
				.map(async (patron) => [patron.id, await imageDataUrl(patron.id)]),
		),
	);

	return { patrons, images };
};

export const action = async ({ request }: Route.ActionArgs) => {
	const formData = await request.formData();
	if (formData.get("intent") !== "delete") return null;

	const id = formData.get("id");
	if (typeof id !== "string") return null;

	const response = await deletePatron({ request, patron_id: id });
	if (response.status === 404) {
		throw new Response("Patron not found", { status: 404 });
	}
	if (!response.ok) {
		throw new Response("Failed to delete patron", { status: response.status });
	}

	return null;
};

export default function CMSPatronPage({ loaderData }: Route.ComponentProps) {
	return (
		<div>
			<h1 className="text-black text-2xl font-bold">Patron</h1>
			<div className="w-full flex justify-end items-end gap-2">
				<Link
					to="/cms/patron/create"
					className="bg-green-500 rounded-lg hover:cursor-pointer text-white px-4 py-2"
				>
					Create Patron
				</Link>
			</div>
			<div className="py-4 min-w-full overflow-x-scroll">
				<table className="min-w-[700px] w-full border border-gray-200 rounded-lg overflow-hidden">
					<thead className="bg-gray-100">
						<tr>
							{/* <th className="px-4 py-2 text-left font-semibold text-gray-700">
								Image
							</th> */}
							<th className="px-4 py-2 text-left font-semibold text-gray-700">
								Name
							</th>
							<th className="px-4 py-2 text-left font-semibold text-gray-700">
								Tier
							</th>
							<th className="px-4 py-2 text-left font-semibold text-gray-700">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{loaderData.patrons.results.map((patron) => (
							<tr key={patron.id} className="border-t">
								{/* <td className="px-4 py-2">
									{loaderData.images[patron.id] && (
										<img
											src={loaderData.images[patron.id] ?? undefined}
											alt={patron.name}
											className="h-12 w-12 rounded object-cover"
										/>
									)}
								</td> */}
								<td className="px-4 py-2">{patron.name}</td>
								<td className="px-4 py-2 capitalize">{patron.tier}</td>
								<td className="px-4 py-2">
									<Link
										to={`/cms/patron/${patron.id}/edit`}
										className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
									>
										Edit
									</Link>
									<Form method="post" className="inline">
										<input type="hidden" name="id" value={patron.id} />
										<button
											type="submit"
											name="intent"
											value="delete"
											className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 ml-2"
										>
											Delete
										</button>
									</Form>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
