"use client";

import { useState } from "react";
import { ActionDto } from "@/api/event/events.dto";
import EventContainer from "../event/EventContainer";
import Action404 from "@/app/(app)/rh/event/[eventId]/action/[actionId]/404";
import DocumentProposal from "./document/DocumentProposal";
import { Form } from "@/components/ui/hero-ui/Form";
import { useTriggeredEvent } from "@/api/event/events.api";
import { useEvent } from "@/components/utils/EventProvider";
import ActionForm from "./ActionForm";
import ActionSubmit from "./ActionSubmit";
import { useActionState } from "./useActionState";

export default function ActionClient({ action }: { action?: ActionDto }) {
	if (!action) return <Action404 />;

	const { event } = useEvent();
	const { data: triggeredEventData, isPending: isTriggeredEventPending } = useTriggeredEvent(event?.id);

	const { title, fields, setFieldValue, documents, allDocumentsCompleted, isLoading } = useActionState({
		action,
		triggeredEventData,
		isTriggeredEventPending,
	});

	return (
		<Form className="relative w-full gap-0">
			<EventContainer title={title} footer={<ActionSubmit canSubmit={allDocumentsCompleted} />}>
				<div className="grid grid-cols-2 gap-6 rounded-xl border border-gray-200 bg-white p-8">
					<ActionForm fields={fields} isLoading={isLoading} onFieldChange={setFieldValue} />

					<section className="col-span-2 rounded-lg border border-gray-100 bg-white [&>div]:border-b [&>div]:border-gray-100 last:[&>div]:border-b-0 odd:[&>div]:bg-gray-50">
						{documents.map((document) => (
							<DocumentProposal key={`document-${document.templateId}`} document={document} />
						))}
					</section>
				</div>
			</EventContainer>
		</Form>
	);
}
