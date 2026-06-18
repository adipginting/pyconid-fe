import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Form, Link, redirect, useNavigation } from "react-router";
import { toast } from "sonner";
import {
	getOrganizerType,
	getUsersForOrganizer,
	postOrganizer,
} from "~/api/endpoint/.server/organizer";
import {
	organizerTypeAllSchema,
	organizerUserListSchema,
} from "~/api/schema/organizer";
import { clientErrorSchema } from "~/api/schema/shared";
import { DropdownSearch } from "~/components/sections/cms-speaker/dropdownSearch";
import { Select } from "~/components/sections/cms-speaker/select";
import type { Route } from "./+types/organizer-create";

export const loader = async ({ request }: Route.LoaderArgs) => {
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

	const organizerUsersRes = await getUsersForOrganizer({ request });
	if (organizerUsersRes.status !== 200) {
		console.error(
			"Failed to fetch organizer users",
			organizerUsersRes.status,
			await organizerUsersRes.text(),
		);
		throw new Response("Failed to fetch organizer users", {
			status: organizerUsersRes.status,
		});
	}

	return {
		organizerTypes: organizerTypeAllSchema.parse(await organizerTypeRes.json()),
		organizerUsers: organizerUserListSchema.parse(
			await organizerUsersRes.json(),
		),
	};
};

export const action = async ({ request }: Route.ActionArgs) => {
	const formData = await request.formData();
	const user_id = formData.get("user_id") as string;
	const organizer_type_id = formData.get("organizer_type_id") as string;

	const res = await postOrganizer({
		request,
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
	}

	if (!res.ok) {
		console.error("Failed to create organizer:", res.statusText);
		return {
			clientError: null,
			serverError: res.statusText,
		};
	}

	return redirect("/cms/organizer");
};

export default function OrganizerCreatePage(
	componentProps: Route.ComponentProps,
) {
	const { actionData, loaderData } = componentProps;
	const navigation = useNavigation();

	const [searchOrganizerUser, setSearchOrganizerUser] = useState<string | null>(
		null,
	);
	const [formValue, setFormValue] = useState<{
		user: {
			label: string;
			value: string;
		} | null;
	}>({
		user: null,
	});
	const [clientValidationError, setClientValidationError] = useState<{
		user_id?: string;
		organizer_type_id?: string;
	}>({});

	const filteredUsers = useMemo(() => {
		const searchValue = (searchOrganizerUser ?? "").toLowerCase().trim();
		if (!searchValue) {
			return loaderData.organizerUsers.results;
		}

		return loaderData.organizerUsers.results.filter((item) => {
			const fullName = `${item.first_name ?? ""} ${item.last_name ?? ""}`
				.toLowerCase()
				.trim();
			const username = (item.username ?? "").toLowerCase();
			const email = (item.email ?? "").toLowerCase();
			return (
				fullName.includes(searchValue) ||
				username.includes(searchValue) ||
				email.includes(searchValue)
			);
		});
	}, [loaderData.organizerUsers.results, searchOrganizerUser]);

	useEffect(() => {
		if (actionData?.clientError?.message) {
			toast.error(actionData.clientError.message);
		}
		if (actionData?.serverError) {
			toast.error(actionData.serverError);
		}
	}, [actionData]);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		const formData = new FormData(event.currentTarget);
		const userId = (formData.get("user_id") as string | null)?.trim();
		const organizerTypeId = (
			formData.get("organizer_type_id") as string | null
		)?.trim();

		const errors: {
			user_id?: string;
			organizer_type_id?: string;
		} = {};

		if (!userId) {
			errors.user_id = "User is required";
		}

		if (!organizerTypeId) {
			errors.organizer_type_id = "Organizer type is required";
		}

		setClientValidationError(errors);

		if (Object.keys(errors).length > 0) {
			event.preventDefault();
			toast.error("Please fill all required fields");
		}
	};

	return (
		<div className="max-w-[500px] border border-gray-500 rounded-lg p-4">
			<h1 className="text-2xl font-bold mb-4">Create Organizer</h1>
			<Form
				method="post"
				className="flex flex-col gap-2"
				onSubmit={handleSubmit}
			>
				<DropdownSearch
					id="user_id"
					label="user"
					name="user_id"
					placeholder="search user..."
					dropdownItems={filteredUsers.map((item) => ({
						label: `${item.first_name ?? ""} ${item.last_name ?? ""} (${item.email ?? ""})`,
						value: item.id,
					}))}
					searchInputValue={searchOrganizerUser || ""}
					onSearchInputChange={(value) => setSearchOrganizerUser(value)}
					value={formValue.user}
					onChange={(value) => {
						setFormValue((prev) => ({ ...prev, user: value }));
						setClientValidationError((prev) => ({
							...prev,
							user_id: undefined,
						}));
					}}
					errorMessage={
						clientValidationError.user_id ||
						actionData?.clientError?.errors
							.filter((item) => item.field === "user_id")
							.map((item) => item.message)
							.join(", ") ||
						undefined
					}
				/>
				<Select
					id="organizer_type_id"
					name="organizer_type_id"
					label="organizer type"
					placeholder="Select organizer type"
					defaultValue={null}
					options={loaderData.organizerTypes.results.map((item) => ({
						label: item.name,
						value: item.id,
					}))}
					errorMessage={
						clientValidationError.organizer_type_id ||
						actionData?.clientError?.errors
							.filter((item) => item.field === "organizer_type_id")
							.map((item) => item.message)
							.join(", ") ||
						undefined
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
						Create
					</button>
				</div>
			</Form>
		</div>
	);
}
