import { type ChangeEvent, useEffect, useState } from "react";
import { Form, Link, redirect, useNavigation } from "react-router";
import { toast } from "sonner";
import { postPatron } from "~/api/endpoint/.server/patron";
import { patronCreateSchema, patronTierSchema } from "~/api/schema/patron";
import { clientErrorSchema } from "~/api/schema/shared";
import type { Route } from "./+types/patron-create";

const fields = (
	data: ReturnType<typeof clientErrorSchema.parse>,
	field: string,
) =>
	data.errors
		.filter((item) => item.field === field)
		.map((item) => item.message)
		.join(", ") || undefined;

export const action = async ({ request }: Route.ActionArgs) => {
	const input = await request.formData();
	const name = input.get("name");
	const tier = input.get("tier");
	const image = input.get("image");
	const value = {
		name: typeof name === "string" ? name : "",
		tier: typeof tier === "string" ? tier : "",
		image: image instanceof File && image.size > 0 ? image : null,
	};
	const parsed = patronCreateSchema.safeParse(value);
	if (!parsed.success) {
		return {
			clientError: {
				message: "Please check the form fields.",
				errors: parsed.error.issues.map((issue) => ({
					field: String(issue.path[0] ?? "form"),
					message: issue.message,
				})),
			},
			serverError: null,
		};
	}

	const formData = new FormData();
	formData.append("name", parsed.data.name);
	formData.append("tier", parsed.data.tier);
	if (parsed.data.image) formData.append("image", parsed.data.image);

	const response = await postPatron({ request, formData });
	if (response.status === 422) {
		return {
			clientError: clientErrorSchema.parse(await response.json()),
			serverError: null,
		};
	}
	if (response.status === 400) {
		const json = await response.json();
		return {
			clientError: clientErrorSchema.parse({
				message: json.message,
				errors: [],
			}),
			serverError: null,
		};
	}
	if (!response.ok)
		return { clientError: null, serverError: response.statusText };
	return redirect("/cms/patron");
};

export default function PatronCreatePage({ actionData }: Route.ComponentProps) {
	const navigation = useNavigation();
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	useEffect(() => {
		if (actionData?.clientError?.message) {
			toast.error(actionData.clientError.message);
		}
	}, [actionData]);

	useEffect(() => {
		return () => {
			if (imagePreview) URL.revokeObjectURL(imagePreview);
		};
	}, [imagePreview]);

	const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		setImagePreview(file ? URL.createObjectURL(file) : null);
	};

	return (
		<div className="max-w-[500px] border border-gray-500 rounded-lg p-4">
			<h1 className="text-2xl font-bold mb-4">Create Patron</h1>
			<Form
				method="post"
				encType="multipart/form-data"
				className="flex flex-col gap-2"
			>
				<label htmlFor="patron-name" className="text-gray-700">
					Name
				</label>
				<input
					id="patron-name"
					name="name"
					required
					className="border border-gray-300 rounded-lg px-3 py-2"
				/>
				{actionData?.clientError && (
					<p className="text-sm text-red-500">
						{fields(actionData.clientError, "name")}
					</p>
				)}
				<label htmlFor="patron-tier" className="text-gray-700">
					Tier
				</label>
				<select
					id="patron-tier"
					name="tier"
					required
					className="border border-gray-300 rounded-lg px-3 py-2"
				>
					<option value="">Select tier</option>
					{patronTierSchema.options.map((tier) => (
						<option key={tier} value={tier}>
							{tier}
						</option>
					))}
				</select>
				{actionData?.clientError && (
					<p className="text-sm text-red-500">
						{fields(actionData.clientError, "tier")}
					</p>
				)}
				<label htmlFor="patron-image" className="text-gray-700">
					Image
				</label>
				<input
					id="patron-image"
					name="image"
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					className="border border-gray-300 rounded-lg px-3 py-2"
				/>
				{imagePreview && (
					<img
						src={imagePreview}
						alt="Selected patron"
						className="object-cover"
					/>
				)}
				<div className="flex justify-end gap-4 pt-4">
					<Link
						to="/cms/patron"
						className="bg-gray-500 rounded-lg text-white px-4 py-2"
					>
						Cancel
					</Link>
					<button
						type="submit"
						disabled={navigation.state === "submitting"}
						className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
					>
						Create
					</button>
				</div>
			</Form>
		</div>
	);
}
