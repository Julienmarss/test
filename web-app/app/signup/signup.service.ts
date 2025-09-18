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

export type FormErrors = { email: string, phone: string };

export async function signup(informations: SignUpRequest) {
    return serviceClientNonAuthentifie.post(
        "/public/signup",
        informations
    );
}
