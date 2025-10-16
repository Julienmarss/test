"use client";

import { serviceClientNonAuthentifie } from "@/api/client.api";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UUID } from "node:crypto";
import { FormEvent, useMemo, useState } from "react";
import { Button } from "../ui/hero-ui/Button";
import { Checkbox } from "../ui/hero-ui/Checkbox";
import { Form } from "../ui/hero-ui/Form";
import { Input } from "../ui/hero-ui/Input";
import { Select, SelectItem } from "../ui/hero-ui/Select";
import { Check } from "../ui/icons/Check";
import { ROLE_OPTIONS } from "@/data/roles";

export default function InvitationForm({
	handleFirstnameChange,
	token,
	email,
}: {
	handleFirstnameChange: (value: string) => void;
	token: UUID;
	email: string;
}) {
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const passwordErrors = useMemo(() => {
		const errs: string[] = [];
		if (password.length < 8) errs.push("Au moins 8 caractères.");
		if (!/[A-Z]/.test(password)) errs.push("Au moins 1 majuscule.");
		if (!/[a-z]/.test(password)) errs.push("Au moins 1 minuscule.");
		if (!/[0-9]/.test(password)) errs.push("Au moins 1 chiffre.");
		return errs;
	}, [password]);

	const mismatch = confirm.length > 0 && password !== confirm;

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);

		const firstname = (fd.get("firstname") as string | null)?.trim() ?? "";
		const lastname = (fd.get("lastname") as string | null)?.trim() ?? "";
		const role = (fd.get("role") as string | null) ?? "";
		const phone = (fd.get("phone") as string | null)?.trim() ?? "";

		if (passwordErrors.length > 0 || mismatch) {
			toast({
				title: "Erreur de validation",
				description: "Veuillez corriger les erreurs dans le formulaire",
				variant: "destructive",
			});
			return;
		}

		setIsSubmitting(true);

		try {
			await serviceClientNonAuthentifie.post("/public/signup-with-invitation", {
				authentication: {
					tenant: "LEGIPILOT",
					sub: null,
				},
				firstName: firstname,
				lastName: lastname,
				fonction: role,
				email: email,
				phone: phone,
				password: password,
				confirmPassword: confirm,
				companyName: "",
				siren: "",
				siret: "",
				legalForm: "",
				nafCode: "",
				activityDomain: "",
				idcc: "",
				collectiveAgreement: "",
				invitationToken: token,
			});

			toast({
				title: "Compte créé !",
				description: "Vérifiez votre email pour activer votre compte",
				variant: "default",
			});

			router.push(`/email-sent?email=${encodeURIComponent(email)}`);
		} catch (error: any) {
			console.error("Signup error:", error);
			toast({
				title: "Échec de l'inscription",
				description: error?.response?.data?.message || "Une erreur est survenue",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form className="items-end" onSubmit={onSubmit}>
			<div className="grid w-full grid-cols-2 gap-6 [&_label]:font-medium">
				{/* INFORMATIONS PERSONNELLES UNIQUEMENT */}
				<Input
					name="firstname"
					label="Prénom"
					onValueChange={handleFirstnameChange}
					labelPlacement="outside"
					placeholder="Entrez le prénom"
					isRequired
					validate={(v) => (v.length < 2 ? "Le prénom doit faire au moins 2 caractères" : undefined)}
					className="col-span-2 md:col-span-1"
				/>

				<Input
					name="lastname"
					label="Nom"
					className="col-span-2 md:col-span-1"
					labelPlacement="outside"
					placeholder="Entrez le nom"
					validate={(v) => (v.length < 2 ? "Le nom doit faire au moins 2 caractères" : undefined)}
					isRequired
				/>

				<Select
					name="role"
					label="Rôle"
					className="col-span-2"
					labelPlacement="outside"
					isRequired
					placeholder="Sélectionnez un rôle"
				>
					{ROLE_OPTIONS.map((opt) => (
						<SelectItem key={opt.value}>{opt.label}</SelectItem>
					))}
				</Select>

				<Input
					name="phone"
					type="tel"
					label="Téléphone"
					className="col-span-2"
					isRequired
					labelPlacement="outside"
					placeholder="Ex : +33 6 12 34 56 78"
					validate={(value) => {
						if (!/^[0-9()+\s]*$/.test(value)) return "Caractères autorisés : chiffres, +, (, ) et espace";
						if (value.replace(/[^\d]/g, "").length < 10)
							return "Le numéro de téléphone doit contenir au moins 10 chiffres";
					}}
					onBeforeInput={(e: any) => {
						const data = (e as InputEvent).data;
						if (data && /[^\d+() ]/.test(data)) e.preventDefault();
					}}
					onPaste={(e) => {
						const text = e.clipboardData.getData("text");
						if (/[^\d+() ]/.test(text)) e.preventDefault();
					}}
				/>

				{/* MOT DE PASSE */}
				<Input
					name="password"
					type="password"
					label="Mot de passe"
					labelPlacement="outside"
					className="col-span-2 md:col-span-1"
					placeholder="Saisissez un mot de passe"
					isRequired
					value={password}
					onValueChange={setPassword}
					isInvalid={passwordErrors.length > 0}
					errorMessage={
						passwordErrors.length > 0
							? () => (
									<ul className="list-disc ps-5">
										{passwordErrors.map((err, i) => (
											<li key={i}>{err}</li>
										))}
									</ul>
								)
							: undefined
					}
					description={
						passwordErrors.length === 0
							? "Le mot de passe doit contenir au moins 8 caractères avec au moins une majuscule, une minuscule et un chiffre."
							: undefined
					}
				/>

				<Input
					name="passwordConfirm"
					type="password"
					label="Confirmer le mot de passe"
					labelPlacement="outside"
					className="col-span-2 md:col-span-1"
					placeholder="Confirmez le mot de passe"
					isRequired
					value={confirm}
					onValueChange={setConfirm}
					isInvalid={mismatch}
					errorMessage={mismatch ? "Les mots de passe ne correspondent pas." : undefined}
				/>

				{/* CONDITIONS D'UTILISATION */}
				<div className="col-span-2 flex items-start gap-2">
					<Checkbox id="tos" aria-label="Accepter les CGU" isRequired />
					<label htmlFor="tos" className="text-sm !font-normal">
						En créant mon compte, j'accepte les{" "}
						<Link
							href="https://www.legipilot.com/termes-et-conditions"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-900 underline hover:text-gray-950"
						>
							conditions générales d'utilisation et la politique de confidentialité
						</Link>{" "}
						du site.
					</label>
				</div>
			</div>

			{/* BOUTON DE SOUMISSION */}
			<Button
				type="submit"
				endContent={<Check className="size-5" />}
				className="mt-8"
				isLoading={isSubmitting}
				isDisabled={passwordErrors.length > 0 || mismatch}
			>
				Accepter l'invitation et créer mon compte
			</Button>
		</Form>
	);
}
