import { Accordion, AccordionItem } from "@/components/ui/accordion/Accordion";
import { UserGroup } from "@/components/ui/icons/UserGroup";
import RightToAdminTable from "./RightToAdminTable";

export default function RightToAdminContainer() {
	return (
		<Accordion>
			<AccordionItem
				key="1"
				aria-label="Administrateurs de votre entreprise"
				title="Administrateurs de votre entreprise"
				startContent={<UserGroup className="size-6 text-gray-400" />}
				className="flex flex-col gap-4"
			>
				<div className="flex flex-col gap-6">
					<RightToAdminTable />
				</div>
			</AccordionItem>
		</Accordion>
	);
}
