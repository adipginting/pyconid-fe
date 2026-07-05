import { redirect } from "react-router";
import { getPayment } from "~/api/endpoint/.server/payment";
import { getUserTicket } from "~/api/endpoint/.server/user_ticket";
import { paymentResponseSchema } from "~/api/schema/payment";
import { userTicketResponseSchema } from "~/api/schema/user_ticket";
import { Footer } from "~/components/layouts/navigation/footer";
import { UserTicketSection } from "~/components/sections/user-ticket";
import { authenticator } from "~/services/auth/$.server";
import type { Route } from "./+types/user-ticket";

export function meta() {
	return [
		{ title: "Ticket Detail for PyCon ID 2026" },
		{
			name: "PyCon ID 2026 Ticket Detail Page",
			content: "Ticket Detail Page for PyconID 2026",
		},
	];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
	const credentials = await authenticator.isAuthenticated(request);
	if (!credentials) {
		return redirect("/login");
	}

	const [dataUserTicket, dataPayment] = await Promise.all([
		getUserTicket({ request }),
		getPayment({ request }),
	]);
	const jsonUserTicket = await dataUserTicket.json();
	const jsonPayment = await dataPayment.json();
	const userTicket = userTicketResponseSchema.parse(jsonUserTicket);
	const payment = paymentResponseSchema.parse(jsonPayment);

	const url = new URL(request.url);
	const origin = url.origin;

	return { userTicket, payment, origin };
};

export default function TicketDetail(componentProps: Route.ComponentProps) {
	return (
		<main className="bg-[#FAF9F7]">
			<UserTicketSection componentProps={componentProps} />
			<Footer />
		</main>
	);
}
