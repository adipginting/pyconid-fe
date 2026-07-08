import { useState } from "react";
import type { TicketType } from "~/api/schema/ticket";
import { Hero } from "~/components/shared/hero/hero";
import { EarlyBirdTicketCard } from "~/components/shared/ticket/early-bird-ticket-card";
import { TicketCard } from "~/components/shared/ticket/ticket-card";
import { TicketErrorModal } from "~/components/shared/ticket/ticket-error-modal";
import { TicketPurchaseModal } from "~/components/shared/ticket/ticket-purchase-modal";
import { usePython } from "~/hooks/usePython";
import type { CredentialsData } from "~/types/auth";

export const Ticket = ({
	tickets,
	user,
	userTicketStatus,
}: {
	tickets: TicketType[];
	user: CredentialsData | null;
	userTicketStatus: "none" | "paid" | "unpaid";
}) => {
	const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
	const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [errorTitle, setErrorTitle] = useState("Unable to purchase ticket");
	usePython({ pyodideURL: "/assets" });

	const handleSelectTicket = (ticket: TicketType) => {
		if (!user) {
			setErrorTitle("Unable to purchase ticket");
			setErrorMessage("Please login to continue");
			setIsErrorModalOpen(true);
			return;
		}
		if (userTicketStatus === "paid") {
			setErrorTitle("Unable to purchase ticket");
			setErrorMessage(
				"Each account is eligible to purchase only one ticket. For multiple ticket purchase, please ask your friends to register individually.",
			);
			setIsErrorModalOpen(true);
			return;
		}
		if (userTicketStatus === "unpaid") {
			setErrorTitle("Payment Pending");
			setErrorMessage(
				"You have an unpaid ticket. Please complete your payment.",
			);
			setIsErrorModalOpen(true);
			return;
		}
		setSelectedTicket(ticket);
		setIsPurchaseModalOpen(true);
	};

	const handleClosePurchaseModal = () => {
		setIsPurchaseModalOpen(false);
		setSelectedTicket(null);
	};

	const handleCloseErrorModal = () => {
		setIsErrorModalOpen(false);
	};

	const isEarlyBird = (name: string) =>
		name.toLowerCase().includes("early bird");

	return (
		<>
			{/* Hero Section */}
			<Hero text="Buy PyCon ID 2026 Ticket" />
			{/* Ticket Grid Section */}
			<section className="bg-[#FAF9F7] py-20 lg:py-24">
				<div className="container mx-auto px-6 lg:px-12">
					<div className="flex flex-wrap justify-center gap-6">
						{tickets.map((ticket) =>
							isEarlyBird(ticket.name) ? (
								<EarlyBirdTicketCard
									key={ticket.id}
									name={ticket.name}
									price={ticket.price}
									description={ticket.description ?? ""}
									isSoldOut={ticket.is_sold_out}
									onSelect={() => handleSelectTicket(ticket)}
								/>
							) : (
								<TicketCard
									key={ticket.id}
									name={ticket.name}
									price={ticket.price}
									description={ticket.description ?? ""}
									isSoldOut={ticket.is_sold_out}
									onSelect={() => handleSelectTicket(ticket)}
								/>
							),
						)}
					</div>
				</div>
			</section>

			{/* Purchase Modal */}
			<TicketPurchaseModal
				isOpen={isPurchaseModalOpen}
				onClose={handleClosePurchaseModal}
				ticket={selectedTicket}
			/>

			{/* Error Modal */}
			<TicketErrorModal
				isOpen={isErrorModalOpen}
				onClose={handleCloseErrorModal}
				title={errorTitle}
				message={errorMessage}
			/>
		</>
	);
};
