import { Form, Link, redirect, useNavigation } from "react-router";
import { toast } from "sonner";
import {
	getPatron,
	getPatronImage,
	updatePatron,
} from "~/api/endpoint/.server/patron";
import {
	patronResponseItemSchema,
	patronTierSchema,
} from "~/api/schema/patron";
import { clientErrorSchema } from "~/api/schema/shared";
import type { Route } from "./+types/patron-edit";

const imageDataUrl = async (id: string) => {
	const response = await getPatronImage({ patron_id: id });
	if (!response.ok) return null;
	const contentType = response.headers.get("content-type") || "image/*";
	return `data:${contentType};base64,${Buffer.from(await response.arrayBuffer()).toString("base64")}`;
};

export const loader = async ({ params, request }: Route.LoaderArgs) => {
	if (!params.id) return redirect("/cms/patron");
	const response = await getPatron({ request, patron_id: params.id });
	if (response.status === 404) return redirect("/cms/patron");
	if (!response.ok)
		throw new Response("Failed to fetch patron", { status: response.status });
	const patron = patronResponseItemSchema.parse(await response.json());
	return { patron, image: await imageDataUrl(patron.id) };
};

export const action = async ({ request }: Route.ActionArgs) => {
	const input = await request.formData();
	const id = input.get("id");
	const name = input.get("name");
	const tier = input.get("tier");
	if (typeof id !== "string")
		return { clientError: null, serverError: "Patron id is required" };

	const image = input.get("image");
	const formData = new FormData();
	formData.append("name", typeof name === "string" ? name : "");
	formData.append("tier", typeof tier === "string" ? tier : "");
	if (image instanceof File && image.size > 0) formData.append("image", image);

	const response = await updatePatron({ request, patron_id: id, formData });
	if (response.status === 422)
		return {
			clientError: clientErrorSchema.parse(await response.json()),
			serverError: null,
		};
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
	if (response.status === 404)
		throw new Response("Patron not found", { status: 404 });
	if (!response.ok)
		return { clientError: null, serverError: response.statusText };
	return redirect("/cms/patron");
};

export default function PatronEditPage({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const navigation = useNavigation();
	if (actionData?.clientError?.message)
		toast.error(actionData.clientError.message);

	return (
		<div className="max-w-[500px] border border-gray-500 rounded-lg p-4">
			<h1 className="text-2xl font-bold mb-4">Update Patron</h1>
			<Form
				method="post"
				encType="multipart/form-data"
				className="flex flex-col gap-2"
			>
				<input type="hidden" name="id" value={loaderData.patron.id} />
				<label htmlFor="patron-name" className="text-gray-700">
					Name
				</label>
				<input
					id="patron-name"
					name="name"
					defaultValue={loaderData.patron.name}
					required
					className="border border-gray-300 rounded-lg px-3 py-2"
				/>
				<label htmlFor="patron-tier" className="text-gray-700">
					Tier
				</label>
				<select
					id="patron-tier"
					name="tier"
					defaultValue={loaderData.patron.tier}
					required
					className="border border-gray-300 rounded-lg px-3 py-2"
				>
					{patronTierSchema.options.map((tier) => (
						<option key={tier} value={tier}>
							{tier}
						</option>
					))}
				</select>
				<label htmlFor="patron-image" className="text-gray-700">
					Image
				</label>
				{loaderData.image && (
					<img
						src={loaderData.image}
						alt={loaderData.patron.name}
						className="object-cover"
					/>
				)}
				<input
					id="patron-image"
					name="image"
					type="file"
					accept="image/*"
					className="border border-gray-300 rounded-lg px-3 py-2"
				/>
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
						Update
					</button>
				</div>
			</Form>
		</div>
	);
}
