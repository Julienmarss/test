import { CreateInvitationRequest, useAddInvitation } from "@/api/company/invitation.api";
import AccordionSubtitle from "@/components/ui/accordion/AccordionSubtitle";
import { Button } from "@/components/ui/hero-ui/Button";
import { Form } from "@/components/ui/hero-ui/Form";
import { Input } from "@/components/ui/hero-ui/Input";
import { Select, SelectItem } from "@/components/ui/hero-ui/Select";
import { PaperAirplane } from "@/components/ui/icons/PaperAirplane";
import { useCompany } from "@/components/utils/CompanyProvider";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export default function CreateInvitation() {
    const { company } = useCompany();
    const addInvitation = useAddInvitation();
    const [selectedRight, setSelectedRight] = useState<"OWNER" | "MANAGER" | "READONLY">("MANAGER");

    const rightOptions = [
        { key: "OWNER", label: "Propriétaire" },
        { key: "MANAGER", label: "Responsable" },
        { key: "READONLY", label: "Observateur" },
    ];

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fd = new FormData(e.currentTarget);
        const email = (fd.get("email") as string | null)?.trim() ?? "";
        const right = (fd.get("right") as string | null)?.trim() ?? "";

        if (!email || !right) {
            toast({
                title: "Erreur",
                description: "Veuillez remplir tous les champs",
                variant: "destructive",
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast({
                title: "Email invalide",
                description: "Veuillez saisir une adresse email valide",
                variant: "destructive",
            });
            return;
        }

        if (right !== "OWNER" && right !== "MANAGER" && right !== "READONLY") {
            toast({
                title: "Erreur",
                description: "Seuls les droits Propriétaire, Responsable ou Observateur sont autorisés",
                variant: "destructive",
            });
            return;
        }

        const payload: CreateInvitationRequest = {
            email,
            rights: right as "OWNER" | "MANAGER" | "READONLY"
        };

        try {
            await addInvitation.mutateAsync({ invitation: payload, companyId: company.id });

            (e.currentTarget as HTMLFormElement).reset();
            setSelectedRight("MANAGER");

            toast({
                title: "Invitation envoyée",
                description: `Une invitation a été envoyée à ${email} avec les droits ${
                    right === "OWNER" ? "Propriétaire" : right === "MANAGER" ? "Responsable" : "Observateur"
                }`,
                variant: "default",
            });
        } catch (err: any) {
            console.error("Erreur lors de l'envoi de l'invitation:", err);
        }
    };

    return (
        <div>
            <AccordionSubtitle>Nouvelle invitation</AccordionSubtitle>

            <Form onSubmit={onSubmit} className="flex flex-col items-end gap-4">
                <div className="flex w-full flex-col gap-4 md:flex-row md:items-start">
                    {/* CHAMP EMAIL */}
                    <div className="flex-1">
                        <Input
                            name="email"
                            type="email"
                            isRequired
                            label="Adresse email"
                            labelPlacement="outside"
                            placeholder="exemple@entreprise.com"
                            errorMessage={({ validationDetails, validationErrors }) => {
                                if (validationDetails.typeMismatch) {
                                    return "Entrez une adresse email valide.";
                                }
                                return validationErrors;
                            }}
                            description="L'utilisateur recevra un email pour créer son compte"
                        />
                    </div>

                    {/* SÉLECTION DU DROIT - SEULEMENT MANAGER ET READONLY */}
                    <div className="flex-1">
                        <Select
                            name="right"
                            label="Droit d'accès"
                            labelPlacement="outside"
                            isRequired
                            selectedKeys={[selectedRight]}
                            onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0] as "OWNER" | "MANAGER" | "READONLY";
                                setSelectedRight(selected);
                            }}
                            placeholder="Sélectionnez un droit"
                            description={
                                selectedRight === "OWNER"
                                    ? "Accès complet : gestion de l'entreprise et des administrateurs"
                                    : selectedRight === "MANAGER"
                                        ? "Peut gérer les collaborateurs et inviter de nouveaux membres"
                                        : "Accès en lecture seule uniquement"
                            }
                        >
                            {rightOptions.map((option) => (
                                <SelectItem key={option.key}>{option.label}</SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* INFORMATIONS SUPPLÉMENTAIRES */}
                <div className="w-full rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800">
                    <p className="font-medium mb-1">ℹ️ À propos des invitations :</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>
                            <strong>Propriétaire</strong> : Accès complet à l'entreprise et aux droits des administrateurs
                            {" "}
                            <span className="font-normal text-xs text-purple-800">(réservé aux invitations envoyées par un propriétaire)</span>
                        </li>
                        <li><strong>Responsable</strong> : Peut inviter d'autres utilisateurs et gérer les collaborateurs</li>
                        <li><strong>Observateur</strong> : Accès en lecture seule, ne peut rien modifier</li>
                    </ul>
                </div>

                {/* BOUTON D'ENVOI */}
                <Button
                    endContent={<PaperAirplane className="size-4" />}
                    type="submit"
                    isLoading={addInvitation.isPending}
                    isDisabled={addInvitation.isPending}
                >
                    {addInvitation.isPending ? "Envoi en cours..." : "Envoyer l'invitation"}
                </Button>
            </Form>
        </div>
    );
}