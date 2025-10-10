import Link from "next/link";
import {signup, SignUpRequest} from "@/app/signup/signup.service";
import {Input} from "@/components/ui/Input";
import {Button} from '@/components/ui/buttons/Button';
import {useMutation} from "@tanstack/react-query";
import {useState} from "react";
import { useRouter } from "next/navigation";
import {isServiceError} from "@/api/client.api";
import {Checkbox} from "@/components/ui/checkbox";

type Props = {
    formData: SignUpRequest,
    handleInputChange: (key: string, value: string | boolean) => void,
    handleBack: () => void
};
export const CreatePassword = ({formData, handleInputChange, handleBack}: Props) => {
    const router = useRouter();

    const {mutate, error: errorOnCall} = useMutation({
        mutationFn: signup,
        onSuccess: () => {
            router.push(`/email-sent?email=${encodeURIComponent(formData.email)}`);
        }
    });

    const isValid = () => (
        formData.password.length >= 8 &&
        formData.password === formData.confirmPassword &&
        formData.acceptTerms
    )

    return (
        <div className="space-y-6 md:p-8 px-0">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Création de compte</h2>
            </div>

            <div className="relative">
                <Input
                    type='password'
                    label="Mot de passe"
                    placeholder="Saisissez votre mot de passe (minimum 8 caractères)"
                    help="Le mot de passe doit contenir au moins 8 caractères avec au moins une majuscule, une minuscule et un chiffre."
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                />
            </div>

            <div className="relative">
                <Input
                    type='password'
                    label="Verification du mot de passe"
                    placeholder="Confirmer le mot de passe"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    error={formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? "Les mots de passe ne correspondent pas." : ""}
                    classNameLabel="mt-4"
                />
            </div>

            {errorOnCall && isServiceError(errorOnCall) && (
                <div className="text-red-500 text-sm mt-2">{errorOnCall.message}</div>
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
                            className="text-gray-900 hover:text-gray-950 underline"
                        >
                            conditions générales d'utilisation et la politique de confidentialité
                        </Link>
                        {" "}du site.
                    </span>
                </label>
            </div>

            <div className="flex self-normal w-full justify-between mt-8">
                <Button
                    onClick={handleBack}
                    variant="outline"
                    className="px-4 h-10 border-gray-300 text-gray-900 hover:bg-slate-50 font-medium rounded-lg bg-transparent"
                >
                    Retour
                </Button>
                <div className="self-end">
                    <Button
                        onClick={() => mutate(formData)}
                        disabled={!isValid()}
                        className="px-4 h-10 bg-sky-500 hover:bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Créer mon compte
                    </Button>
                </div>
            </div>
        </div>
    );
};