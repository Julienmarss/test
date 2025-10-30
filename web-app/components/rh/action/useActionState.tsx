import { useState, useMemo, useEffect, useCallback } from "react";
import { ActionDto, CompleteTriggeredEventPayload, FieldDto, TriggeredEvent } from "@/api/event/events.dto";
import { toStableString, FieldValue } from "@/utils/fieldValueFormat";
import { useCompleteTriggeredEvent } from "@/api/event/events.api";
import { useDebouncedCallback } from "use-debounce";
import { UUID } from "node:crypto";

type UseActionStateArgs = {
	action: ActionDto;
	triggeredEventData?: TriggeredEvent;
	isTriggeredEventPending: boolean;
};

export function useActionState({ action, triggeredEventData, isTriggeredEventPending }: UseActionStateArgs) {
	const triggeredEventId = triggeredEventData?.triggeredEventId;

	const { mutate: completeTriggeredEvent } = useCompleteTriggeredEvent(triggeredEventId);

	const hydratedFieldsFromServer = useMemo(() => {
		if (!action.fields) return [];

		// Si on n'a pas encore les data du triggeredEvent, on renvoie juste les fields initiaux
		if (!triggeredEventData) {
			return action.fields;
		}

		// On va chercher le bloc d'action correspondant dans triggeredEventData
		const matchingActionData = triggeredEventData.actionsData?.find((a) => String(a.actionId) === String(action.id));

		if (!matchingActionData || !matchingActionData.fieldValues) {
			return action.fields;
		}

		// Mapping fieldId avec value
		const valueMap = new Map<string, unknown>();
		for (const fv of matchingActionData.fieldValues) {
			valueMap.set(fv.fieldId, fv.value);
		}

		// Liste de values des fields à partir des données de triggerEvent renvoyée
		return action.fields.map((f) => {
			if (!valueMap.has(f.id)) return f;
			const incomingStable = toStableString(f.fieldType, valueMap.get(f.id) as FieldValue);
			return { ...f, value: incomingStable };
		});
	}, [action.id, action.fields, triggeredEventData]);

	// Fields
	const [fields, setFields] = useState<FieldDto[]>(hydratedFieldsFromServer);

	useEffect(() => {
		if (isTriggeredEventPending) return;
		if (!fields || fields.length === 0) {
			setFields(hydratedFieldsFromServer);
			return;
		}

		let needsSync = false;
		if (fields.length !== hydratedFieldsFromServer.length) {
			needsSync = true;
		} else {
			for (let i = 0; i < fields.length; i++) {
				const before = fields[i];
				const after = hydratedFieldsFromServer[i];
				if (before.id !== after.id) {
					needsSync = true;
					break;
				}

				if ((before.value ?? "") === "" && (after.value ?? "") !== "") {
					needsSync = true;
					break;
				}
			}
		}

		if (needsSync) {
			setFields(hydratedFieldsFromServer);
		}
	}, [isTriggeredEventPending, hydratedFieldsFromServer, fields]);

	function buildCompletePayload(
		allFieldsForCurrentAction: FieldDto[],
		triggeredEventData: TriggeredEvent,
		currentActionId: string | UUID,
	): CompleteTriggeredEventPayload {
		const currentActionFieldValues = allFieldsForCurrentAction.map((f) => ({
			fieldId: f.id,
			value: f.value ?? null,
		}));

		const fullActionsData = triggeredEventData.actionsData.map((actionData) => {
			if (String(actionData.actionId) === String(currentActionId)) {
				return {
					actionId: actionData.actionId,
					fieldValues: currentActionFieldValues,
				};
			}
			return {
				actionId: actionData.actionId,
				fieldValues: actionData.fieldValues.map((fv) => ({
					fieldId: fv.fieldId,
					value: fv.value ?? null,
				})),
			};
		});

		return {
			actionsData: fullActionsData,
		};
	}

	const debouncedSyncToServer = useDebouncedCallback((payload: CompleteTriggeredEventPayload) => {
		completeTriggeredEvent(payload);
	}, 500);

	const setFieldValue = useCallback(
		(fieldId: string, newValue: FieldValue, fieldType?: FieldDto["fieldType"]) => {
			setFields((prevFields) => {
				const nextFields = prevFields.map((field) => {
					if (field.id !== fieldId) return field;

					const stableValue = toStableString(fieldType ?? field.fieldType, newValue);

					return {
						...field,
						value: stableValue,
					};
				});

				if (triggeredEventId && triggeredEventData) {
					const payload = buildCompletePayload(nextFields, triggeredEventData, action.id);

					debouncedSyncToServer(payload);
				}

				return nextFields;
			});
		},
		[triggeredEventId, triggeredEventData, action.id, debouncedSyncToServer],
	);

	const documents = action.documents ?? [];

	const allDocumentsCompleted = useMemo(() => {
		if (documents.length === 0) return true;
		return documents.every((doc) => doc.state === "PROCESSED");
	}, [documents]);

	return {
		title: action.title,
		fields,
		setFieldValue,
		documents,
		allDocumentsCompleted,
		isLoading: isTriggeredEventPending,
	};
}
