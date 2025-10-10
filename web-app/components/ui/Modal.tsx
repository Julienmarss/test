import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {cn} from "@/utils/lib";

type Props = {
    title: string;
    subtitle?: string;
    open: boolean;
    onClose: (open: boolean) => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
    closable?: boolean;
};
export const Modal = ({open, onClose, title, subtitle, children, footer, closable = true}: Props) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="h-full md:max-w-[80vw] md:h-auto p-0 gap-0 z-[200]" closable={closable}>
                <DialogHeader>
                    <DialogTitle className="text-center flex flex-col gap-2 font-semibold text-sky-900 border-b p-4">
                        {title}
                        {subtitle && <span className="text-sm text-sky-600 font-normal">{subtitle}</span>}
                    </DialogTitle>
                </DialogHeader>

                <div className={cn("flex justify-center items-center bg-gray-50 overflow-y-auto", !footer && "min-h-[80vh]")}>
                    {children}
                </div>

                {footer &&
                    <div className="flex justify-end items-center py-4 px-8 bg-white">
                        {footer}
                    </div>
                }
                {closable && <DialogClose/>}
            </DialogContent>
        </Dialog>
    );
};