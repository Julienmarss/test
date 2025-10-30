"use client";

import ActionList from "../action/ActionList";
import { useEvent } from "@/components/utils/EventProvider";
import EventContainer from "./EventContainer";
import { Button } from "@/components/ui/hero-ui/Button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@/components/ui/hero-ui/Modal";
import DocumentationHelper from "./DocumentationHelper";
import { useDeleteEvent } from "@/api/event/events.api";
import { useRouter } from "next/navigation";

export default function EventClient() {
	const { event } = useEvent();
	const router = useRouter();
	const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const handleRemoveEvent = (onClose: () => void) => {
		deleteEvent(
			{ collaboratorId: event.collaboratorId, eventId: event.id },
			{
				onSuccess: () => {
					onClose();
					router.push("/rh/events");
				},
			},
		);
	};

	return (
		<EventContainer
			title={event.eventTemplate.title}
			footer={
				<>
					<Button type="button" color="danger" intent="outline" onPress={onOpen}>
						Annuler l'évènement
					</Button>
					<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
						<ModalContent>
							{(onClose) => (
								<>
									<ModalHeader onClose={onClose}>Annuler l'évènement</ModalHeader>
									<ModalBody className="py-8">
										Êtes-vous sûr de vouloir annuler cet évènement ?
										<br />
										Sa suppression est définitive
									</ModalBody>
									<ModalFooter>
										<Button intent="plain" onPress={onClose}>
											Annuler
										</Button>
										<Button color="danger" onPress={() => handleRemoveEvent(onClose)} isLoading={isDeleting}>
											Annuler l'évènement
										</Button>
									</ModalFooter>
								</>
							)}
						</ModalContent>
					</Modal>
				</>
			}
		>
			<ActionList actions={event.eventTemplate.actions} />
			<DocumentationHelper documentationUrl={event.eventTemplate.documentationUrl} />
		</EventContainer>
	);
}
