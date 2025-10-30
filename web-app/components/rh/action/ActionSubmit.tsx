import { Button } from "@/components/ui/hero-ui/Button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@/components/ui/hero-ui/Modal";
import UnavailableTooltip from "@/components/ui/UnavailableTooltip";

export default function ActionSubmit({ canSubmit = false }: { canSubmit?: boolean }) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const handleConfirmSubmit = (onClose: () => void) => {
		onClose();
	};

	return (
		<>
			<UnavailableTooltip content="Il vous reste des champs ou des documents à traiter" hideTooltip={canSubmit}>
				<Button type="submit" onPress={onOpen} isDisabled={!canSubmit}>
					Valider l'étape
				</Button>
			</UnavailableTooltip>

			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader onClose={onClose}>Valider l'étape</ModalHeader>
							<ModalBody className="py-8">
								Êtes-vous sûr de vouloir valider cette étape ?
								<br />
								Cela la marquera comme terminée. Vous ne pourrez plus modifier le contenu.
							</ModalBody>
							<ModalFooter>
								<Button intent="plain" onPress={onClose}>
									Annuler
								</Button>
								<Button onPress={() => handleConfirmSubmit(onClose)}>Confirmer la validation</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
