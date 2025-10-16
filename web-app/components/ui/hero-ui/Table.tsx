"use client";
import * as React from "react";
import {
	Table as HTable,
	TableHeader as HTableHeader,
	TableColumn as HTableColumn,
	TableBody as HTableBody,
	TableRow as HTableRow,
	TableCell as HTableCell,
} from "@heroui/react";

export const Table = React.forwardRef<React.ElementRef<typeof HTable>, React.ComponentPropsWithoutRef<typeof HTable>>(
	({ children, ...rest }, ref) => (
		<HTable
			ref={ref}
			{...rest}
			classNames={{
				wrapper: "shadow-none p-0 rounded-none",
				th: "text-sm bg-gray-100 font-medium text-gray-600 first:rounded-s-sm last:rounded-e-sm",
				td: "group-data-[odd=true]/tr:before:bg-gray-50 text-sm first:before:rounded-s-sm last:before:rounded-e-sm",
				tr: "rounded-sm",
			}}
		>
			{children}
		</HTable>
	),
);
Table.displayName = "Table";

export { HTableHeader as TableHeader };
export { HTableColumn as TableColumn };
export { HTableBody as TableBody };
export { HTableRow as TableRow };
export { HTableCell as TableCell };
