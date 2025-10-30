import { ArrowRight } from "@/components/ui/icons/ArrowRight";
import InformationCircle from "@/components/ui/icons/InformationCircle";
import Link from "next/link";

export default function DocumentationHelper({ documentationUrl }: { documentationUrl?: string }) {
	if (!documentationUrl) return null;

	return (
		<div className="flex items-center justify-between gap-6 rounded-lg bg-blue-100 p-4">
			<div className="flex items-center justify-start gap-3">
				<InformationCircle className="size-5 text-blue-600" />
				<p className="text-sm font-medium leading-5 tracking-normal text-blue-900">
					Besoin d'aide pour votre évènement ? Consultez la ressource concernée.
				</p>
			</div>
			<Link
				href={documentationUrl}
				target="_blank"
				className="flex items-center gap-1 text-sm font-semibold leading-5 tracking-normal text-blue-900 hover:opacity-80 [&_.arrow-link]:hover:translate-x-1"
			>
				<p>Accéder</p>
				<ArrowRight className="arrow-link size-3 transition-transform" />
			</Link>
		</div>
	);
}
