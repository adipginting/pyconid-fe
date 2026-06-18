import { Footer } from "~/components/layouts/navigation/footer";
import { Header } from "~/components/layouts/navigation/header";
import { PrivacyPolicySection } from "~/components/sections/privacy-policy/privacy-policy";

export function meta() {
	return [
		{ title: "PyCon ID Privacy Policy" },
		{
			name: "PyCon ID Privacy Policy",
			content: "PrivacyPolicy page",
		},
	];
}

export default function PrivacyPolicy() {
	return (
		<main>
			<Header />
			<PrivacyPolicySection />
			<Footer />
		</main>
	);
}
