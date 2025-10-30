import { useQuery } from "@tanstack/react-query";
import { serviceClient } from "@/api/client.api";
import { mockEventCategories } from "./event-categories.mock";
import { EventCategoryResponse } from "./event-categories.dto";

const USE_MOCK = false;

export function useCategories() {
	return useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			if (USE_MOCK) return mockEventCategories();
			const response = await serviceClient.get<EventCategoryResponse[]>(`/event-categories`);
			return response.data.sort((a, b) => a.sequence - b.sequence);
		},
	});
}
