import {
	type ActionFunctionArgs,
	Form,
	redirect,
	useNavigation,
} from "react-router";
import z from "zod";
import { resetPassword } from "~/api/endpoint/.server/auth";
import { resetPasswordWithConfirmPasswordSchema } from "~/api/schema/auth";
import { PasswordInput } from "~/components/shared/password-input/password-input";
import {
	commitMessageSession,
	getMessageSession,
} from "~/services/sessions/message.server";

export function meta() {
	return [
		{ title: "PyCon ID 2026 Reset Password" },
		{
			name: "PyCon ID 2026 Reset Password Page",
			content: "Reset Password page",
		},
	];
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const referer = request.headers.get("referer");
	const messageSession = await getMessageSession(request.headers.get("Cookie"));

	const url = new URL(request.url);
	const token = url.searchParams.get("token");

	if (!token) {
		messageSession.flash("toast", {
			title: "Oops!",
			message: "No token found!",
			type: "error",
		});

		return redirect("/login", {
			headers: {
				"Set-Cookie": await commitMessageSession(messageSession),
			},
		});
	}

	const formData = await request.formData();
	const new_password = String(formData.get("new_password"));
	const confirm_password = String(formData.get("confirm_password"));
	const payload = { token, new_password, confirm_password };

	try {
		const validatedForm =
			resetPasswordWithConfirmPasswordSchema.safeParse(payload);
		if (!validatedForm.success) {
			const error = z.prettifyError(validatedForm.error);
			throw new Error(error);
		}

		const body = { token, new_password };
		const response = await resetPassword({ body });
		const data: { message?: string } = await response.json();
		if (!response.ok) throw new Error(data?.message || response.statusText);

		messageSession.flash("toast", {
			title: "Success!",
			message: data?.message || "Password reset successfully!",
			type: "success",
		});

		return redirect("/login", {
			headers: {
				"Set-Cookie": await commitMessageSession(messageSession),
			},
		});
	} catch (error) {
		console.error("error", error);
		messageSession.flash("toast", {
			title: "Oops!",
			message: (error as Error)?.message,
			type: "error",
		});

		return redirect(referer ?? "/login", {
			headers: {
				"Set-Cookie": await commitMessageSession(messageSession),
			},
		});
	}
};

export default function ResetPasswordPage() {
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";

	return (
		<main className="w-full">
			<Form method="POST" className="space-y-4 w-full">
				<PasswordInput
					id="new_password"
					name="new_password"
					label="New Password"
				/>
				<PasswordInput
					id="confirm_password"
					name="confirm_password"
					label="Confirm Password"
				/>
				<button
					type="submit"
					className="bg-surface w-full h-12 text-white font-bold mt-2 cursor-pointer transition-all duration-150 hover:bg-surface/90 disabled:bg-surface/50 disabled:cursor-not-allowed"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Loading..." : "Reset Password"}
				</button>
			</Form>
		</main>
	);
}
