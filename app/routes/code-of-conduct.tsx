import { Footer } from "~/components/layouts/navigation/footer";
import { Header } from "~/components/layouts/navigation/header";
import { CodeOfConductSection } from "~/components/sections/code-of-conduct/code-of-conduct";

export function meta() {
	return [
		{ title: "PyCon ID Code of Conduct" },
		{
			name: "PyCon ID Code of Conduct",
			content: "Code of Conduct page",
		},
	];
}

export default function CodeOfConduct() {
	return (
		<main>
			<Header />
			<CodeOfConductSection />
			<Footer />
		</main>
	);
}
