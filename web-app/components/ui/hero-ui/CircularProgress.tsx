"use client";

import * as React from "react";
import { CircularProgress as HCircularProgress } from "@heroui/react";

type HCircularProgressProps = React.ComponentProps<typeof HCircularProgress>;

export const CircularProgress = React.forwardRef<HTMLDivElement, HCircularProgressProps>(function CircularProgress(
	{ children, ...rest },
	ref,
) {
	return (
		<HCircularProgress ref={ref} {...rest}>
			{children}
		</HCircularProgress>
	);
});

CircularProgress.displayName = "CircularProgress";
