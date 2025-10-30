"use client";

import { LegipilotSubscriptionEnum } from "@/api/company/company.api";
import NoSubscription from "@/components/rh/NoSubscription";
import { useSelectedCompany } from "@/components/utils/CompanyProvider";
import { useRouter } from "next/navigation";

export default function RHPage() {
	const { company } = useSelectedCompany();
	const router = useRouter();
	// TODO: Gérer l'abonnement au Copilote RH
	const isRHUnlocked = true; //company?.subscription?.includes(LegipilotSubscriptionEnum.RH);

	if (isRHUnlocked) {
		return (
			<div>
				<p>Copilote RH</p>
				<button onClick={() => router.push("/rh/events")}>Events liste</button>
			</div>
		);
	}

	return <NoSubscription onSubscribe={() => console.log("essaie de souscrire")} />;
}
