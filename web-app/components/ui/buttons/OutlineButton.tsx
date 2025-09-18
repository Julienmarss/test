import {forwardRef} from "react";
import {Button, ButtonProps} from "./Button";
import {cn} from "@/utils/lib";

export const OutlineButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({className, variant, size, asChild = false, icon, children, ...props}, ref) => {
        return (
            <Button
                className={cn("bg-white hover:bg-sky-50 text-sky-950 border-gray-200 border font-semibold", className)}
                ref={ref} {...props}>
                {icon}
                {children}
            </Button>
        )
    }
)