import InvitationContainer from "@/components/invitation/InvitationContainer";
import { Image } from "@/components/ui/hero-ui/Image";
import { UUID } from "node:crypto";
import { use } from "react";

export default function InvitationPage({ searchParams }: { searchParams: Promise<{ token: UUID }> }) {
	const token = use(searchParams).token;
	return (
		<main className="grid min-h-screen grid-cols-1 gap-4 bg-sky-900 p-4 lg:grid-cols-2 [&>section]:rounded-lg">
			<section className="bg-white">
				<InvitationContainer token={token} />
			</section>
			<section className="hidden h-full items-center bg-slate-300 p-4 lg:flex">
				<Image
					alt="Image donnant des informations sur la connexion"
					src="https://legipilot-documents.s3.fr-par.scw.cloud/public/prod/visuals/Illustration-Connexion.png"
					width="100%"
				/>
			</section>
		</main>
	);
}
