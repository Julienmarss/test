import { ROLE_OPTIONS, RoleOption } from "@/api/administrator/administrators.api";
import { FormErrors, SignUpRequest, validateEmail } from "@/app/signup/signup.service";
import { Button } from "@/components/ui/buttons/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useMemo, useState } from "react";

type Props = {
	formData: SignUpRequest;
	formErrors: FormErrors;
	handleInputChange: (key: string, value: string | boolean | string[]) => void;
	handleContinue: () => void;
	setFormErrors: (errors: FormErrors) => void;
};

export const AboutYou = ({ formData, formErrors, handleInputChange, handleContinue, setFormErrors }: Props) => {
	const [isValidatingEmail, setIsValidatingEmail] = useState(false);

	const roleOptions: RoleOption[] = useMemo(
		() => ROLE_OPTIONS.map(({ value, label }) => ({ value, label })), // clone des objets
		[],
	);

	const isStepValid = () =>
		formData.firstName &&
		formData.firstName.length >= 2 &&
		formData.lastName &&
		formData.lastName.length >= 2 &&
		formData.fonction &&
		formData.fonction.length >= 2 &&
		formData.email &&
		formData.email.length >= 2 &&
		formData.phone &&
		formData.phone.length >= 10 &&
		formErrors.email === "" &&
		formErrors.phone === "";

	const handleContinueWithValidation = async () => {
		if (!isStepValid()) {
			return;
		}

		setIsValidatingEmail(true);
		try {
			const emailValidation = await validateEmail(formData.email);

			if (!emailValidation.isValid) {
				setFormErrors({
					...formErrors,
					email: emailValidation.message || "Erreur de validation email",
				});
				return;
			}

			handleContinue();
		} catch (error) {
			console.error("Error during email validation:", error);
			setFormErrors({
				...formErrors,
				email: "Erreur lors de la validation de l'email",
			});
		} finally {
			setIsValidatingEmail(false);
		}
	};

	const handleEmailChange = (value: string) => {
		handleInputChange("email", value);
		if (formErrors.email) {
			setFormErrors({ ...formErrors, email: "" });
		}
	};

	return (
		<div className="mx-0 space-y-6 md:m-8">
			<h1 className="mb-2 text-3xl font-bold text-slate-900">Parlez-nous de vous</h1>

			<div className="space-y-6">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Input
						label="Nom"
						placeholder="Saisissez votre nom"
						value={formData.lastName}
						onChange={(e) => handleInputChange("lastName", e.target.value)}
						className="rounded-tl-md"
					/>
					<Input
						label="Prénom"
						placeholder="Saisissez votre prénom"
						value={formData.firstName}
						onChange={(e) => handleInputChange("firstName", e.target.value)}
						className="rounded-tr-md"
					/>
				</div>

				<Select
					label="Rôle"
					placeholder="Votre rôle dans l'entreprise"
					value={formData.fonction}
					onChange={(value) => handleInputChange("fonction", value)}
					options={roleOptions}
					isClearable={false}
				/>

				<Input
					type="email"
					label="E-mail"
					placeholder="Saisissez votre adresse e-mail"
					value={formData.email}
					onChange={(e) => handleEmailChange(e.target.value)}
					aria-errormessage={formErrors.email}
					error={formErrors.email}
				/>

				<Input
					type="tel"
					label="Téléphone"
					placeholder="e.g (+33) 0607080910"
					value={formData.phone}
					onChange={(e) => handleInputChange("phone", e.target.value)}
					className="rounded-b-md"
					error={formErrors.phone}
					setInputValue={(value: string) => handleInputChange("phone", value)}
				/>
			</div>

			<div className="justify-self-end">
				<Button
					onClick={handleContinueWithValidation}
					disabled={!isStepValid() || isValidatingEmail}
					className="h-12 justify-self-end rounded-lg bg-sky-500 px-8 font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isValidatingEmail ? "Validation..." : "Continuer"}
				</Button>
			</div>
		</div>
	);
};
