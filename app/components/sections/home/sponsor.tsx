import { useQuery } from "@tanstack/react-query";
import { getPatrons } from "~/api/endpoint/.client/patron";
import {
	type PatronListResponseItem,
	patronListResponseSchema,
	patronTierSchema,
} from "~/api/schema/patron";

const tierOrder = patronTierSchema.options;

const getPatronImageUrl = (id: string) => {
	const baseUrl = (import.meta.env.VITE_BASE_API ?? "").replace(/\/$/, "");
	return `${baseUrl}/patron/${encodeURIComponent(id)}/image/`;
};

const groupPatronsByTier = (patrons: PatronListResponseItem[]) => {
	return patrons.reduce<Record<string, PatronListResponseItem[]>>(
		(grouped, patron) => {
			if (!grouped[patron.tier]) {
				grouped[patron.tier] = [];
			}
			grouped[patron.tier].push(patron);
			return grouped;
		},
		{},
	);
};

export const SponsorSection = () => {
	const { data: patrons = [] } = useQuery({
		queryKey: ["patrons"],
		queryFn: async () => {
			const response = await getPatrons();
			if (!response.ok) {
				throw new Error("Failed to fetch patron data");
			}

			const result = patronListResponseSchema.parse(await response.json());
			return result.results;
		},
	});

	const patronsByTier = groupPatronsByTier(patrons);
	const tiers = [
		...tierOrder,
		...Object.keys(patronsByTier).filter(
			(tier) => !tierOrder.includes(tier as (typeof tierOrder)[number]),
		),
	];

	return (
		<section className="pt-12 mb-10 sm:pt-36 relative">
			<div className="container mx-auto text-white px-5 2xl:px-0">
				<div className="flex flex-col items-center">
					<div className="h-max mb-6 md:mb-6 md:top-12 text-center">
						<p className="text-black font-medium text-2xl md:text-3xl mb-4">
							We appreciate your support!
						</p>
						<h1 className="text-black font-bold text-4xl md:text-[2.5rem] lg:text-[3.5rem] leading-tight mb-10">
							Help us make this conference truly unforgettable
						</h1>
						<a
							href="https://pycon.id/sponsor-us"
							target="_blank"
							rel="noreferrer"
						>
							<button
								type="button"
								className="cursor-pointer text-2xl px-8 py-4 font-bold bg-black hover:bg-black/50 transition-all duration-300"
							>
								Be Our Sponsor
							</button>
						</a>
					</div>

					<div className="p-5 text-center text-bold text-black text-2xl max-w-2xl">
						<div>
							<h3 className="mb-5 font-bold text-4xl">Our Sponsor</h3>
							<div className="grid grid-cols-1 gap-8">
								{tiers.map((tier) => {
									const tierPatrons = patronsByTier[tier];
									if (!tierPatrons?.length) return null;

									return (
										<div
											key={tier}
											className="grid grid-cols-1 w-full items-center justify-center gap-5"
										>
											<p className="text-xl font-medium capitalize">
												{tier} Sponsor
											</p>
											<div className="flex flex-wrap items-center justify-center gap-8">
												{tierPatrons.map((patron) => (
													<div
														key={patron.id}
														className="flex min-h-24 min-w-40 items-center justify-center"
													>
														{patron.has_image ? (
															<img
																src={getPatronImageUrl(patron.id)}
																alt={patron.name}
																className="object-contain max-h-35 max-w-60"
															/>
														) : (
															<span>{patron.name}</span>
														)}
													</div>
												))}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
