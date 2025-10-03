import { isServiceError } from "@/api/client.api";
import { signup, SignUpRequest } from "@/app/signup/signup.service";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/buttons/Button";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
	formData: SignUpRequest;
	handleInputChange: (key: string, value: string | boolean) => void;
	handleBack: () => void;
};
export const CreatePassword = ({ formData, handleInputChange, handleBack }: Props) => {
	const router = useRouter();

	const { mutate, error: errorOnCall } = useMutation({
		mutationFn: signup,
		onSuccess: () => {
			router.push(`/email-sent?email=${encodeURIComponent(formData.email)}`);
		},
	});

	const isValid = () =>
		formData.password.length >= 8 && formData.password === formData.confirmPassword && formData.acceptTerms;

	return (
		<div className="space-y-6 px-0 md:p-8">
			<div>
				<h2 className="mb-2 text-2xl font-bold text-slate-900">Création de compte</h2>
			</div>

			<div className="relative">
				<Input
					type="password"
					label="Mot de passe"
					placeholder="Saisissez votre mot de passe (minimum 8 caractères)"
					help="Le mot de passe doit contenir au moins 8 caractères avec au moins une majuscule, une minuscule et un chiffre."
					value={formData.password}
					onChange={(e) => handleInputChange("password", e.target.value)}
				/>
			</div>

			<div className="relative">
				<Input
					type="password"
					label="Verification du mot de passe"
					placeholder="Confirmer le mot de passe"
					value={formData.confirmPassword}
					onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
					error={
						formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword
							? "Les mots de passe ne correspondent pas."
							: ""
					}
					classNameLabel="mt-4"
				/>
			</div>

			{errorOnCall && isServiceError(errorOnCall) && (
				<div className="mt-2 text-sm text-red-500">{errorOnCall.message}</div>
			)}

			<div className="space-y-3">
				<label className="flex items-start gap-2">
					<Checkbox
						name="acceptTerms"
						checked={formData.acceptTerms}
						onCheckedChange={(state) => handleInputChange("acceptTerms", state)}
						required
					/>
					<span className="text-sm">
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
					</span>
				</label>
			</div>

			<div className="self-normal mt-8 flex w-full justify-between">
				<Button
					onClick={handleBack}
					variant="outline"
					className="h-10 rounded-lg border-gray-300 bg-transparent px-4 font-medium text-gray-900 hover:bg-slate-50"
				>
					Retour
				</Button>
				<div className="self-end">
					<Button
						onClick={() => mutate(formData)}
						disabled={!isValid()}
						className="h-10 rounded-lg bg-sky-500 px-4 font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Créer mon compte
					</Button>
				</div>
			</div>
		</div>
	);
};
