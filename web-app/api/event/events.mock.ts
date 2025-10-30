import { UUID } from "node:crypto";
import {
	CollaboratorEvent,
	EventDocData,
	EventOverview,
	FieldDto,
	ActionDto,
	ExportOption,
	ActionStatus,
} from "./events.dto";

const nowIso = () => new Date().toISOString();

const mockFields: FieldDto[] = [
	{
		fieldType: "DATE",
		id: "hire_date",
		label: "Date d'embauche",
		value: "2022-03-18",
		source: "PREFILLED_FROM_EMPLOYEE_FILE",
		expectedFormat: "JJ/MM/AAAA",
		businessRule: "Récupérée depuis la fiche salarié",
		validation: { required: true },
	},
	{
		fieldType: "AMOUNT",
		id: "avg_12_months",
		label: "Moyenne des 12 derniers mois de salaires bruts",
		source: "MANUAL_INPUT",
		expectedFormat: "Ex. 2 450,00 €",
		businessRule: "Inclure primes selon règles applicables",
		validation: { required: true, minimumAmount: 0 },
	},
	{
		fieldType: "SELECTION",
		selectionType: "SendingMethod",
		id: "sending_choice",
		label: "Choix de l'envoi",
		options: ["REGISTERED_MAIL", "HAND_DELIVERY"],
		source: "MANUAL_INPUT",
		validation: { required: true },
	},
];

const mockActions: ActionDto[] = [
	{
		id: "214f6c35-4782-4014-949e-c65decfed1c9" as UUID,
		title: "Paramétrage & calculs",
		state: "COMPLETED",
		availabilityDate: nowIso(),
		dependencies: [],
		fields: mockFields,
		documents: [
			{
				templateId: "328b95c8-342c-4b73-8d25-1356414e4371" as UUID,
				state: "NOT_GENERATED",
				label: "Convocation à l'entretien préalable",
				generatorAction: "Générer la convocation",
				exportOptions: ["DOWNLOAD", "MAIL", "LRAR"],
			},
			{
				templateId: "6004e57e-f3d6-47df-9a11-bfabb8ada89f" as UUID,
				state: "PROCESSED",
				label: "Résumé des indemnités",
				generatorAction: "Consulter le résumé",
				exportOptions: ["DOWNLOAD", "ESIGN"],
			},
		],
	},
];

export function mockEvent(eventId: string): Promise<CollaboratorEvent> {
	const payload: CollaboratorEvent = {
		id: eventId as UUID,
		collaboratorId: "214f6c35-4782-4014-949e-c65decfed1c9" as UUID,
	eventTemplate: {
		id: "6a891796-6388-447f-97fc-abf9dd386a52" as UUID,
		eventCategoryId: "24c7e8a1-7b2f-4c9d-8a33-5e6f1d0a9b13" as UUID,
		title: "Licenciement pour faute simple",
		subtitle: "Licencier un salarié pour une faute simple",
		documentationUrl: "https://docs.legipilot.fr/licenciement-faute-simple",
		actions: mockActions,
	},
};

	return new Promise((resolve) => setTimeout(() => resolve(payload), 400));
}

export function mockEventCategoryEvents(): Promise<EventOverview[]> {
	const data: EventOverview[] = [
		{
			id: "759b33bb-100d-40d2-856d-781b6b29f4d5" as UUID,
			title: "Licenciement pour faute simple",
			subtitle: "Licencier un salarié pour une faute simple",
		},
		{
			id: "0d9b0a22-7a3f-4b1a-8a6a-2a9b8a6a1c11" as UUID,
			title: "Licenciement pour faute grave",
			subtitle: "Procédure et convocation à l’entretien préalable",
		},
	];

	return new Promise((resolve) => setTimeout(() => resolve(data), 200));
}

