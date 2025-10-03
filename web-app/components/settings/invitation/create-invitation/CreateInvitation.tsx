import { CreateInvitationRequest, useAddInvitation } from "@/api/company/invitation.api";
import AccordionSubtitle from "@/components/ui/accordion/AccordionSubtitle";
import { Button } from "@/components/ui/hero-ui/Button";
import { Form } from "@/components/ui/hero-ui/Form";
import { Input } from "@/components/ui/hero-ui/Input";
import { Select, SelectItem } from "@/components/ui/hero-ui/Select";
import { PaperAirplane } from "@/components/ui/icons/PaperAirplane";
import { useCompany } from "@/components/utils/CompanyProvider";
import { toast } from "@/hooks/use-toast";

export default function CreateInvitation() {
	const { company } = useCompany();
	const addInvitation = useAddInvitation();

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const fd = new FormData(e.currentTarget);
		const email = (fd.get("email") as string | null)?.trim() ?? "";
		const right = (fd.get("right") as string | null)?.trim() ?? "";

		const payload: CreateInvitationRequest = { email, right };

		try {
			await addInvitation.mutateAsync({ invitation: payload, companyId: company.id });
			toast({
				title: "Invitation envoyée !",
				description: "La personne invitée a reçu l'invitation par email.",
				variant: "default",
			});

			(e.currentTarget as HTMLFormElement).reset();
		} catch (err) {
			toast({
				title: "Échec de l'envoi",
				description: "L'envoi de l'invitation a échoué.",
				variant: "destructive",
			});
		}
	};

	return (
		<div>
			<AccordionSubtitle>Nouvelle invitation</AccordionSubtitle>
			<Form onSubmit={onSubmit} className="flex flex-col items-end gap-4">
				<div className="col-1 md:col-2 flex min-h-5 w-full items-start gap-4">
					<Input
						name="email"
						type="email"
						isRequired
						errorMessage={({ validationDetails, validationErrors }) => {
							if (validationDetails.typeMismatch) {
								return "Entrez une adresse email valide.";
							}
							return validationErrors;
						}}
						placeholder="Saisissez une adresse email"
					/>
					<Select name="right" label="Droit" isRequired selectedKeys={["manager"]}>
						<SelectItem key="manager">Gestionnaire</SelectItem>
					</Select>
				</div>

				<Button endContent={<PaperAirplane className="size-4" />} type="submit" isLoading={addInvitation.isPending}>
					Envoyer l'invitation
				</Button>
			</Form>
		</div>
	);
}
