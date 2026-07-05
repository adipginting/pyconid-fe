import {
	type OrganizerCreateType,
	type OrganizerUpdateType,
	organizerCreateSchema,
	organizerUpdateSchema,
} from "~/api/schema/organizer";
import { http } from "~/lib/http/$.server";

export const getOrganizersPublic = async ({
	search,
	order_dir = "asc",
}: {
	search?: string;
	order_dir?: "asc" | "desc";
} = {}) => {
	const params: Record<string, string> = {
		order_dir,
	};

	if (search) {
		params.search = search;
	}

	return await http.get("/organizer/public", { params });
};

export const getOrganizers = async ({
	request,
	search,
	order_dir = "asc",
}: {
	request: Request;
	search?: string;
	order_dir?: "asc" | "desc";
}) => {
	const params: Record<string, string> = {
		order_dir,
	};

	if (search) {
		params.search = search;
	}

	return await http.get("/organizer/", { request, params });
};

export const postOrganizer = async ({
	request,
	body,
}: {
	request: Request;
	body: OrganizerCreateType;
}) => {
	organizerCreateSchema.parse(body);
	return await http.post("/organizer/", { request, body });
};

export const getOrganizersGroupedByType = async ({
	request,
}: {
	request: Request;
}) => {
	return await http.get("/organizer/type", { request });
};

export const getUsersForOrganizer = async ({
	request,
	search,
}: {
	request: Request;
	search?: string;
}) => {
	const params: Record<string, string> = {};

	if (search) {
		params.search = search;
	}

	return await http.get("/organizer/user/", { request, params });
};

export const findOrganizerByType = async ({
	request,
	organizer_type_id,
}: {
	request: Request;
	organizer_type_id: string;
}) => {
	return await http.get(`/organizer/type/${organizer_type_id}`, { request });
};

export const findOrganizerById = async ({
	request,
	organizer_id,
}: {
	request: Request;
	organizer_id: string;
}) => {
	return await http.get(`/organizer/${organizer_id}`, { request });
};

export const updateOrganizerById = async ({
	request,
	organizer_id,
	body,
}: {
	request: Request;
	organizer_id: string;
	body: OrganizerUpdateType;
}) => {
	organizerUpdateSchema.parse(body);
	return await http.put(`/organizer/${organizer_id}`, { request, body });
};

export const deleteOrganizerById = async ({
	request,
	organizer_id,
}: {
	request: Request;
	organizer_id: string;
}) => {
	return await http.delete(`/organizer/${organizer_id}`, { request });
};

export const getOrganizerProfilePicture = async ({
	request,
	organizer_id,
}: {
	request: Request;
	organizer_id: string;
}) => {
	return await http.get(`/organizer/${organizer_id}/profile-picture`, {
		request,
	});
};

export const getOrganizerType = async () => {
	return await http.get("/organizer-type/");
};
