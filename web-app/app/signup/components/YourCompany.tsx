import {Select} from "@/components/ui/Select";
import {SignUpRequest} from "@/app/signup/signup.service";
import {CONVENTIONS_COLLECTIVES} from "@/data/conventions-collectives";
import CompanySearch from "@/app/signup/components/CompanySearch";
import {CompanyDto} from "@/app/api/pappers/route";
import {Button} from "@/components/ui/buttons/Button";
import {Input} from "@/components/ui/Input";

type Props = {
    formData: SignUpRequest,
    handleCompanySelect: (company: CompanyDto) => void,
    handleInputChange: (key: string, value: string | boolean | number | string[]) => void
    handleContinue: () => void
    handleBack: () => void
};
export const YourCompany = ({formData, handleInputChange, handleCompanySelect, handleContinue, handleBack}: Props) => {

    const isStepValid = () => (
        formData.companyName && formData.companyName.length >= 2 &&
        formData.siren && formData.siren.length >= 2 &&
        formData.siret && formData.siret.length >= 2 &&
        formData.legalForm && formData.legalForm.length >= 2 &&
        formData.nafCode && formData.nafCode.length >= 2 &&
        formData.principalActivity && formData.principalActivity.length >= 2 &&
        formData.activityDomain && formData.activityDomain.length >= 2 &&
        formData.idcc && formData.idcc.length >= 2
    );

    return (
        <div className="flex-col">
            <div className="flex items-center md:flex-row flex-col">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Votre entreprise avec {" "}</h2>
                <img src="/pappers.png" alt="Logo de Pappers" className="ml-2 mb-1 h-6"/>
            </div>

            <div className="mt-8">
                <CompanySearch
                    onCompanySelect={handleCompanySelect}
                    placeholder="Le nom de votre entreprise"
                    value={formData.companyName}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Input
                        label="SIREN"
                        placeholder="Saisissez votre numéro de SIREN"
                        value={formData.siren}
                        onChange={(e) => handleInputChange("siren", e.target.value)}
                    />
                    <Input
                        label="SIRET (siège)"
                        placeholder="Saisissez votre numéro de SIRET"
                        value={formData.siret}
                        onChange={(e) => handleInputChange("siret", e.target.value)}
                    />
                </div>

                <Input
                    label="Forme juridique"
                    placeholder="Saisissez votre forme juridique"
                    value={formData.legalForm}
                    onChange={(e) => handleInputChange("legalForm", e.target.value)}
                    className="w-full"
                    classNameLabel="mt-4"
                />

                <Input
                    label="Domaine d'activité"
                    placeholder="Saisissez votre domaine d'activité"
                    value={formData.activityDomain}
                    onChange={(e) => handleInputChange("activityDomain", e.target.value)}

                    className="w-full"
                    classNameLabel="mt-4"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Input
                        label="Code NAF ou APE"
                        placeholder="Saisissez votre code NAF ou APE"
                        value={formData.nafCode}
                        onChange={(e) => handleInputChange("nafCode", e.target.value)}
                    />
                    <Input
                        label="Activité principale"
                        placeholder="Saisissez votre activité principale"
                        value={formData.principalActivity}
                        onChange={(e) => handleInputChange("principalActivity", e.target.value)}
                    />
                </div>

                <Select
                    label="Convention collective"
                    value={formData.idcc}
                    onChange={(value) => handleInputChange("idcc", value)}
                    placeholder="Selectionnez votre convention collective"
                    options={Object.entries(CONVENTIONS_COLLECTIVES).map(([idcc, label]) => ({
                        value: idcc,
                        label: `${idcc} - ${label}`,
                    }))}
                    classNameLabel="mt-4"
                    isSearchable={true}
                />

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
                        onClick={handleContinue}
                        disabled={!isStepValid()}
                        className="px-4 h-10 bg-sky-500 hover:bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Continuer
                    </Button>
                </div>
            </div>
        </div>
    );
};