import { ButtonHTMLAttributes, ReactNode, useState } from "react";
import { Button } from "../hero-ui/Button";
import { MagicStars } from "../icons/MagicStars";
import { useDisclosure } from "../hero-ui/Modal";
import { CollaboratorResponse } from "@/api/collaborator/collaborators.dto";
import { useRouter } from "next/navigation";
import { useDeleteCollaborator } from "@/api/collaborator/collaborators.api";
import { Trash } from "../icons/Trash";
import ConfirmDeleteDialog from "@/app/(app)/admin/components/ConfirmDeleteDialog";
import EventCategoriesModal from "@/components/rh/event-category/EventCategoriesModal";
import { useSelectedCompany } from "@/components/utils/CompanyProvider";

export function MagicButton({
	children,
	collaboratorSelected,
}: { children: ReactNode; collaboratorSelected: CollaboratorResponse } & ButtonHTMLAttributes<HTMLButtonElement>) {
	const { mutate: deleteCollaborator } = useDeleteCollaborator();
	const { company } = useSelectedCompany();
	const router = useRouter();
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const [openConfirm, setOpenConfirm] = useState(false);
	const handleConfirmDelete = () => {
		deleteCollaborator({
			collaboratorId: collaboratorSelected.id,
			companyId: company.id,
		});
		setOpenConfirm(false);
		router.push("/admin");
	};

	return (
		<>
			<Button intent="magic" startContent={<MagicStars />} onPress={onOpen}>
				{children}
			</Button>

			<EventCategoriesModal
				collaboratorSelected={collaboratorSelected}
				onOpen={onOpen}
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				onClose={onClose}
				footer={
					<Button
						onClick={() => {
							onClose();
							setOpenConfirm(true);
						}}
						intent="outline"
						startContent={<Trash className="size-5 text-red-900" />}
						className="border-red-200 text-red-900 hover:border-red-200 hover:bg-transparent hover:text-red-900 hover:!opacity-70"
					>
						Supprimer le collaborateur
					</Button>
				}
			/>
			{openConfirm && (
				<ConfirmDeleteDialog
					open={openConfirm}
					setOpen={(isOpen: boolean) => {
						setOpenConfirm(isOpen);
						onOpen();
					}}
					handleConfirm={handleConfirmDelete}
				/>
			)}
		</>
	);
}
