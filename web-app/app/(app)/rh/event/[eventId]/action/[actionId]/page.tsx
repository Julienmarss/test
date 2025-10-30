"use client";

import ActionClient from "@/components/rh/action/ActionClient";
import { useEvent } from "@/components/utils/EventProvider";
import { useParams } from "next/navigation";

export default function ActionPage() {
	const { event } = useEvent();

	const { actionId } = useParams<{ actionId: string }>();

	return <ActionClient action={event.eventTemplate.actions?.find((a) => a.id === actionId)} />;
}
