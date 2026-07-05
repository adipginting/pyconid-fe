import { Footer } from "~/components/layouts/navigation/footer";
import { Header } from "~/components/layouts/navigation/header";
import { InternalErrorSection } from "~/components/sections/internal-error/internal-error";

export function meta() {
	return [
		{ title: "PyCon ID Internal Error" },
		{ name: "description", content: "Internal server error" },
	];
}

export default function InternalError() {
	return (
		<div className="flex min-h-dvh flex-col bg-[#FAF9F7]">
			<Header />
			<main className="flex flex-1 items-center justify-center px-6 py-16 lg:px-12 lg:py-[62px]">
				<InternalErrorSection />
			</main>
			<Footer />
		</div>
	);
}
