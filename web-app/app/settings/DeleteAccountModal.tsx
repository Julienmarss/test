import {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/buttons/Button";
import {OutlineButton} from "@/components/ui/buttons/OutlineButton";
import {UUID} from "node:crypto";

type Props = {
    adminId: UUID;
    deleteAdmin: (id: UUID) => void;
};

export function DeleteAccountModal({adminId, deleteAdmin}: Props) {
    const [open, setOpen] = useState(false);

    const handleConfirm = () => {
        deleteAdmin(adminId);
        setOpen(false);
    };

    return (
        <>
            <Button variant="destructive" onClick={() => setOpen(true)}>
                Supprimer mon compte
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Supprimer votre compte</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer votre compte ? <br/>
                            Cette action est irréversible et toutes vos données seront
                            perdues.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex justify-end space-x-2 mt-4">
                        <OutlineButton variant="outline" onClick={() => setOpen(false)}>
                            Annuler
                        </OutlineButton>
                        <Button variant="destructive" onClick={handleConfirm}>
                            Confirmer la suppression
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
