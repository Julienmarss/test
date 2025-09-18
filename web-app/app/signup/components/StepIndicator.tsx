'use client';

import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

type Step = {
    number: number;
    title: string;
    subtitle: string;
};

type StepIndicatorProps = {
    steps: Step[];
    currentStep: number;
};

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    const isMobile = useIsMobile();
    const [allSteps, setAllSteps] = useState<Step[]>([]);

    useEffect(() => {
        if (isMobile) {
            setAllSteps([steps.find((item) => item.number === currentStep) as Step])
        } else {
            setAllSteps(steps);
        }
    }, [isMobile, steps, currentStep])

    return (
        <ol className="flex w-full rounded-lg border border-gray-200 bg-white overflow-hidden text-sm text-gray-700 mx-3">
            {allSteps.map((step, index) => {
                const isActive = index < currentStep;
                const isLast = index === steps.length - 1;

                return (
                    <li
                        key={index}
                        className="relative flex w-full items-center px-8 py-2.5"
                    >
                        {/* Chevron en fond */}
                        {!isLast && !isMobile && (
                            <div className="absolute right-0 top-0 h-full w-5 overflow-hidden">
                                <svg
                                    className="h-full w-full text-gray-200"
                                    viewBox="0 0 10 100"
                                    preserveAspectRatio="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M0,0 L10,50 L0,100"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                    />
                                </svg>
                            </div>
                        )}

                        {/* Cercle numéroté */}
                        <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mr-4 shrink-0
                                ${isActive ? 'bg-blue-100 text-gray-900' : 'border-2 border-gray-300 text-gray-900'}
                              `}
                        >
                            {isMobile ? currentStep : index + 1}
                        </div>

                        {/* Titre + sous-titre */}
                        <div>
                            <p className={`font-medium ${isActive ? 'text-sky-600' : 'text-gray-500'}`}>
                                {`Étape ${isMobile ? currentStep : index + 1}`}
                            </p>
                            <p className={`text-sm ${isActive ? 'text-gray-900' : 'text-gray-500'} text-gray-500 w-max`}>{step.subtitle}</p>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}