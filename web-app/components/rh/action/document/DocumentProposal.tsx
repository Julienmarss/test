import { ActionDocument, ExportOption } from "@/api/event/events.dto";
import { Button } from "@/components/ui/hero-ui/Button";
import { Checkbox } from "@/components/ui/hero-ui/Checkbox";
import { Form } from "@/components/ui/hero-ui/Form";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@/components/ui/hero-ui/Modal";
import ArrowDownTray from "@/components/ui/icons/ArrowDownTray";
import ArrowUpRight from "@/components/ui/icons/ArrowUpRight";
import { DocumentPlus } from "@/components/ui/icons/DocumentPlus";
import EventDocViewer from "./EventDocViewer";
import { useEvent } from "@/components/utils/EventProvider";
import { handleDownload, useEventDocumentForViewer } from "@/api/event/events.api";
import { FormEvent, useMemo, useState } from "react";
import LaPoste from "@/components/ui/icons/LaPoste";
import Yousign from "@/components/ui/icons/Yousign";
import UnavailableTooltip from "../../../ui/UnavailableTooltip";
import CheckCirclePlain from "@/components/ui/icons/CheckCirclePlain";

type ConfirmationModal = {
	title: string;
	body: string;
	action: ExportOption;
};

const DOCUMENT_STATE_LABELS: Record<string, string> = {
	NOT_GENERATED: "Non disponible",
	GENERATED: "Disponible",
	PROCESSED: "Traité",
};

function isActionDisabled(state?: string): boolean {
	return state === "NOT_GENERATED";
}

function hasBeenProcessed(state?: string): boolean {
	return state === "PROCESSED";
}

