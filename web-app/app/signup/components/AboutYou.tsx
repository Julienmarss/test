import {Input} from "@/components/ui/Input";
import {Select} from "@/components/ui/Select";
import {FormErrors, SignUpRequest} from "@/app/signup/signup.service";
import {Button} from "@/components/ui/buttons/Button";

type Props = {
    formData: SignUpRequest,
    formErrors: FormErrors,
    handleInputChange: (key: string, value: string | boolean | string[]) => void
    handleContinue: () => void
};
export const AboutYou = ({formData, formErrors, handleInputChange, handleContinue}: Props) => {

    const isStepValid = () => (
        formData.firstName && formData.firstName.length >= 2 &&
        formData.lastName && formData.lastName.length >= 2 &&
        formData.fonction && formData.fonction.length >= 2 &&
        formData.email && formData.email.length >= 2 &&
        formData.phone && formData.phone.length >= 10
        && formErrors.email === '' && formErrors.phone === ''
    );

    return (
        <div className="md:m-8 mx-0 space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Parlez-nous de vous</h1>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    options={[
                        { value: "Dirigeant", label: "Dirigeant" },
                        { value: "RH", label: "Responsable RH" },
                        { value: "Juridique", label: "Juridique" },
                        { value: "Comptabilité", label: "Comptabilité" },
                        { value: "Expert-comptable", label: "Expert-comptable" },
                        { value: "RH Externe", label: "RH Externe" },
                    ]}
                    isClearable={false}
                />

                <Input
                    type="email"
                    label="E-mail"
                    placeholder="Saisissez votre adresse e-mail"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
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
                    onClick={handleContinue}
                    disabled={!isStepValid()}
                    className="px-8 h-12 justify-self-end bg-sky-500 hover:bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continuer
                </Button>
            </div>
        </div>
    );
};