import { http } from "~/lib/http/$.server";

export const getUserForQr = async ({
	request,
	page = 1,
	page_size = 5,
	search = null,
	all = false,
	order_dir = "asc",
}: {
	request: Request;
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

	return await http.get("/user/qr/", { request, params });
};

export const getDetailUserForQr = async ({
	request,
	user_id,
}: {
	request: Request;
	user_id: string;
}) => {
	return await http.get(`/user/${user_id}/qr/`, { request });
};
