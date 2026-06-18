import { Main as MainLayout } from "~/components/layouts/app/main";
import { InternalErrorSection } from "~/components/sections/internal-error/internal-error";

export function meta() {
	return [
		{ title: "PyCon ID Internal Error" },
		{ name: "Internal error page", content: "Internal error page" },
	];
}

export default function InternalError() {
	return (
		<MainLayout className="bg-[#F1F1F1]">
			<InternalErrorSection />
		</MainLayout>
	);
}
