import { UUID } from "node:crypto";

export type EventCategoryResponse = {
	id: UUID;
	sequence: number;
	icon: string;
	title: string;
	subtitle: string;
	action: string;
	color: string;
};
