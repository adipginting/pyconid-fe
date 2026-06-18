import { Footer } from "~/components/layouts/navigation/footer";
import { Header } from "~/components/layouts/navigation/header";
import { TermsOfServiceSection } from "~/components/sections/terms-of-service/terms-of-service";

export function meta() {
	return [
		{ title: "PyCon ID Terms of Service" },
		{
			name: "PyCon ID Terms of Service",
			content: "Terms of Service page",
		},
	];
}

export default function TermsOfService() {
	return (
		<main>
			<Header />
			<TermsOfServiceSection />
			<Footer />
		</main>
	);
}
