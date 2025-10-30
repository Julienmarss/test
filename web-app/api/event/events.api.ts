import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { serviceClient } from "@/api/client.api";
import {
	CollaboratorEvent,
	CompleteTriggeredEventAction,
	CompleteTriggeredEventPayload,
	EventDocData,
	EventOverview,
	TriggeredEvent,
} from "./events.dto";
import { mockFetchDoc } from "./events.mock";
import { UUID } from "node:crypto";
import { serverGet } from "../server.api";

const USE_MOCK = true;

export function useEventCategoryEvents(categoryId: string, collaboratorId: string) {
	return useQuery({
		queryKey: ["event", categoryId, collaboratorId],
		queryFn: async () => {
			// if (USE_MOCK) return mockEventCategoryEvents();
			const response = await serviceClient.get<EventOverview[]>(
				`/collaborators/${collaboratorId}/events?categoryId=${categoryId}`,
			);
			return response.data;
		},
	});
}

export function useCollaboratorEvents(collaboratorId: string) {
	return useQuery({
		queryKey: ["event", collaboratorId],
		queryFn: async () => {
			// if (USE_MOCK) return mockCollaboratorEvents();
			const response = await serviceClient.get<EventOverview[]>(`/collaborators/${collaboratorId}/events/active`);
			return response.data;
		},
	});
}

export async function getEvent(eventId: string) {
	//if (USE_MOCK) return mockEvent(eventId);
	const event = await serverGet<CollaboratorEvent>(`/event/${eventId}`);
	return event;
}

export function useTriggerEvent() {
	return useMutation({
		mutationFn: async ({ collaboratorId, templateEventId }: { collaboratorId: UUID; templateEventId: UUID }) => {
			// if (USE_MOCK) return mockTriggerEvent();
			const response = await serviceClient.post<TriggeredEvent>(
				`/collaborators/${collaboratorId}/events/${templateEventId}`,
			);
			return response.data;
		},
	});
}

export function useTriggeredEvent(triggeredEventId?: string) {
	return useQuery({
		queryKey: ["triggered-event", triggeredEventId],
		enabled: Boolean(triggeredEventId),
		queryFn: async () => {
			const response = await serviceClient.get<TriggeredEvent>(`/triggered-events/${triggeredEventId}`);
			return response.data;
		},
	});
}

export function useCompleteTriggeredEvent(triggeredEventId?: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["triggered-event-complete", triggeredEventId],
		mutationFn: async (payload: CompleteTriggeredEventPayload) => {
			if (!triggeredEventId) {
				throw new Error("triggeredEventId is required to complete triggered event");
			}

			const response = await serviceClient.put<TriggeredEvent>(`/triggered-events/${triggeredEventId}/complete`, {
				actionsData: payload.actionsData.map((action) => ({
					actionId: { value: action.actionId },
					fieldValues: action.fieldValues.map((field) => ({
						fieldId: { value: field.fieldId },
						value: field.value ?? null,
					})),
				})),
			});
			return response.data;
		},
		onSuccess: (data, _variables, context) => {
			if (triggeredEventId) {
				queryClient.setQueryData(["triggered-event", triggeredEventId], data);
			}
			return context;
		},
	});
}

export function useDeleteEvent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ collaboratorId, eventId }: { collaboratorId: UUID; eventId: UUID }) => {
			await serviceClient.delete(`/collaborators/${collaboratorId}/events/${eventId}`);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["event", variables.collaboratorId] });
		},
	});
}

// Variante A (URL signée): GET renvoie { url }
// Variante B (binaire): GET renvoie l’arraybuffer
async function fetchFromBackend(eventId: string, documentId: string): Promise<EventDocData> {
	// === Variante A: endpoint qui renvoie une URL signée ===
	try {
		const resp = await serviceClient.get<{ url: string; fileName?: string; mimeType?: string }>(
			`/events/${eventId}/documents/${documentId}`,
		);
		const { url, fileName, mimeType } = resp.data || {};
		if (url) {
			// si c'est une URL, on refetch le binaire pour docx-preview
			const res = await fetch(url);
			const buf = await res.arrayBuffer();
			return {
				arrayBuffer: buf,
				url,
				fileName: fileName ?? `document-${documentId}.docx`,
				mimeType: mimeType ?? res.headers.get("content-type") ?? "application/octet-stream",
			};
		}
	} catch {
		/* on tentera la variante B */
	}

	// === Variante B: endpoint qui renvoie directement le binaire ===
	const resp = await serviceClient.get<ArrayBuffer>(`/events/${eventId}/documents/${documentId}/download`, {
		responseType: "arraybuffer",
	});
	const mime = (resp as any)?.headers?.["content-type"] ?? "application/octet-stream";
	const fileName =
		/filename\*?=(?:UTF-8''|")?([^\";]+)/i.exec((resp as any)?.headers?.["content-disposition"] || "")?.[1] ||
		`document-${documentId}`;

	return { arrayBuffer: resp.data, mimeType: mime, fileName };
}

export function useEventDocumentForViewer(eventId?: string, documentId?: string) {
	return useQuery({
		queryKey: ["event-doc", eventId, documentId],
		enabled: !!eventId && !!documentId,
		queryFn: async () => {
			if (USE_MOCK) return mockFetchDoc();
			return fetchFromBackend(eventId!, documentId!);
		},
	});
}

export async function handleDownload(data: EventDocData) {
	try {
		if (data?.arrayBuffer) {
			const blob = new Blob([data.arrayBuffer], { type: data.mimeType || "application/octet-stream" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = data.fileName || "document.docx";
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
			return;
		}
		// Fallback si pas d'arrayBuffer mais une URL publique
		if (data?.url) {
			const res = await fetch(data.url);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const blob = await res.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = data.fileName || "document";
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		}
	} catch (e) {
		// ici tu peux déclencher un toast si tu veux
		console.error(e);
	}
}