export default function DocumentProposal({ document }: { document: ActionDocument }) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const eventId = useEvent().event.id;
	const { data, isPending, isError } = useEventDocumentForViewer(eventId, document.templateId);
	const [hasCheckedIsAuthor, setHasCheckedIsAuthor] = useState(false);

	const [confirmationModal, setConfirmationModal] = useState<ConfirmationModal | null>(null);
	const [isConfirmLoading, setIsConfirmLoading] = useState(false);

	const {
		isOpen: isConfirmOpen,
		onOpen: onConfirmOpen,
		onClose: onConfirmClose,
		onOpenChange: onConfirmOpenChange,
	} = useDisclosure();

	const exportOptions = useMemo(() => document.exportOptions ?? [], [document.exportOptions]);

	function openConfirm(action: ExportOption) {
		switch (action) {
			case "ESIGN":
				setConfirmationModal({
					action,
					title: "Envoyer en signature électronique",
					body:
						"Êtes-vous sûr de vouloir envoyer ce document en signature électronique ?\n" +
						"Vous serez facturé de la somme d’un euro (1 €).",
				});
				break;

			case "LRAR":
				setConfirmationModal({
					action,
					title: "Envoyer en LRAR",
					body:
						"Êtes-vous sûr de vouloir envoyer ce document en Lettre Recommandée avec Accusé de Réception ?\n" +
						"Le coût est de dix euros (10 €).",
				});
				break;

			case "MAIL":
				setConfirmationModal({
					action,
					title: "Envoyer par courrier postal",
					body:
						"Êtes-vous sûr de vouloir envoyer ce document par courrier simple ?\n" +
						"Le coût est de trois euros (3 €).",
				});
				break;

			default:
				return;
		}
		onConfirmOpen();
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const submitter = (e.nativeEvent as unknown as SubmitEvent).submitter as HTMLButtonElement | null;
		const action = submitter?.dataset.action as ExportOption | undefined;

		switch (action) {
			case "DOWNLOAD":
				if (data) handleDownload(data);
				break;

			case "ESIGN":
				openConfirm("ESIGN");
				break;

			case "LRAR":
				openConfirm("LRAR");
				break;

			case "MAIL":
				openConfirm("MAIL");
				break;

			default:
				break;
		}
	};

	const handleConfirm = async () => {
		if (!confirmationModal) return;
		setIsConfirmLoading(true);

		try {
			switch (confirmationModal.action) {
				case "ESIGN":
					console.log("Envoi en esign");
					await new Promise((resolve) => setTimeout(resolve, 1000));
					break;

				case "LRAR":
					console.log("Envoi en LRAR");
					await new Promise((resolve) => setTimeout(resolve, 1000));
					break;

				case "MAIL":
					console.log("Envoi en Courrier");
					await new Promise((resolve) => setTimeout(resolve, 1000));
					break;
			}
		} finally {
			setIsConfirmLoading(false);
			onConfirmClose();
		}
	};

	const tooltipContent = "Veuillez certifier être l'auteur en cochant en bas à gauche";
	const disabled = isActionDisabled(document.state);
	const processed = hasBeenProcessed(document.state);

	return (
		<div className="flex items-center justify-between gap-4 p-4 pl-6">
			<div className="flex items-center gap-6">
				<DocumentPlus className="size-5 text-gray-400" />
				<div className="flex flex-col gap-1">
					<p className="text-sm font-medium leading-5 tracking-normal text-gray-900">{document.label}</p>
					<p className="text-xs text-gray-500">{DOCUMENT_STATE_LABELS[document.state ?? "GENERATED"]}</p>
				</div>
			</div>
			<Button
				intent="outline"
				className="group"
				isDisabled={disabled}
				endContent={
					<ArrowUpRight className="end-content size-3 text-gray-400 transition-transform group-hover:translate-x-1" />
				}
				startContent={processed && <CheckCirclePlain className="size-4 text-green-600" />}
				onPress={onOpen}
			>
				{document.generatorAction}
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full" hideCloseButton scrollBehavior="inside">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader onClose={onClose}>{document.label}</ModalHeader>
							<ModalBody>
								<EventDocViewer data={data} isPending={isPending} isError={isError} />
							</ModalBody>
							<ModalFooter>
								<Form className="flex w-full flex-row items-center justify-between" onSubmit={handleSubmit}>
									<Checkbox isRequired isSelected={hasCheckedIsAuthor} onValueChange={setHasCheckedIsAuthor}>
										<p className="text-nowrap">
											Je certifie être l'auteur du document<sup className="text-red-500">*</sup>
										</p>
									</Checkbox>
									<div className="flex flex-wrap justify-end gap-2">
										<Button intent="plain" onPress={onClose}>
											Annuler
										</Button>
										{exportOptions.includes("DOWNLOAD") && (
											<UnavailableTooltip hideTooltip={hasCheckedIsAuthor} content={tooltipContent}>
												<Button
													color="primary"
													type="submit"
													data-action="DOWNLOAD"
													isDisabled={isPending || !hasCheckedIsAuthor}
													endContent={<ArrowDownTray className="size-4 text-white" />}
												>
													Télécharger
												</Button>
											</UnavailableTooltip>
										)}
										{exportOptions.includes("ESIGN") && (
											<UnavailableTooltip hideTooltip={hasCheckedIsAuthor} content={tooltipContent}>
												<Button
													color="primary"
													type="submit"
													isDisabled={!hasCheckedIsAuthor}
													data-action="ESIGN"
													className="bg-[#5DE8C1] text-[#00101A] hover:bg-[#5DE8C1] data-[hover=true]:opacity-50"
													endContent={<Yousign className="size-4" />}
												>
													Signer électroniquement
												</Button>
											</UnavailableTooltip>
										)}
										{exportOptions.includes("LRAR") && (
											<UnavailableTooltip hideTooltip={hasCheckedIsAuthor} content={tooltipContent}>
												<Button
													color="primary"
													type="submit"
													isDisabled={!hasCheckedIsAuthor}
													data-action="LRAR"
													className="bg-[#FFCC00] text-[#00101A] hover:bg-[#FFCC00] data-[hover=true]:opacity-50"
													endContent={<LaPoste className="size-12" />}
												>
													Envoyer en LRAR
												</Button>
											</UnavailableTooltip>
										)}
										{exportOptions.includes("MAIL") && (
											<UnavailableTooltip hideTooltip={hasCheckedIsAuthor} content={tooltipContent}>
												<Button
													color="primary"
													type="submit"
													isDisabled={!hasCheckedIsAuthor}
													data-action="MAIL"
													className="bg-[#FFCC00] text-[#00101A] hover:bg-[#FFCC00] data-[hover=true]:opacity-50"
													endContent={<LaPoste className="size-12" />}
												>
													Envoyer par courrier postal
												</Button>
											</UnavailableTooltip>
										)}
									</div>
								</Form>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			<Modal isOpen={isConfirmOpen} onOpenChange={onConfirmOpenChange} hideCloseButton>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader onClose={onClose}>{confirmationModal?.title}</ModalHeader>
							<ModalBody>{confirmationModal?.body}</ModalBody>
							<ModalFooter>
								<Button intent="plain" onPress={onClose}>
									Annuler
								</Button>
								<Button color="primary" onPress={handleConfirm} isLoading={isConfirmLoading}>
									Confirmer
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
