import { useInvitations } from "@/api/company/invitation.api";
import { Accordion, AccordionItem } from "@/components/ui/accordion/Accordion";
import { Envelope } from "@/components/ui/icons/Envelope";
import { useSelectedCompany } from "@/components/utils/CompanyProvider";
import CreateInvitation from "./create-invitation/CreateInvitation";
import PendingInvitation from "./pending-invitation/PendingInvitation";

export default function Invitation() {
	const { company } = useSelectedCompany();

	const { data: invitations = [], isLoading, isError } = useInvitations(company.id);

	return (
		<Accordion>
			<AccordionItem
				aria-label="Invitations"
				title="Invitations"
				startContent={<Envelope className="size-6 text-gray-400" />}
				className="flex flex-col gap-4"
			>
				<div className="flex flex-col gap-6">
					<CreateInvitation />

					<PendingInvitation isLoading={isLoading} isError={isError} invitations={invitations} />
				</div>
			</AccordionItem>
		</Accordion>
	);
}
