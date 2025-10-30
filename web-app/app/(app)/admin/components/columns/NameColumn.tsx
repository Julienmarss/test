import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

type Props = {
	filter?: string;
	setFilter: (value: string) => void;
};

const NameColumn = ({ filter, setFilter }: Props) => {
	const [open, setOpen] = useState(false);

	const handleChange = (value: boolean, type: string) => {
		setFilter(type === "asc" && value ? "asc" : "desc");
	};
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger>
				<div className="flex items-center space-x-1">
					<span>Nom</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-4"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
					</svg>
				</div>
			</PopoverTrigger>
			<PopoverContent>
				<section className="flex w-40 flex-col gap-4">
					<div className="flex items-center">
						<Checkbox
							className="text-white"
							checked={filter === "asc"}
							onCheckedChange={(value) => handleChange(value as boolean, "asc")}
						/>
						<span className="ml-2 text-sm text-gray-700">Ordre A-Z</span>
					</div>
					<div className="flex items-center">
						<Checkbox
							className="text-white"
							checked={filter === "desc"}
							onCheckedChange={(value) => handleChange(value as boolean, "desc")}
						/>
						<span className="ml-2 text-sm text-gray-700">Ordre Z-A</span>
					</div>
				</section>
			</PopoverContent>
		</Popover>
	);
};
export default NameColumn;
