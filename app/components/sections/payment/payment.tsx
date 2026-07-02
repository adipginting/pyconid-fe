import type { Route } from ".react-router/types/app/routes/auth/+types/payment";
import { Eye } from "lucide-react";
import { Link } from "react-router";
import { DashboardMenu } from "~/components/shared/dashboard-menu";
import { Hero } from "~/components/shared/hero/hero";

const statusColorMap: Record<string, string> = {
	success: "#22835F",
	paid: "#22835F",
	processing: "#224083",
	pending: "#224083",
	canceled: "#E81919",
	cancelled: "#E81919",
	failed: "#E81919",
	expired: "#E81919",
};

export const PaymentSection = ({
	componentProps,
}: {
	componentProps: Route.ComponentProps;
}) => {
	const { payment } = componentProps.loaderData;

	const getStatusColor = (status: string) => {
		return statusColorMap[status.toLowerCase()] || "#282828";
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	return (
		<div className="min-h-[calc(100dvh-120px)]">
			<Hero text="My Ticket" nav=<DashboardMenu /> />

			<section className="w-full mx-auto px-6 lg:px-12 py-10">
				<Link
					to="/auth/dashboard"
					className="text-blue-600 underline mb-6 inline-block text-sm"
				>
					&larr; Back to Dashboard
				</Link>

				<h1
					className="text-[32px] font-extrabold text-[#282828] mb-10"
					style={{ letterSpacing: "-3.13%" }}
				>
					Ticket Transactions List
				</h1>

				<div className="bg-white rounded-lg overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full min-w-[900px]">
							<thead>
								<tr className="border-y border-black/15">
									<th className="text-left p-3 text-[#909090] text-sm font-bold min-w-[180px]">
										Transaction ID
									</th>
									<th className="text-left p-3 text-[#909090] text-sm font-bold min-w-[120px]">
										Date
									</th>
									<th className="text-left p-3 text-[#909090] text-sm font-bold min-w-[200px]">
										Ticket Type
									</th>
									<th className="text-left p-3 text-[#909090] text-sm font-bold min-w-[140px]">
										Status
									</th>
									<th className="text-left p-3 text-[#909090] text-sm font-bold min-w-[200px]">
										Payment Link
									</th>
									<th className="text-left p-3 text-[#909090] text-sm font-bold min-w-[100px]">
										View Ticket
									</th>
								</tr>
							</thead>
							<tbody>
								{payment.results.map((txn) => (
									<tr key={txn.id} className="border-b border-black/15">
										<td className="p-3 text-[#282828] text-sm">{txn.id}</td>
										<td className="p-3 text-[#282828] text-sm">
											{formatDate(txn.created_at)}
										</td>
										<td className="p-3 text-[#282828] text-sm">
											{txn.ticket ? txn.ticket.name : "-"}
										</td>
										<td
											className="p-3 text-sm font-bold"
											style={{ color: getStatusColor(txn.status) }}
										>
											{txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
										</td>
										<td className="p-3 text-[#282828] text-sm">
											{txn.payment_link ? (
												<a
													href={txn.payment_link}
													className="text-blue-600 underline break-all"
													target="_blank"
													rel="noopener noreferrer"
												>
													{txn.payment_link}
												</a>
											) : (
												<span className="text-[#909090]">no payment link</span>
											)}
										</td>
										<td className="p-3 text-center">
											{txn.status.toLowerCase() === "paid" ||
											txn.status.toLowerCase() === "success" ? (
												<Link
													to="/auth/user-ticket"
													className="inline-flex items-center justify-center text-[#282828] hover:text-[#224083] transition-colors"
													title="View Ticket"
												>
													<Eye size={20} />
												</Link>
											) : null}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<p className="text-[#909090] text-center mt-4 text-sm">
					NB: List of your recent transactions
				</p>
			</section>
		</div>
	);
};
