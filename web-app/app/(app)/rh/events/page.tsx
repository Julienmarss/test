"use client";

import HeaderBar from "@/components/HeaderBar";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EventsPage() {
	const router = useRouter();

	return (
		<>
			<HeaderBar
				breadcrumb={
					<>
						<Link href="/rh" className="hover:text-slate-900">
							Copilote RH
						</Link>

						<ChevronRight className="h-4 w-4" />

						<span className="text-xs text-slate-700">Évènements</span>
					</>
				}
				searchbar={<p>Searchbar</p>}
			/>
			<p>Page contenant la liste des évènements</p>
			<button
				className="border border-black"
				onClick={() => router.push(`/rh/event/${"6a891796-6388-447f-97fc-abf9dd386a51"}`)}
			>
				Exemple d'un évènement
			</button>
		</>
	);
}
