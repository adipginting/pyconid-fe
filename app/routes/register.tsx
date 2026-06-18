import { Form, useNavigation } from "react-router";
import { PasswordInput } from "~/components/shared/password-input/password-input";
import { StrategyOptions } from "~/services/auth/strategy";
import type { AuthLayoutHandleProps } from "./layouts/auth";

export const handle: AuthLayoutHandleProps = { title: "Register" };

export function meta() {
	return [
		{ title: "PyCon ID 2026 Register" },
		{ name: "PyCon ID 2026 Register Page", content: "Register page" },
	];
}

export default function Register() {
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";

	return (
		<main className="w-full">
			<Form
				action={`/auth/${StrategyOptions.SIGNUP_FORM}`}
				method="post"
				className="space-y-4 w-full"
			>
				<div className="flex flex-col w-full">
					<label
						htmlFor="email"
						className="text-xs font-bold mb-1.5 text-gray-800"
					>
						Email
					</label>
					<input
						id="email"
						name="email"
						placeholder="yourmail@example.com"
						type="email"
						className="border border-neutral-200 bg-neutral-50/50 w-full h-12 text-gray-800 px-4 focus:outline-none focus:border-surface focus:ring-1 focus:ring-surface transition-all"
					/>
				</div>
				<PasswordInput id="password" name="password" label="Password" />
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
					{isSubmitting ? "Loading..." : "Continue with Email"}
				</button>
			</Form>
		</main>
	);
}
