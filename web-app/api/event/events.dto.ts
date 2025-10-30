import { FieldValue } from "@/utils/fieldValueFormat";
import { UUID } from "node:crypto";

export enum ActionStatus {
	PENDING,
	IN_PROGRESS,
	COMPLETED,
}

export type ActionState = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export type FieldType = "DATE" | "AMOUNT" | "NUMBER" | "SELECTION" | "BOOLEAN";
export type SelectionType = string;

export type FieldSource =
	| "MANUAL_INPUT"
	| "AUTOMATICALLY_CALCULATED"
	| "PREFILLED_FROM_EMPLOYEE_FILE"
	| "PREFILLED_FROM_CONTRACT";

export type FieldValidation = {
	required?: boolean;
	minimumAmount?: number;
	maximumAmount?: number;
	minimumNumber?: number;
	maximumNumber?: number;
	minimumDate?: string;
	maximumDate?: string;
};

export type FieldDto = {
	fieldType: FieldType;
	selectionType?: SelectionType;
	id: string;
	label: string;
	value?: FieldValue;
	options?: string[];
	source?: FieldSource;
	expectedFormat?: string;
	businessRule?: string;
	validation?: FieldValidation;
};

export type ExportOption = "DOWNLOAD" | "LRAR" | "MAIL" | "ESIGN";

export type DocumentState = "NOT_GENERATED" | "GENERATED" | "PROCESSED";

export type ActionDocument = {
	templateId: UUID;
	state?: DocumentState;
	label: string;
	generatorAction: string;
	exportOptions?: ExportOption[];
};

export type ActionDto = {
	id: UUID;
	title: string;
	state?: ActionState;
	availabilityDate?: string;
	dependencies?: UUID[];
	fields?: FieldDto[];
	documents?: ActionDocument[];
};

export type EventTemplate = {
	id: UUID;
	eventCategoryId?: UUID;
	collaboratorId?: string;
	title: string;
	subtitle: string;
	actions?: ActionDto[];
	documentationUrl?: string;
};

export type CollaboratorEvent = {
	id: UUID;
	collaboratorId: UUID;
	eventTemplate: EventTemplate;
};

export type TriggeredFieldValue = {
	fieldId: string;
	value: unknown;
};

export type TriggeredActionData = {
	actionId: UUID;
	fieldValues: TriggeredFieldValue[];
};

export type TriggeredEvent = {
	collaboratorEventId: UUID;
	triggeredEventId: UUID;
	actionsData: TriggeredActionData[];
};

export type CompleteTriggeredEventFieldValue = {
	fieldId: string;
	value: unknown;
};

export type CompleteTriggeredEventAction = {
	actionId: UUID;
	fieldValues: CompleteTriggeredEventFieldValue[];
};

export type CompleteTriggeredEventPayload = {
	actionsData: CompleteTriggeredEventAction[];
};

export type EventOverview = {
	id: UUID;
	title: string;
	subtitle: string;
	actions?: ActionDto[];
};

export type EventDocData = {
	arrayBuffer?: ArrayBuffer; // docx-preview
	url?: string; // fallback iframe
	mimeType: string;
	fileName?: string;
};
