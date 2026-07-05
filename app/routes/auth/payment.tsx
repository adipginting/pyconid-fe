import { redirect } from "react-router";
import { getPayment } from "~/api/endpoint/.server/payment";
import { paymentResponseSchema } from "~/api/schema/payment";
import { Footer } from "~/components/layouts/navigation/footer";
import { Header } from "~/components/layouts/navigation/header";
import { PaymentSection } from "~/components/sections/payment/payment";
import { authenticator } from "~/services/auth/$.server";
import type { Route } from "./+types/payment";

export function meta() {
	return [
		{ title: "My Payment | PyCon ID 2026" },
		{
			name: "PyCon ID 2026 My Payment",
			content: "Payment transactions for PyCon ID 2026",
		},
	];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
	const credentials = await authenticator.isAuthenticated(request);
	if (!credentials) {
		return redirect("/login");
	}

	const dataPayment = await getPayment({ request });
	const jsonPayment = await dataPayment.json();
	const payment = paymentResponseSchema.parse(jsonPayment);
	return { payment };
};

export default function TicketPaymentPage(
	componentProps: Route.ComponentProps,
) {
	return (
		<main className="bg-[#FAF9F7]">
			<Header />
			<PaymentSection componentProps={componentProps} />
			<Footer />
		</main>
	);
}
