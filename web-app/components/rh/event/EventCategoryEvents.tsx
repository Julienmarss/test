import { UUID } from "node:crypto";
import { Input } from "@/components/ui/hero-ui/Input";
import EventProposal from "./EventProposal";
import { useMemo, useState } from "react";
import { Search } from "@/components/ui/icons/Search";
import EventProposalSkeleton from "./EventProposalSkeleton";
import { useRouter } from "next/navigation";
import { useTriggerEvent, useEventCategoryEvents } from "@/api/event/events.api";

function normalize(s: string) {
	return s
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase();
}

export default function EventCategoryEvents({
	categoryId,
	collaboratorId,
	color,
	icon,
}: {
	categoryId: UUID;
	collaboratorId: UUID;
	color: string;
	icon: string;
}) {
	const [searchValue, setSearchValue] = useState("");
	const [pendingId, setPendingId] = useState<string | null>(null);

	const { data: eventCategoryEvents, isPending } = useEventCategoryEvents(categoryId, collaboratorId);
	const { mutate: addEvent, isPending: isAddPending, reset } = useTriggerEvent();

	const router = useRouter();

	const filtered = useMemo(() => {
		if (!eventCategoryEvents) return [];
		if (!searchValue) return eventCategoryEvents;
		const q = normalize(searchValue);
		return eventCategoryEvents.filter((e) => normalize(e.title).includes(q) || normalize(e.subtitle).includes(q));
	}, [eventCategoryEvents, searchValue]);

	const onStartEvent = (templateEventId: UUID) => {
		setPendingId(templateEventId);
		addEvent(
			{ collaboratorId, templateEventId },
			{
				onSuccess: ({ collaboratorEventId }) => {
					router.push(`/rh/event/${collaboratorEventId}`);
				},
				onError: () => {
					setPendingId(null);
					reset();
				},
			},
		);
	};

	return (
		<section className="flex flex-col gap-5">
			<Input
				className="sticky top-0 z-50 w-full text-sm"
				placeholder="Rechercher un évènement..."
				value={searchValue}
				onValueChange={setSearchValue}
				isClearable
				startContent={<Search className="mr-1" />}
			/>
			<div>
				{isPending ? (
					<>
						<EventProposalSkeleton icon={icon} color={color} />
						<EventProposalSkeleton icon={icon} color={color} />
						<EventProposalSkeleton icon={icon} color={color} />
					</>
				) : (
					<>
						{filtered.map((ev) => {
							const loading = isAddPending && pendingId === ev.id;
							return (
								<EventProposal
									key={`event-${ev.id}`}
									title={ev.title}
									subtitle={ev.subtitle}
									color={color}
									icon={icon}
									onStartEvent={() => onStartEvent(ev.id)}
									isLoading={loading}
									isDisabled={isAddPending}
								/>
							);
						})}
						{filtered.length === 0 && <p className="mt-8 text-center text-sm text-gray-500">Aucun évènement trouvé.</p>}
					</>
				)}
			</div>
		</section>
	);
}