export function mockCollaboratorEvents(): Promise<EventOverview[]> {
	const data: EventOverview[] = [
		{
			id: "6a891796-6388-447f-97fc-abf9dd386a51",
			title: "Licenciement pour faute grave",
			subtitle: "Licencier un salarié pour une faute grave",
			actions: [
				{
					id: "214f6c35-4782-4014-949e-c65decfed1c9",
					title: "Paramétrage & calculs",
					state: "COMPLETED",
					availabilityDate: "from:actionId.fieldId",
					dependencies: [],
				},
				{
					id: "214f6c35-4782-4014-949e-c65decfed1c9",
					title: "Paramétrage & calculs",
					state: "IN_PROGRESS",
					availabilityDate: "from:actionId.fieldId",
					dependencies: [],
				},
				{
					id: "214f6c35-4782-4014-949e-c65decfed1c9",
					title: "Paramétrage & calculs",
					state: "IN_PROGRESS",
					availabilityDate: "from:actionId.fieldId",
					dependencies: [],
				},
				{
					id: "214f6c35-4782-4014-949e-c65decfed1c9",
					title: "Paramétrage & calculs",
					state: "IN_PROGRESS",
					availabilityDate: "from:actionId.fieldId",
					dependencies: [],
				},
			],
		},
		{
			id: "6a891796-6388-447f-97fc-abf9dd386a51",
			title: "Licenciement pour faute grave",
			subtitle: "Licencier un salarié pour une faute grave",
			actions: [
				{
					id: "214f6c35-4782-4014-949e-c65decfed1c9",
					title: "Paramétrage & calculs",
					state: "COMPLETED",
					availabilityDate: "from:actionId.fieldId",
					dependencies: [],
				},
				{
					id: "214f6c35-4782-4014-949e-c65decfed1c9",
					title: "Paramétrage & calculs",
					state: "IN_PROGRESS",
					availabilityDate: "from:actionId.fieldId",
					dependencies: [],
				},
			],
		},
		{
			id: "6a891796-6388-447f-97fc-abf9dd386a51",
			title: "Licenciement pour faute grave",
			subtitle: "Licencier un salarié pour une faute grave",
			actions: [
				{
					id: "214f6c35-4782-4014-949e-c65decfed1c9",
					title: "Paramétrage & calculs",
					state: "COMPLETED",
					availabilityDate: "from:actionId.fieldId",
					dependencies: [],
				},
				{
					id: "214f6c35-4782-4014-949e-c65decfed1c9",
					title: "Paramétrage & calculs",
					state: "COMPLETED",
					availabilityDate: "from:actionId.fieldId",
					dependencies: [],
				},
				{
					id: "214f6c35-4782-4014-949e-c65decfed1c9",
					title: "Paramétrage & calculs",
					state: "COMPLETED",
					availabilityDate: "from:actionId.fieldId",
					dependencies: [],
				},
				{
					id: "214f6c35-4782-4014-949e-c65decfed1c9",
					title: "Paramétrage & calculs",
					state: "IN_PROGRESS",
					availabilityDate: "from:actionId.fieldId",
					dependencies: [],
				},
			],
		},
	];

	// Simule un délai réseau
	return new Promise((resolve) => setTimeout(() => resolve(data), 2000));
}

export function mockTriggerEvent(): Promise<{ collaboratorEventId: UUID }> {
	const data: { collaboratorEventId: UUID } = { collaboratorEventId: "6a891796-6388-447f-97fc-abf9dd386a51" as UUID };
	return new Promise((resolve) => setTimeout(() => resolve(data), 300));
}
export async function mockFetchDoc(): Promise<EventDocData> {
	let url: string;
	try {
		url = new URL("./exemple-lettre-licenciement.docx", import.meta.url).toString();
	} catch {
		url = "/exemple-lettre-licenciement.docx";
	}
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Mock fetch failed: ${res.status}`);
	const buf = await res.arrayBuffer();

	await new Promise((resolve) => setTimeout(resolve, 1000));
	return {
		arrayBuffer: buf,
		url,
		mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		fileName: "lettre-licenciement-exemple.docx",
	};
}
