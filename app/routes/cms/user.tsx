import { getUserForQr } from "~/api/endpoint/.server/user";
import { getUserForQrSchema } from "~/api/schema/user";
import { Pagination } from "~/components/sections/cms-user/pagination";
import { SearchBar } from "~/components/sections/cms-user/SearchBar";
import { Table } from "~/components/sections/cms-user/Table";
import type { Route } from "./+types/user";

export const loader = async ({ request }: Route.LoaderArgs) => {
	const url = new URL(request.url);
	const searchParams = url.searchParams;

	const listUserRes = await getUserForQr({
		request,
		page: Number(searchParams.get("page") || "1"),
		page_size: Number(searchParams.get("page_size") || "5"),
		search: searchParams.get("search") || undefined,
		order_dir: "desc",
		all: true,
	});

	if (listUserRes.status !== 200) {
		console.error(
			"Failed to fetch user data",
			listUserRes.status,
			await listUserRes.text(),
		);
		throw new Response("Failed to fetch user data", {
			status: listUserRes.status,
		});
	}

	return {
		listUser: getUserForQrSchema.parse(await listUserRes.json()),
		search: searchParams.get("search") || null,
	};
};

export default function CMSUserPage(componentProps: Route.ComponentProps) {
	const { loaderData } = componentProps;

	return (
		<div>
			<h1 className="text-black text-2xl font-bold">User QR</h1>
			<div className="w-full flex flex-col sm:flex-row justify-end items-end gap-2">
				<SearchBar />
			</div>
			<div className="py-4 min-w-full overflow-x-scroll">
				<Table data={loaderData.listUser.results} />
			</div>
			<div className="flex justify-center">
				<Pagination
					currentPage={loaderData.listUser.page}
					page_count={loaderData.listUser.page_count}
					page_size={loaderData.listUser.page_size}
					search={loaderData.search}
				/>
			</div>
		</div>
	);
}
