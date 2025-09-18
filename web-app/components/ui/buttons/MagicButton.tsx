import { ButtonHTMLAttributes, ReactNode, useState } from "react";
import { Button } from "./Button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Separator } from "../separator";
import Link from "next/link";
import ConfirmDeleteDialog from "@/app/admin/components/ConfirmDeleteDialog";
import { useDeleteCollaborator, useSendMailCollaboratorToComplete } from "@/api/collaborator/collaborators.api";
import { useCompany } from "@/components/utils/CompanyProvider";
import { UUID } from "crypto";
import { useRouter } from "next/navigation";

export function MagicButton({ children, collaboratorSelected, ...props }: { children: ReactNode, collaboratorSelected: UUID } & ButtonHTMLAttributes<HTMLButtonElement>) {
    const [openConfirm, setOpenConfirm] = useState(false);
    const { mutate: deleteCollaborator } = useDeleteCollaborator();
    const { mutate: sendEmail, isPending: isSendPending } = useSendMailCollaboratorToComplete();
    const { company } = useCompany()
    const router = useRouter();

    const handleConfirmDelete = async () => {
        await deleteCollaborator({
            collaboratorId: collaboratorSelected,
            companyId: company.id
        })
        setOpenConfirm(false);
        router.push("/admin")
    }
    return (
        <>
            <Popover>
                <PopoverTrigger className="w-full">
                    <Button variant="outline" className="flex items-center space-x-2 bg-sky-950 hover:bg-sky-700 font-medium border-1 " {...props}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-sky-200">
                            <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white">
                            {children}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <div className="flex flex-col gap-3">
                        <Button onClick={() => {
                            if (company && collaboratorSelected) {
                                sendEmail({ companyId: company.id, collaboratorId: collaboratorSelected })
                            }
                        }}
                            className="flex gap-3 bg-transparent hover:bg-transparent pt-4 px-4"
                            disabled={isSendPending}
                        >
                            <svg width="14" height="10" viewBox="0 0 14 10" className="size-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.5 0C0.671573 0 0 0.671573 0 1.5V2.29294C0.0256828 2.30204 0.051129 2.31264 0.0762339 2.32476L6.67411 5.50994C6.88011 5.60939 7.12023 5.60939 7.32623 5.50994L13.9241 2.32476C13.9491 2.31269 13.9744 2.30214 14 2.29306V1.5C14 0.671573 13.3284 0 12.5 0H1.5Z" fill="#99A1AF" />
                                <path d="M14 3.95377L7.97836 6.86077C7.36036 7.15911 6.63999 7.15911 6.02199 6.86077L0 3.9536V8.5C0 9.32843 0.671573 10 1.5 10H12.5C13.3284 10 14 9.32843 14 8.5V3.95377Z" fill="#99A1AF" />
                            </svg>
                            <span className="text-sm text-gray-700">Inviter le collaborateur à compléter son profil</span>
                        </Button>
                        <Separator className="bg-gray-200" />
                        <Button onClick={() => { setOpenConfirm(true) }} className="flex gap-3 bg-transparent hover:bg-transparent pb-4 px-4 justify-start">
                            <svg width="12" height="14" viewBox="0 0 12 14" className="size-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M3 2.25V3H0.75C0.335786 3 0 3.33579 0 3.75C0 4.16421 0.335786 4.5 0.75 4.5H1.05L1.86493 12.6493C1.94161 13.4161 2.58685 14 3.35748 14H8.64252C9.41315 14 10.0584 13.4161 10.1351 12.6493L10.95 4.5H11.25C11.6642 4.5 12 4.16421 12 3.75C12 3.33579 11.6642 3 11.25 3H9V2.25C9 1.00736 7.99264 0 6.75 0H5.25C4.00736 0 3 1.00736 3 2.25ZM5.25 1.5C4.83579 1.5 4.5 1.83579 4.5 2.25V3H7.5V2.25C7.5 1.83579 7.16421 1.5 6.75 1.5H5.25ZM4.05044 5.00094C4.46413 4.98025 4.81627 5.29885 4.83696 5.71255L5.11195 11.2125C5.13264 11.6262 4.81404 11.9784 4.40034 11.9991C3.98665 12.0197 3.63451 11.7011 3.61383 11.2875L3.33883 5.78745C3.31814 5.37376 3.63674 5.02162 4.05044 5.00094ZM7.95034 5.00094C8.36404 5.02162 8.68264 5.37376 8.66195 5.78745L8.38696 11.2875C8.36627 11.7011 8.01413 12.0197 7.60044 11.9991C7.18674 11.9784 6.86814 11.6262 6.88883 11.2125L7.16383 5.71255C7.18451 5.29885 7.53665 4.98025 7.95034 5.00094Z" fill="#99A1AF" />
                            </svg>
                            <span className="text-sm text-gray-700">Supprimer</span>
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
            {openConfirm && <ConfirmDeleteDialog open={openConfirm} setOpen={setOpenConfirm} handleConfirm={handleConfirmDelete} />}
        </>
    )
}