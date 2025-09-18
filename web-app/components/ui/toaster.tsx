"use client"

import {useToast} from "@/hooks/use-toast"
import {Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport,} from "@/components/ui/toast"
import {AlertTriangleIcon, CheckCircleIcon, InfoIcon, Loader, XCircleIcon} from "lucide-react";
import {cn} from "@/utils/lib";
import {JSX} from "react";

type ToastVariant = "success" | "error" | "info" | "warning" | "default" | "destructive" | "wip";

const successAndDefault = {
    icon: <CheckCircleIcon className="text-green-600 w-5 h-5 mt-0.5"/>,
    bg: "bg-white",
    text: "text-gray-900",
    description: "text-gray-500",
};

const errorAndDestructive = {
    icon: <XCircleIcon className="text-red-600 w-5 h-5 mt-0.5"/>,
    bg: "bg-white",
    text: "text-gray-900",
    description: "text-gray-500",
};

const variantStyles: Record<
    ToastVariant,
    {
        icon: JSX.Element
        bg: string
        text: string
        description: string
    }
> = {
    default: successAndDefault,
    success: successAndDefault,
    error: errorAndDestructive,
    destructive: errorAndDestructive,
    info: {
        icon: <InfoIcon className="text-blue-600 w-5 h-5 mt-0.5"/>,
        bg: "bg-white",
        text: "text-gray-900",
        description: "text-gray-500",
    },
    wip: {
        icon: <Loader className="text-blue-600 w-5 h-5 mt-0.5 animate-spin"/>,
        bg: "bg-white",
        text: "text-gray-900",
        description: "text-gray-500",
    },
    warning: {
        icon: <AlertTriangleIcon className="text-yellow-600 w-5 h-5 mt-0.5"/>,
        bg: "bg-white",
        text: "text-gray-900",
        description: "text-gray-500",
    },
}

export function Toaster() {
    const {toasts} = useToast()

    return (
        <ToastProvider>
            {toasts.map(({id, title, description, variant = "success", ...props}) => {
                const styles = variantStyles[variant!]
                return (
                    <Toast
                        key={id}
                        {...props}
                        className={cn(
                            "shadow-lg rounded-xl p-4 w-[360px] flex items-start gap-4 border",
                            styles.bg
                        )}
                    >
                        <div>{styles.icon}</div>
                        <div className="flex-1 grid gap-1">
                            {title && (
                                <ToastTitle className={cn("font-semibold text-sm", styles.text)}>
                                    {title}
                                </ToastTitle>
                            )}
                            {description && (
                                <ToastDescription className={cn("text-sm", styles.description)}>
                                    {description}
                                </ToastDescription>
                            )}
                        </div>
                        <ToastClose className="text-gray-400 hover:text-gray-600 transition"/>
                    </Toast>
                )
            })}
            <ToastViewport className="fixed top-4 right-4 flex flex-col gap-3 z-50"/>
        </ToastProvider>


    )
}
