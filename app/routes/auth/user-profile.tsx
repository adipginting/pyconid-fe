import { redirect } from "react-router";
import { z } from "zod";
import {
	getUserProfile,
	industries as industriesApi,
	jobs as jobsApi,
	participantTypes as participantTypesApi,
	updateUserProfile,
} from "~/api/endpoint/.server/user_profile";
import {
	getUserProfileSchema,
	industriesSchema,
	jobsSchema,
	participantTypeSchema,
	updateUserProfileSchema,
} from "~/api/schema/user_profile";
import { Footer } from "~/components/layouts/navigation/footer";
import { UserProfileSection } from "~/components/sections/user-profile/user-profile";
import { authenticator } from "~/services/auth/$.server";
import type { Route } from "./+types/user-profile";

export function meta() {
	return [
		{ title: "Edit Profile | PyCon ID 2026" },
		{
			name: "PyCon ID 2026 Edit Profile",
			content: "Edit your profile for PyCon ID 2026",
		},
	];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
	const credentials = await authenticator.isAuthenticated(request);
	if (!credentials) {
		return redirect("/login");
	}

	try {
		const [dataIndustries, dataJobs, dataParticipant, dataUserProfile] =
			await Promise.all([
				industriesApi(),
				jobsApi(),
				participantTypesApi(),
				getUserProfile({ request }),
			]);
		const [jsonIndustries, jsonJobs, jsonParticipant, jsonUserProfile] =
			await Promise.all([
				dataIndustries.json(),
				dataJobs.json(),
				dataParticipant.json(),
				dataUserProfile.json(),
			]);
		const industries = industriesSchema.parse(jsonIndustries);
		const jobs = jobsSchema.parse(jsonJobs);
		const participantTypes = participantTypeSchema.parse(jsonParticipant);
		const userProfile = getUserProfileSchema.parse(jsonUserProfile);
		return { industries, jobs, participantTypes, userProfile };
	} catch (err) {
		console.error("Dashboard loader error", err);
		throw new Response("Failed to load dashboard data", { status: 500 });
	}
};

const clientErrorDetailSchema = z.object({
	field: z.string(),
	message: z.string(),
});

const clientErrorSchema = z.object({
	errors: z.array(clientErrorDetailSchema),
	message: z.string(),
});

export type UserProfileActionData = {
	success: boolean;
	clientError: {
		message: string;
		errors: Array<{ field: string; message: string }>;
	} | null;
	errors: Record<string, unknown> | null;
};

export const action = async ({ request }: Route.ActionArgs) => {
	const credentials = await authenticator.isAuthenticated(request);
	if (!credentials) {
		return redirect("/login");
	}
	const formData = new FormData();
	let hasProfilePicture = false;
	for (const [key, value] of (await request.formData()).entries()) {
		if (key === "profile_picture") {
			if (
				!hasProfilePicture &&
				value &&
				typeof value !== "string" &&
				(value?.size || 0) > 0
			) {
				formData.append(key, value);
				hasProfilePicture = true;
			}
			continue;
		}
		if (typeof value === "string" && value.trim() !== "") {
			formData.append(key, value);
		}
	}
	if (!formData.has("share_my_email_and_phone_number")) {
		formData.append("share_my_email_and_phone_number", "false");
	}
	if (!formData.has("share_my_job_and_company")) {
		formData.append("share_my_job_and_company", "false");
	}
	if (!formData.has("share_my_location")) {
		formData.append("share_my_location", "false");
	}
	if (!formData.has("share_my_interest")) {
		formData.append("share_my_interest", "false");
	}
	if (!formData.has("share_my_public_social_media")) {
		formData.append("share_my_public_social_media", "false");
	}
	if (!formData.has("share_my_data_to_sponsor")) {
		formData.append("share_my_data_to_sponsor", "false");
	}
	if (!formData.has("retain_my_data_for_next_pycon")) {
		formData.append("retain_my_data_for_next_pycon", "false");
	}
	if (!formData.has("coc_acknowledged")) {
		formData.append("coc_acknowledged", "false");
	}
	if (!formData.has("terms_agreed")) {
		formData.append("terms_agreed", "false");
	}
	if (!formData.has("privacy_agreed")) {
		formData.append("privacy_agreed", "false");
	}
	const data = Object.fromEntries(formData.entries());
	const fieldNameMap: Record<string, string> = {
		state_id: "State",
		city_id: "City",
		country_id: "Country",
	};

	const formatFieldName = (field: string) => {
		if (fieldNameMap[field]) return fieldNameMap[field];
		return field
			.replace(/_/g, " ")
			.replace(/-/g, " ")
			.replace(/\b\w/g, (c) => c.toUpperCase());
	};

	const results = updateUserProfileSchema.safeParse(data);
	if (!results.success) {
		const missingFields = results.error.issues.map((issue) =>
			formatFieldName(issue.path.join(".")),
		);
		const message = `Missing or invalid fields: ${missingFields.join(", ")}`;
		return {
			success: false,
			clientError: {
				message,
				errors: results.error.issues.map((i) => ({
					field: formatFieldName(i.path.join(".")),
					message: i.message,
				})),
			},
			errors: null,
		};
	}
	const res = await updateUserProfile({ request, formData });
	if (!res.ok) {
		const text = await res.text();
		let json: Record<string, unknown> | null = null;
		try {
			json = JSON.parse(text);
		} catch {
			json = null;
		}

		if (res.status === 400 && json) {
			return {
				success: false,
				clientError: clientErrorSchema.parse({
					errors: [],
					message: (json as { message?: string }).message || text,
				}),
				errors: null,
			};
		}
		if (res.status === 422 && json) {
			const clientError = clientErrorSchema.parse(json);
			clientError.message = "Invalid data, please check the form fields.";
			return {
				success: false,
				clientError,
				errors: null,
			};
		}
		return {
			success: false,
			clientError: null,
			errors: json ?? { message: text || `Server error ${res.status}` },
		};
	}

	return {
		success: true,
		clientError: null,
		errors: null,
	};
};

export default function UserProfilePage(componentProps: Route.ComponentProps) {
	return (
		<main className="bg-[#FAF9F7]">
			<UserProfileSection
				userProfile={componentProps.loaderData.userProfile}
				industries={componentProps.loaderData.industries}
				jobs={componentProps.loaderData.jobs}
				actionData={componentProps.actionData}
			/>
			<Footer />
		</main>
	);
}
