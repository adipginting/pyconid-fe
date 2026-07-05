import { useEffect } from "react";
import { Form, Link, redirect, useNavigation } from "react-router";
import { toast } from "sonner";
import {
	findOrganizerById,
	getOrganizerType,
	updateOrganizerById,
} from "~/api/endpoint/.server/organizer";
import {
	organizerDetailSchema,
	organizerTypeAllSchema,
} from "~/api/schema/organizer";
import { clientErrorSchema } from "~/api/schema/shared";
import { Select } from "~/components/sections/cms-speaker/select";
import type { Route } from "./+types/organizer-edit";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
	const { id } = params;
	if (!id) {
		return redirect("/cms/organizer");
	}

	const organizerRes = await findOrganizerById({
		request,
		organizer_id: id,
	});

	if (organizerRes.status === 404) {
		return redirect("/cms/organizer");
	}

	if (!organizerRes.ok) {
		console.error("Failed to get organizer:", organizerRes.statusText);
		throw new Response("something wrong with server", { status: 500 });
	}

	const organizerTypeRes = await getOrganizerType();
	if (organizerTypeRes.status !== 200) {
		console.error(
			"Failed to fetch organizer types",
			organizerTypeRes.status,
			await organizerTypeRes.text(),
		);
		throw new Response("Failed to fetch organizer types", {
			status: organizerTypeRes.status,
		});
	}

	return {
		organizer: organizerDetailSchema.parse(await organizerRes.json()),
		organizerTypes: organizerTypeAllSchema.parse(await organizerTypeRes.json()),
	};
};

export const action = async ({ request }: Route.ActionArgs) => {
	const formData = await request.formData();
	const id = formData.get("id") as string;
	const user_id = formData.get("user_id") as string;
	const organizer_type_id = formData.get("organizer_type_id") as string | null;

	const res = await updateOrganizerById({
		request,
		organizer_id: id,
		body: {
			user_id,
			organizer_type_id,
		},
	});

	if (res.status === 422) {
		const json = await res.json();
		console.error("Validation error:", json);
		const clientError = clientErrorSchema.parse(json);
		return {
			clientError,
			serverError: null,
		};
	} else if (res.status === 400) {
		const json = await res.json();
		console.error("Bad request error:", json);
		const clientError = clientErrorSchema.parse({
			message: json.message,
			errors: [],
		});
		return {
			clientError,
			serverError: null,
		};
	} else if (res.status === 404) {
		console.error("Organizer not found");
		throw new Response("Not found", { status: 404 });
	}

	if (!res.ok) {
		console.error("Failed to update organizer:", res.statusText);
		return {
			clientError: null,
			serverError: res.statusText,
		};
	}

	return redirect("/cms/organizer");
};

export default function OrganizerEditPage(
	componentProps: Route.ComponentProps,
) {
	const { organizer, organizerTypes } = componentProps.loaderData;
	const actionData = componentProps.actionData;
	const navigation = useNavigation();

	useEffect(() => {
		if (actionData?.clientError?.message) {
			toast.error(actionData.clientError.message);
		}
		if (actionData?.serverError) {
			toast.error(actionData.serverError);
		}
	}, [actionData]);

	return (
		<div className="max-w-[500px] border border-gray-500 rounded-lg p-4">
			<h1 className="text-2xl font-bold mb-4">Update Organizer</h1>
			<Form method="post" className="flex flex-col gap-2">
				<input type="hidden" name="id" value={organizer.id} />
				<input type="hidden" name="user_id" value={organizer.user.id} />
				<div className="flex flex-col gap-1">
					<label htmlFor="organizer-user" className="capitalize text-gray-700">
						user
					</label>
					<input
						id="organizer-user"
						type="text"
						value={`${organizer.user.first_name ?? ""} ${organizer.user.last_name ?? ""} (${organizer.user.username ?? ""})`}
						readOnly
						disabled
						className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
					/>
				</div>
				<Select
					id="organizer_type_id"
					name="organizer_type_id"
					label="organizer type"
					placeholder="Select organizer type"
					defaultValue={organizer.organizer_type?.id || null}
					options={organizerTypes.results.map((item) => ({
						label: item.name,
						value: item.id,
					}))}
					errorMessage={
						actionData?.clientError?.errors
							.filter((item) => item.field === "organizer_type_id")
							.map((item) => item.message)
							.join(", ") || undefined
					}
				/>
				<div className="flex justify-end gap-4 pt-4">
					<Link
						to="/cms/organizer"
						className="bg-gray-500 rounded-lg hover:cursor-pointer text-white px-4 py-2"
					>
						Cancel
					</Link>
					<button
						type="submit"
						className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
						disabled={navigation.state === "submitting"}
					>
						Update
					</button>
				</div>
			</Form>
		</div>
	);
}
