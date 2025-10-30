"use client";

import * as React from "react";
import {
	Avatar as HAvatar,
	AvatarGroup as HAvatarGroup,
} from "@heroui/react";

export const Avatar = React.forwardRef<
	any,
	React.ComponentPropsWithoutRef<typeof HAvatar>
>(({ children, ...rest }, ref) => (
	<HAvatar ref={ref as any} {...rest}>
		{children}
	</HAvatar>
));
Avatar.displayName = "Avatar";

export { HAvatarGroup as AvatarGroup };
