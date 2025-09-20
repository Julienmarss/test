import { serviceClientNonAuthentifie } from "@/api/client.api";
import { UUID } from "node:crypto";
import { CompanyResponse } from "@/api/company/company.api";

export type FonctionRequest = 'Dirigeant' | 'RH' | 'Juridique' | 'Comptabilité' | 'Expert-comptable' | 'RH Externe';

export type TenantRequest = 'legipilot' | 'google' | 'microsoft';

interface AuthenticationRequest {
    tenant: TenantRequest;
    sub: string;
}

export type SignUpRequest = {
    authentication: AuthenticationRequest;
    firstName: string;
    lastName: string;
    picture: string;
    fonction: FonctionRequest | "";
    email: string;
    phone: string;

    companyName: string;
    siren: string;
    siret: string;
    legalForm: string;
    nafCode: string;
    principalActivity: string;
    activityDomain: string;
    collectiveAgreement: string;
    idcc: string;

    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}

export type AdministratorResponse = {
    id: UUID,
    email: string,
    phone: string,
    firstname: string,
    lastname: string,
    fonction: FonctionRequest,
    picture: string,
    roles: Array<string>,
    companies: Array<CompanyResponse>,
    isNewsViewed: boolean
    isNotifViewed: boolean
}

export type FormErrors = {
    email: string;
    phone: string;
    siren: string;
    siret: string;
    nafCode: string;
};

export type EmailValidationRequest = {
    email: string;
}

export type CompanyValidationRequest = {
    siren: string;
    siret: string;
    nafCode: string;
}

export async function validateEmail(email: string): Promise<{ isValid: boolean; message?: string }> {
    try {
        const response = await serviceClientNonAuthentifie.post("/public/validate-email", { email });
        return { isValid: true };
    } catch (error: any) {

        if (error.message) {
            console.log('Found error message:', error.message);
            return { isValid: false, message: error.message };
        }

        if (error.status === 409) {
            return { isValid: false, message: "Cette adresse email est déjà utilisée." };
        }
        if (error.status === 400) {
            return { isValid: false, message: "Format d'email invalide." };
        }

        console.log('Returning generic error for email validation');
        return { isValid: false, message: "Cette adresse email est déjà utilisée." };
    }
}

export async function validateCompanyInfo(data: CompanyValidationRequest): Promise<{
    isValid: boolean;
    errors?: { siren?: string; siret?: string; nafCode?: string }
}> {
    console.log('=== validateCompanyInfo called ===');
    console.log('Data sent:', data);

    try {
        const response = await serviceClientNonAuthentifie.post("/public/validate-company", data);
        console.log('Validation success response:', response);
        return { isValid: true };
    } catch (error: any) {
        console.log('=== Validation Error ===');
        console.log('Error status:', error.status);
        console.log('Error data:', error.data);
        console.log('Full error:', error);

        if (error.validationErrors) {
            console.log('Found validationErrors directly:', error.validationErrors);
            return {
                isValid: false,
                errors: error.validationErrors
            };
        }

        if (error.status === 400 && error.data?.validationErrors) {
            console.log('Returning validation errors from data:', error.data.validationErrors);
            return {
                isValid: false,
                errors: error.data.validationErrors
            };
        }

        console.log('Returning generic error');
        return {
            isValid: false,
            errors: {}
        };
    }
}

export async function signup(informations: SignUpRequest) {
    return serviceClientNonAuthentifie.post(
        "/public/signup",
        informations
    );
}