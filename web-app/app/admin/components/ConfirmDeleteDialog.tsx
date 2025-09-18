import { Button } from "@/components/ui/buttons/Button";
import { OutlineButton } from "@/components/ui/buttons/OutlineButton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FC } from "react";

interface ConfirmDeleteDialogProps {
    open: boolean;
    setOpen: (value:boolean) => void;
    handleConfirm:() => void;
}

const ConfirmDeleteDialog: FC<ConfirmDeleteDialogProps> = ({ open, setOpen,handleConfirm }) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Supprimer le profil</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce profil ? <br />
                        Cette action est irréversible et toutes vos données seront
                        perdues.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex justify-end space-x-2 mt-4 gap-2 md:gap-0">
                    <OutlineButton variant="outline" onClick={() => setOpen(false)}>
                        Annuler
                    </OutlineButton>
                    <Button variant="destructive" onClick={handleConfirm}>
                        Confirmer la suppression
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default ConfirmDeleteDialog;