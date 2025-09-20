"use client"

import {useState} from "react"
import Link from "next/link"
import {getConventionCollectiveByIDCC} from "@/data/conventions-collectives";
import {FormErrors, SignUpRequest, TenantRequest} from "@/app/signup/signup.service";
import StepIndicator from "@/app/signup/components/StepIndicator";
import {AboutYou} from "@/app/signup/components/AboutYou";
import {YourCompany} from "@/app/signup/components/YourCompany";
import {CreatePassword} from "@/app/signup/components/CreatePassword";
import {useSearchParams} from "next/navigation";
import {CompanyDto} from "@/app/api/pappers/route";
import {isValidEmail, isValidPhoneNumber} from "@/utils/validation";
import "./signup-page.scss";

export default function SignUpPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const sub = searchParams.get('sub');
    const picture = searchParams.get('picture');
    const tenant = searchParams.get('tenant') as TenantRequest;
    const firstname = searchParams.get('firstname');
    const lastname = searchParams.get('lastname');
    const [currentStep, setCurrentStep] = useState(1)
    const [formErrors, setFormErrors] = useState<FormErrors>({
        email: '',
        phone: '',
        siren: '',
        siret: '',
        nafCode: ''
    });
    const [formData, setFormData] = useState<SignUpRequest>({
        authentication: {
            tenant: tenant ?? "LEGIPILOT",
            sub: sub ?? ""
        },
        firstName: firstname ?? "",
        lastName: lastname ?? "",
        picture: picture ?? "",
        email: email ?? "",
        phone: "(+33)",
        fonction: "",
        companyName: "",
        siren: "",
        siret: "",
        legalForm: "",
        nafCode: "",
        principalActivity: "",
        activityDomain: "",
        collectiveAgreement: "",
        idcc: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false
    })

    const steps = [
        {number: 1, title: "Étape 1", subtitle: "Parlez-nous de vous"},
        {number: 2, title: "Étape 2", subtitle: "Votre entreprise"},
        {number: 3, title: "Étape 3", subtitle: "Création de compte"},
    ]

    function handleInputChange(field: string, value: string | boolean | number | string[]) {
        setFormData({...formData, [field]: value});

        if (field === 'email') {
            setFormErrors({
                ...formErrors,
                email: isValidEmail(value as string) ? '' : 'Adresse email invalide',
            });
        }

        if (field === 'phone') {
            const isValid = isValidPhoneNumber(value as string);
            setFormErrors({
                ...formErrors,
                phone: isValid ? '' : 'Numéro de téléphone invalide',
            });
        }

        if (field === 'siren') {
            setFormErrors({...formErrors, siren: ''});
        }
        if (field === 'siret') {
            setFormErrors({...formErrors, siret: ''});
        }
        if (field === 'nafCode') {
            setFormErrors({...formErrors, nafCode: ''});
        }
    }

    const handleCompanySelect = (company: CompanyDto) => {
        // Récupération du premier IDCC si disponible
        const idcc = company.conventions_collectives?.[0]?.idcc || "";

        const conventionCollective = idcc ? getConventionCollectiveByIDCC(idcc) : ""

        // Remplissage automatique du formulaire
        setFormData((prev) => ({
            ...prev,
            companyName: company.nom_entreprise || company.denomination || "",
            siren: company.siren,
            siret: company.siege.siret,
            nafCode: company.code_naf,
            principalActivity: company.libelle_code_naf,
            legalForm: company.forme_juridique,
            activityDomain: company.domaine_activite,
            idcc: `${idcc}`,
            collectiveAgreement: conventionCollective,
        }))

        setFormErrors(prev => ({
            ...prev,
            siren: '',
            siret: '',
            nafCode: ''
        }));
    }

    const handleContinue = () => {
        setCurrentStep(currentStep + 1)
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <AboutYou
                        formData={formData}
                        formErrors={formErrors}
                        handleInputChange={handleInputChange}
                        handleContinue={handleContinue}
                        setFormErrors={setFormErrors}
                    />
                )
            case 2:
                return (
                    <YourCompany
                        formData={formData}
                        formErrors={formErrors}
                        handleCompanySelect={handleCompanySelect}
                        handleInputChange={handleInputChange}
                        handleContinue={handleContinue}
                        handleBack={handleBack}
                        setFormErrors={setFormErrors}
                    />
                )
            case 3:
                return (
                    <CreatePassword
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleBack={handleBack}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-sky-900 flex items-center p-2 gap-2">

            {/* Left Panel - Form */}
            <div
                className="flex-1 flex flex-col justify-space-between items-start p-8 bg-white h-[98vh] rounded-lg overflow-y-auto">
                {/* Header */}
                <div className="flex flex-row justify-between mb-4 mt-8 w-full">
                    <div className="flex items-center space-x-3">
                        <img src="/logo-legipilot.svg" alt="Logo Legipilot"/>
                    </div>
                    <Link href="/" className="text-slate-600 hover:text-slate-800 font-medium underline">
                        Se connecter
                    </Link>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between w-full mb-8 mt-4">
                    <StepIndicator steps={steps} currentStep={currentStep}/>
                </div>

                {/* Step Content */}
                <div className="md:w-5/6 w-full self-center">{renderStepContent()}</div>

            </div>

            {/* Right Panel - Branding */}
            <div className="right-panel flex-1 text-center content-center bg-slate-300 h-[98vh] rounded-lg">
                <div className="flex items-center justify-center space-x-4">
                    <img src="https://legipilot-documents.s3.fr-par.scw.cloud/public/prod/visuals/Illustration-Inscription.png" className="h-[90vh]" alt="Logo de Legipilot"/>
                </div>
            </div>
        </div>
    )
}