import { EventCategoryResponse } from "./event-categories.dto";

export function mockEventCategories(): Promise<EventCategoryResponse[]> {
	const data: EventCategoryResponse[] = [
		{
			sequence: 1,
			id: "936a9f9a-db1a-42f5-89ee-dc82955f75d0",
			icon: "paper",
			title: "Modifier le contrat de travail",
			subtitle: "Réaliser un avenant, modifier le contrat, ...",
			action: "Modifier",
			color: "blue",
		},
		{
			sequence: 2,
			id: "b2d3a0e7-2f86-4c6d-9d9b-7d5b7a2f0a11",
			icon: "calendar",
			title: "Gérer un événement RH",
			subtitle: "Arrêt maladie, congé, maternité, mutation, ...",
			action: "Gérer",
			color: "indigo",
		},
		{
			sequence: 3,
			id: "8f5a7d9e-1c2b-4a3e-9f80-2a4c7b6d5e12",
			icon: "refresh",
			title: "Simuler une rupture",
			subtitle: "Estimer dates, indemnités et étapes clés",
			action: "Simuler",
			color: "teal",
		},
		{
			sequence: 4,
			id: "24c7e8a1-7b2f-4c9d-8a33-5e6f1d0a9b13",
			icon: "clipboard",
			title: "Rompre un contrat de travail",
			subtitle: "Accompagne la procédure et les documents",
			action: "Commencer",
			color: "red",
		},
		{
			sequence: 5,
			id: "5e1a9f70-3b2c-4d8e-9a41-7c6b5a4d2e14",
			icon: "users-plus",
			title: "Embaucher votre salarié",
			subtitle: "Promesse d’embauche, contrat, DPAE, ...",
			action: "Embaucher",
			color: "green",
		},
	];

	// Simule un délai réseau
	return new Promise((resolve) => setTimeout(() => resolve(data), 300));
}
