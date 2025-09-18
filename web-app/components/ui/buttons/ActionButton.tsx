import {forwardRef} from "react";
import {Button, ButtonProps} from "./Button";
import {cn} from "@/utils/lib";

export const ActionButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({className, variant, size, asChild = false, icon, children, ...props}, ref) => {
        return (
            <Button className={cn("bg-sky-600 hover:bg-sky-700 text-white flex items-center space-x-2", className)}
                    ref={ref} {...props}>
                {icon}
                {children}
            </Button>
        )
    }
)