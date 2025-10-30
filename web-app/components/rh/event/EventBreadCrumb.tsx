"use client";

import { useEvent } from "@/components/utils/EventProvider";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EventBreadcrumb() {
	const { event } = useEvent();
	const params = useParams<{ actionId?: string }>();
	const actionId = params?.actionId;
	const action =
		actionId && event?.eventTemplate?.actions !== undefined
			? event.eventTemplate.actions.find((a) => a.id === actionId)
			: undefined;

	return (
		<>
			<Link href="/rh" className="hover:text-slate-900">
				Copilote RH
			</Link>
			<ChevronRight className="h-4 w-4" />
			<Link href="/rh/events" className="text-slate-700 hover:text-slate-900">
				Évènements
			</Link>
			<ChevronRight className="h-4 w-4" />
			{action ? (
				<>
					<Link href={`/rh/event/${event.id}`} className="text-slate-700 hover:text-slate-900">
						{event.eventTemplate.title}
					</Link>
					<ChevronRight className="h-4 w-4" />
					<span className="text-xs text-slate-700">{action.title}</span>
				</>
			) : (
				<span className="text-xs text-slate-700">{event.eventTemplate.title}</span>
			)}
		</>
	);
}
