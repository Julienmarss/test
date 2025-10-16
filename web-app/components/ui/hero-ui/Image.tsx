"use client";
import { Image as HImage } from "@heroui/react";
import * as React from "react";

export const Image = React.forwardRef<React.ElementRef<typeof HImage>, React.ComponentPropsWithoutRef<typeof HImage>>(
	(props, ref) => <HImage ref={ref} {...props} className="rounded-none" />,
);

Image.displayName = "Image";
