import { CollaboratorResponse } from "@/api/collaborator/collaborators.dto";
import { useSendMailCollaboratorToComplete } from "@/api/collaborator/collaborators.api";
import { ReactNode, useState } from "react";
import { LegipilotSubscriptionEnum } from "@/api/company/company.api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getStatusBorderColor } from "@/app/(app)/admin/components/table.service";
import { useSelectedCompany } from "../../utils/CompanyProvider";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "../../ui/hero-ui/Modal";
import ModalChoice from "../../ui/modal-choice/ModalChoice";
import { useCategories } from "@/api/event-categories/event-categories.api";
import EventCategoryEvents from "../event/EventCategoryEvents";
import { EventCategoryResponse } from "@/api/event-categories/event-categories.dto";

export default function EventCategoriesModal({
	collaboratorSelected,
	onOpen,
	isOpen,
	onOpenChange,
	onClose,
	footer,
}: {
	collaboratorSelected: CollaboratorResponse;
	onOpen: () => void;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onClose: () => void;
	footer?: ReactNode;
}) {
	const { mutate: sendEmail, isPending: isSendPending } = useSendMailCollaboratorToComplete();
	const router = useRouter();

	const { data: categories } = useCategories(); // Pas besoin de pending car chargement quand la modal est encore fermée

	const { company } = useSelectedCompany();

	// TODO: Gérer l'abonnement au Copilote RH
	const isRHUnlocked = true; //company?.subscription?.includes(LegipilotSubscriptionEnum.RH);

	const [selectedCategory, setSelectedCategory] = useState<EventCategoryResponse | null>(null);

	return (
		<>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" className="mx-0 h-[85vh] max-w-[70vw]">
				<ModalContent>
					<ModalHeader
						onClose={onClose}
						showReturn={selectedCategory !== null}
						onReturn={() => setSelectedCategory(null)}
					>
						<h1>{selectedCategory !== null ? selectedCategory.title : "Mes Actions"}</h1>
						<button
							type="button"
							onClick={() => router.push(`/admin/collaborator/${collaboratorSelected.id}`)}
							className="flex h-7 cursor-pointer items-center justify-start gap-1 rounded-full border border-gray-200 pl-1 pr-2 transition hover:bg-gray-100"
						>
							{collaboratorSelected.picture && collaboratorSelected.picture.length > 0 ? (
								<img
									src={collaboratorSelected.picture}
									alt={collaboratorSelected.firstname + " " + collaboratorSelected.lastname}
									className={`h-[19px] w-[19px] rounded-full ${getStatusBorderColor(collaboratorSelected?.status)}`}
								/>
							) : (
								<div
									className={`flex h-[19px] w-[19px] items-center justify-center rounded-full border border-green-300 bg-blue-100 text-blue-700 ${getStatusBorderColor(collaboratorSelected?.status)}`}
								>
									<p className={`!text-[8px] font-semibold !leading-[8px] tracking-normal`}>
										{collaboratorSelected.firstname.charAt(0).toUpperCase()}
										{collaboratorSelected.lastname.charAt(0).toUpperCase()}
									</p>
								</div>
							)}
							<p className="text-xs font-semibold">
								{collaboratorSelected.firstname} {collaboratorSelected.lastname.toUpperCase()}
							</p>
						</button>
					</ModalHeader>
					<ModalBody className="relative max-h-[70vh] min-h-[50vh] overflow-auto p-0 transition [&>*]:p-8">
						<motion.div layout className="h-full">
							<AnimatePresence mode="wait">
								{selectedCategory === null ? (
									<motion.div
										key="list"
										layout
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										transition={{ duration: 0.18, ease: "easeOut" }}
										className="flex h-full flex-row flex-wrap content-center items-center justify-center gap-6"
									>
										{categories !== undefined &&
											categories.map((category: EventCategoryResponse) => (
												<ModalChoice
													key={category.id}
													icon={category.icon}
													title={category.title}
													subtitle={category.subtitle}
													buttonLabel={category.action}
													onClick={() => {
														setSelectedCategory(category);
													}}
													color={category.color}
													isLocked={!isRHUnlocked}
												/>
											))}
										<ModalChoice
											icon="envelope"
											title="Inviter le collaborateur"
											subtitle="Inviter le collaborateur à remplir lui-même sa fiche"
											buttonLabel="Inviter"
											onClick={() => {
												if (company && collaboratorSelected) {
													sendEmail({ companyId: company.id, collaboratorId: collaboratorSelected.id });
												}
											}}
											isLoading={isSendPending}
										/>
									</motion.div>
								) : (
									<motion.div
										key="detail"
										layout
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 20 }}
										transition={{ duration: 0.18, ease: "easeOut" }}
									>
										<EventCategoryEvents
											collaboratorId={collaboratorSelected.id}
											categoryId={selectedCategory.id}
											color={selectedCategory.color}
											icon={selectedCategory.icon}
										/>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					</ModalBody>
					{selectedCategory === null && <ModalFooter>{footer}</ModalFooter>}
				</ModalContent>
			</Modal>
		</>
	);
}
