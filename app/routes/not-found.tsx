import { Main as MainLayout } from "~/components/layouts/app/main";
import { NotFoundSection } from "~/components/sections/not-found/not-found";

export function meta() {
	return [
		{ title: "PyCon ID Not Found" },
		{ name: "Not Found Page", content: "Not Found Page" },
	];
}

export default function NotFound() {
	return (
		<MainLayout className="bg-[#F1F1F1]">
			<NotFoundSection />
		</MainLayout>
	);
}
