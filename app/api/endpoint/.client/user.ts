import { httpClient } from "~/lib/http/$.client";

export const getUserForQr = async ({
	page = 1,
	page_size = 5,
	search = null,
	all = false,
	order_dir = "asc",
}: {
	page?: number;
	page_size?: number;
	search?: string | null;
	all?: boolean;
	order_dir?: "asc" | "desc";
}) => {
	const params: Record<string, string> = {
		page: page.toString(),
		page_size: page_size.toString(),
		order_dir,
	};
	if (search) {
		params.search = search;
	}
	if (all) {
		params.all = all ? "true" : "false";
	}

	return await httpClient.get("/user/qr/", { params });
};

export const getDetailUserForQr = async ({ user_id }: { user_id: string }) => {
	return await httpClient.get(`/user/${user_id}/qr/`);
};
