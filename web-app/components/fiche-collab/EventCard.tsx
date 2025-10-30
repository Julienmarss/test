import { Accordion, AccordionItem } from "@/components/ui/accordion/Accordion";
import { Calendar } from "../ui/icons/Calendar";
import EventWithProgression from "./EventWithProgression";
import { UUID } from "node:crypto";
import { useCollaboratorEvents } from "@/api/event/events.api";
import EventWithProgressionSkeleton from "./EventWithProgressionSkeleton";

export default function EventCard({ collaboratorId }: { collaboratorId: UUID }) {
	const { data: events, isPending } = useCollaboratorEvents(collaboratorId);

	const count = events?.length ?? 0;
	const label = `Évènement${count > 1 ? "s" : ""} en cours`;

	if ((!events || count === 0) && !isPending) return null;

	return (
		<div className="col-span-2">
			<Accordion>
				<AccordionItem
					key="1" // Mandatory to expand by default
					aria-label={label}
					title={label}
					startContent={<Calendar className="size-6 text-gray-400" />}
					className="flex flex-col gap-4 rounded-lg"
				>
					{isPending ? (
						<>
							<EventWithProgressionSkeleton />
							<EventWithProgressionSkeleton />
							<EventWithProgressionSkeleton />
						</>
					) : (
						events!.map((event) => <EventWithProgression key={event.id} event={event} />)
					)}
				</AccordionItem>
			</Accordion>
		</div>
	);
}
