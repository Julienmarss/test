"use client";
import * as React from "react";
import { Skeleton as HSkeleton } from "@heroui/react";

export const Skeleton = React.forwardRef<
  React.ElementRef<typeof HSkeleton>,
  React.ComponentPropsWithoutRef<typeof HSkeleton>
>((props, ref) => <HSkeleton ref={ref} {...props} />);
Skeleton.displayName = "Skeleton";
