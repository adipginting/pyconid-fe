import { redirect } from "react-router";
import { getMe } from "~/api/endpoint/.server/auth";
import { getUserProfile } from "~/api/endpoint/.server/user_profile";
import { meSchema } from "~/api/schema/auth";
import { getUserProfileSchema } from "~/api/schema/user_profile";
import { Main as MainLayout } from "~/components/layouts/app/main";
import { DashboardSection } from "~/components/sections/dashboard/dashboard";
import { authenticator } from "~/services/auth/$.server";
import type { Route } from "./+types/dashboard";

export function meta() {
	return [
		{ title: "Dashboard | PyCon ID 2026" },
		{
			name: "PyCon ID 2026 Dashboard",
			content: "Account dashboard for PyCon ID 2026",
		},
	];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
	const credentials = await authenticator.isAuthenticated(request);
	if (!credentials) {
		return redirect("/login");
	}
	try {
		const dataMe = await getMe({ request });
		if (dataMe.status === 401) {
			authenticator.logout(request, {
				redirectTo: "/",
			});
			return redirect("/login");
		}
		if (dataMe.status !== 200) {
			console.error(
				"Failed to fetch user data",
				dataMe.status,
				await dataMe.text(),
			);
			throw new Response("Failed to fetch user data", {
				status: dataMe.status,
			});
		}
		const dataUserProfile = await getUserProfile({ request });
		if (dataUserProfile.status === 401) {
			return redirect("/login");
		}
		const jsonUserProfile = await dataUserProfile.json();
		const userProfile = getUserProfileSchema.parse(jsonUserProfile);
		const me = meSchema.parse(await dataMe.json());

		return { userProfile, me };
	} catch (err) {
		if (err instanceof Response) {
			throw err;
		}
		console.error("Account profile loader error", err);
		throw new Response("Failed to load profile data", { status: 500 });
	}
};

export default function DashboardPage(componentProps: Route.ComponentProps) {
	return (
		<MainLayout className="bg-[#FAF9F7]" contentClassName="!pt-0">
			<DashboardSection
				userProfile={componentProps.loaderData.userProfile}
				me={componentProps.loaderData.me}
			/>
		</MainLayout>
	);
}
