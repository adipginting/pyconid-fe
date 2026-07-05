import { Link } from "react-router";
import {
	deleteOrganizerById,
	getOrganizers,
} from "~/api/endpoint/.server/organizer";
import { organizerListSchema } from "~/api/schema/organizer";
import { SearchBar } from "~/components/sections/cms-organizer/SearchBar";
import { Table } from "~/components/sections/cms-organizer/Table";
import type { Route } from "./+types/organizer";

export const loader = async ({ request }: Route.LoaderArgs) => {
	const url = new URL(request.url);
	const searchParams = url.searchParams;

	const listOrganizerRes = await getOrganizers({
		request,
		search: searchParams.get("search") || undefined,
		order_dir: "desc",
	});

	if (listOrganizerRes.status !== 200) {
		console.error(
			"Failed to fetch organizer data",
			listOrganizerRes.status,
			await listOrganizerRes.text(),
		);
		throw new Response("Failed to fetch organizer data", {
			status: listOrganizerRes.status,
		});
	}

	return {
		listOrganizer: organizerListSchema.parse(await listOrganizerRes.json()),
		search: searchParams.get("search") || null,
	};
};

export const action = async ({ request }: Route.ActionArgs) => {
	const formData = await request.formData();
	const id = formData.get("id") as string;
	const intent = formData.get("intent") as string;

	if (intent === "delete") {
		const deleteRes = await deleteOrganizerById({
			request,
			organizer_id: id,
		});
		if (deleteRes.status === 404) {
			console.error("Organizer not found", await deleteRes.text());
			throw new Response("Organizer not found", { status: 404 });
		}
		if (!deleteRes.ok) {
			console.error(
				"Failed to delete organizer",
				deleteRes.status,
				await deleteRes.text(),
			);
			throw new Response("Failed to delete organizer", {
				status: deleteRes.status,
			});
		}
	}

	return null;
};

export default function CMSOrganizerPage(componentProps: Route.ComponentProps) {
	const { loaderData } = componentProps;

	return (
		<div>
			<h1 className="text-black text-2xl font-bold">Organizer</h1>
			<div className="w-full flex flex-col sm:flex-row justify-end items-end gap-2">
				<SearchBar />
				<Link
					to="/cms/organizer/create"
					className="bg-green-500 rounded-lg hover:cursor-pointer text-white px-4 py-2 max-w-[200px] text-center"
				>
					Create Organizer
				</Link>
			</div>
			<div className="py-4 min-w-full overflow-x-scroll">
				<Table data={loaderData.listOrganizer.results} />
			</div>
		</div>
	);
}
