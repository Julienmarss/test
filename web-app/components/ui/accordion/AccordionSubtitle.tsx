import { cn } from "@/utils/lib";

export default function AccordionSubtitle({className, children}: { className?: string, children: React.ReactNode  }) {
    return (
        <p className={cn(
            "text-sky-600 text-xs p-0 m-0 pb-4",
            className
        )}>
            {children}
        </p>
    )
}