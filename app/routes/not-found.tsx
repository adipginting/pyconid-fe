import { Footer } from "~/components/layouts/navigation/footer";
import { Header } from "~/components/layouts/navigation/header";
import { NotFoundSection } from "~/components/sections/not-found/not-found";

export function meta() {
	return [
		{ title: "PyCon ID Not Found" },
		{ name: "description", content: "Page not found" },
	];
}

export default function NotFound() {
	return (
		<div className="flex min-h-dvh flex-col bg-[#FAF9F7]">
			<Header />
			<main className="flex flex-1 items-center justify-center px-6 py-16 lg:px-12 lg:py-[62px]">
				<NotFoundSection />
			</main>
			<Footer />
		</div>
	);
}
