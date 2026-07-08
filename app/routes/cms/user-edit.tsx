import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";
import { redirect, useNavigate } from "react-router";
import { getDetailUserForQr } from "~/api/endpoint/.server/user";
import { getDetailUserForQrSchema } from "~/api/schema/user";
import type { Route } from "./+types/user-edit";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
	const { id } = params;
	const currentWebsiteDomain = new URL(request.url).origin;
	if (!id) {
		return redirect("/cms/user");
	}

	const res = await getDetailUserForQr({
		request,
		user_id: id,
	});

	if (res.status === 404) {
		return redirect("/cms/user");
	}

	if (!res.ok) {
		console.error("Failed to get user:", res.status, await res.text());
		throw new Response("something wrong with server", { status: 500 });
	}

	return {
		currentWebsiteDomain,
		user: getDetailUserForQrSchema.parse(await res.json()),
	};
};

export default function UserEditPage(componentProps: Route.ComponentProps) {
	const { user, currentWebsiteDomain } = componentProps.loaderData;
	const navigate = useNavigate();
	const printableSectionRef = useRef<HTMLDivElement>(null);
	const qrCodeValue = `${currentWebsiteDomain}/auth/dashboard/${user.id}/public`;

	const handlePrintQrSection = () => {
		if (!printableSectionRef.current) return;

		const printWindow = window.open("", "_blank", "width=800,height=600");
		if (!printWindow) return;

		printWindow.document.write(`
			<!DOCTYPE html>
			<html>
				<head>
					<title>Print QR Code</title>
					<style>
						body {
							font-family: sans-serif;
							margin: 0;
							padding: 24px;
						}
						.container {
							display: flex;
							flex-direction: column;
							align-items: center;
							gap: 8px;
							border: 1px solid #d1d5db;
							border-radius: 16px;
							padding: 16px;
						}
					</style>
				</head>
				<body>
					<div class="container">${printableSectionRef.current.innerHTML}</div>
				</body>
			</html>
		`);

		printWindow.document.close();
		printWindow.focus();
		printWindow.print();
		printWindow.close();
	};

	return (
		<div className="max-w-[500px] border border-gray-500 rounded-lg p-4">
			<h1 className="text-2xl font-bold mb-4">Detail User</h1>
			<form className="flex flex-col gap-2">
				{/* <div className="border border-solid rounded-2xl p-2"> */}
				<div className="flex flex-col gap-1">
					<label htmlFor="username" className="capitalize text-gray-700">
						username
					</label>
					<input
						id="username"
						type="text"
						value={user.username ?? ""}
						readOnly
						disabled
						className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor="first-name" className="capitalize text-gray-700">
						first name
					</label>
					<input
						id="first-name"
						type="text"
						value={user.first_name ?? ""}
						readOnly
						disabled
						className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor="last-name" className="capitalize text-gray-700">
						last name
					</label>
					<input
						id="last-name"
						type="text"
						value={user.last_name ?? ""}
						readOnly
						disabled
						className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor="email" className="capitalize text-gray-700">
						email
					</label>
					<input
						id="email"
						type="text"
						value={user.email ?? ""}
						readOnly
						disabled
						className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
					/>
				</div>

				<div
					className="flex flex-col items-center gap-2 mt-3"
					ref={printableSectionRef}
				>
					<div>
						{user.first_name} {user.last_name}
					</div>
					<QRCodeSVG value={qrCodeValue} size={225} />
					{/* <div>{qrCodeValue}</div> */}
				</div>
				{/* </div> */}

				<div className="flex justify-end gap-4 pt-4">
					<button
						type="button"
						onClick={handlePrintQrSection}
						className="bg-blue-600 rounded-lg hover:cursor-pointer text-white px-4 py-2"
					>
						Print QR
					</button>
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="bg-gray-500 rounded-lg hover:cursor-pointer text-white px-4 py-2"
					>
						Back
					</button>
				</div>
			</form>
		</div>
	);
}
