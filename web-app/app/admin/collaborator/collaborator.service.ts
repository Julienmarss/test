import { CollaboratorResponse, StatusResponse, StatusResponseCollaborator, WorkHoursTypeResponse } from "@/api/collaborator/collaborators.dto";
import { UpdateCollaboratorRequest } from "@/api/collaborator/collaborators.api";

export function getSeniority(dateStr: string | undefined): string {
    if (!dateStr) return "--"

    const [day, month, year] = dateStr.split("/").map(Number)
    const hireDate = new Date(year, month - 1, day)

    if (isNaN(hireDate.getTime())) return "--"

    const now = new Date()
    let years = now.getFullYear() - hireDate.getFullYear()
    let months = now.getMonth() - hireDate.getMonth()

    if (now.getDate() < hireDate.getDate()) {
        months -= 1
    }

    if (months < 0) {
        years -= 1
        months += 12
    }

    if (years === 0 && months === 0) return "Moins d’un mois"
    if (years === 0) return `${months} mois`
    if (months === 0) return `${years} an${years > 1 ? "s" : ""}`
    return `${years} an${years > 1 ? "s" : ""} et ${months} mois`
}

export function getFilteredCollaborators(collaborators: CollaboratorResponse[], searchQuery: string) {
    return collaborators.filter(collaborator => {
        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();

        // Recherche dans le nom complet
        const fullName = `${collaborator.firstname || ''} ${collaborator.lastname || ''}`.toLowerCase();

        // Recherche dans les champs principaux
        const searchFields = [
            fullName,
            collaborator.firstname?.toLowerCase() || '',
            collaborator.lastname?.toLowerCase() || '',
            collaborator.professionalSituation?.jobTitle?.toLowerCase() || '',
            collaborator.professionalSituation?.responsible?.toLowerCase() || '',
            collaborator.contractInformations?.category?.toLowerCase() || '',
            collaborator.professionalSituation?.location?.toLowerCase() || '',
            collaborator.professionalSituation?.contractType?.toLowerCase() || '',
            collaborator.contractInformations?.classification?.toLowerCase() || '',
            collaborator.civility?.toLowerCase() || '',
            collaborator.nationality?.toLowerCase() || ''
        ];

        // Vérifier si la requête correspond à l'un des champs
        return searchFields.some(field => field.includes(query));
    });
}

export function displayStatus(status?: StatusResponse) {
    switch (status) {
        case 'ACTIVE':
            return 'Actif';
        case 'EXTERNAL':
            return 'Externe';
        case 'EX_COLLABORATOR':
            return 'Collaborateur externe';
        case 'FOLLOW_UP':
            return 'Suivi';
        case 'SENSITIVE':
            return 'Confidentiel';
        default:
            return '--';
    }
}

export function displayWorkHoursType(status?: WorkHoursTypeResponse) {
    switch (status) {
        case 'H':
            return 'Heures';
        case 'FH':
            return 'Forfait heures';
        case 'FJ':
            return 'Forfait jours';
        default:
            return '--';
    }
}

export function displayStatusCollaborator(status?: StatusResponseCollaborator) {
    switch (status) {
        case 'ACTIVE':
            return 'Actif';
        case 'EXTERNAL':
            return 'Externe';
        case 'IN_PROGRESS':
            return 'Action en cours';
        case 'RELEASE_IN_PROGRESS':
            return 'Sortie en cours';
        case 'INACTIVE':
            return 'Inactif';
        default:
            return '--';
    }
}

export function toStatus(status?: string): StatusResponse {
    switch (status) {
        case 'Actif':
            return 'ACTIVE';
        case 'Externe':
            return 'EXTERNAL';
        case 'Collaborateur externe':
            return 'EX_COLLABORATOR';
        case 'Suivi':
            return 'FOLLOW_UP';
        case 'Confidentiel':
            return 'SENSITIVE';
        default:
            return 'ACTIVE';
    }
}

export const SERVICES = [{
    logo: "https://legipilot-documents.s3.fr-par.scw.cloud/public/prod/visuals/payfit-logo.png",
    name: "Payfit",
    description: "Paie et RH",
    link: "https://payfit.com/fr/",
}, {
    logo: "https://legipilot-documents.s3.fr-par.scw.cloud/public/prod/visuals/legalstart-logo.png",
    name: "Legalstart",
    description: "Service juridique",
    link: "https://www.legalstart.fr/legalstart-legipilot/",
}, {
    logo: "https://legipilot-documents.s3.fr-par.scw.cloud/public/prod/visuals/qonto-logo.png",
    name: "Qonto",
    description: "Service financier",
    link: "https://qonto.com/fr/open-an-account?utm_source=partnership&utm_medium=cpl&utm_campaign=legipilot",
}];

export const nationalities: Record<string, string> = {
    AD: "Andorrane",
    AE: "Émirienne",
    AF: "Afghane",
    AG: "Antiguaise-et-Barbudienne",
    AL: "Albanaise",
    AM: "Arménienne",
    AO: "Angolaise",
    AR: "Argentine",
    AT: "Autrichienne",
    AU: "Australienne",
    AZ: "Azerbaïdjanaise",
    BA: "Bosnienne",
    BB: "Barbadienne",
    BD: "Bangladaise",
    BE: "Belge",
    BF: "Burkinabè",
    BG: "Bulgare",
    BH: "Bahreïnienne",
    BJ: "Béninoise",
    BN: "Brunéienne",
    BO: "Bolivienne",
    BR: "Brésilienne",
    BS: "Bahamienne",
    BT: "Bhoutanaise",
    BW: "Botswanaise",
    BY: "Biélorusse",
    CA: "Canadienne",
    CD: "Congolaise (RDC)",
    CF: "Centrafricaine",
    CG: "Congolaise",
    CH: "Suisse",
    CI: "Ivoirienne",
    CL: "Chilienne",
    CM: "Camerounaise",
    CN: "Chinoise",
    CO: "Colombienne",
    CR: "Costaricaine",
    CU: "Cubaine",
    CV: "Cap-Verdienne",
    CY: "Chypriote",
    CZ: "Tchèque",
    DE: "Allemande",
    DJ: "Djiboutienne",
    DK: "Danoise",
    DM: "Dominiquaise",
    DO: "Dominicaine",
    DZ: "Algérienne",
    EC: "Équatorienne",
    EE: "Estonienne",
    EG: "Égyptienne",
    ER: "Érythréenne",
    ES: "Espagnole",
    ET: "Éthiopienne",
    FI: "Finlandaise",
    FJ: "Fidjienne",
    FR: "Française",
    GA: "Gabonaise",
    GB: "Britannique",
    GD: "Grenadienne",
    GE: "Géorgienne",
    GH: "Ghanéenne",
    GM: "Gambienne",
    GN: "Guinéenne",
    GQ: "Équato-Guinéenne",
    GR: "Grecque",
    GT: "Guatémaltèque",
    GW: "Bissau-Guinéenne",
    GY: "Guyanienne",
    HN: "Hondurienne",
    HR: "Croate",
    HT: "Haïtienne",
    HU: "Hongroise",
    ID: "Indonésienne",
    IE: "Irlandaise",
    IL: "Israélienne",
    IN: "Indienne",
    IQ: "Irakienne",
    IR: "Iranienne",
    IS: "Islandaise",
    IT: "Italienne",
    JM: "Jamaïcaine",
    JO: "Jordanienne",
    JP: "Japonaise",
    KE: "Kényane",
    KG: "Kirghize",
    KH: "Cambodgienne",
    KI: "Kiribatienne",
    KM: "Comorienne",
    KR: "Sud-Coréenne",
    KW: "Koweïtienne",
    KZ: "Kazakhstanaise",
    LA: "Laotienne",
    LB: "Libanaise",
    LI: "Liechtensteinoise",
    LR: "Libérienne",
    LS: "Lesothane",
    LT: "Lituanienne",
    LU: "Luxembourgeoise",
    LV: "Lettone",
    LY: "Libyenne",
    MA: "Marocaine",
    MC: "Monégasque",
    MD: "Moldave",
    ME: "Monténégrine",
    MG: "Malgache",
    MH: "Marshallaise",
    ML: "Malienne",
    MM: "Birmane",
    MN: "Mongole",
    MR: "Mauritanienne",
    MT: "Maltaise",
    MU: "Mauricienne",
    MV: "Maldivienne",
    MW: "Malawienne",
    MX: "Mexicaine",
    MY: "Malaisienne",
    MZ: "Mozambicaine",
    NA: "Namibienne",
    NE: "Nigérienne",
    NG: "Nigériane",
    NL: "Néerlandaise",
    NO: "Norvégienne",
    NP: "Népalaise",
    NZ: "Néo-Zélandaise",
    OM: "Omanaise",
    PA: "Panaméenne",
    PE: "Péruvienne",
    PG: "Papouasienne",
    PH: "Philippine",
    PK: "Pakistanaise",
    PL: "Polonaise",
    PT: "Portugaise",
    PY: "Paraguayenne",
    QA: "Qatarienne",
    RO: "Roumaine",
    RS: "Serbe",
    RU: "Russe",
    RW: "Rwandaise",
    SA: "Saoudienne",
    SC: "Seychelloise",
    SE: "Suédoise",
    SG: "Singapourienne",
    SI: "Slovène",
    SK: "Slovaque",
    SN: "Sénégalaise",
    SV: "Salvadorienne",
    SY: "Syrienne",
    SZ: "Swazie",
    TD: "Tchadienne",
    TH: "Thaïlandaise",
    TN: "Tunisienne",
    TR: "Turque",
    UA: "Ukrainienne",
    UG: "Ougandaise",
    US: "Américaine",
    UY: "Uruguayenne",
    UZ: "Ouzbèke",
    VE: "Vénézuélienne",
    VN: "Vietnamienne",
    YE: "Yéménite",
    ZA: "Sud-Africaine",
    ZM: "Zambienne",
    ZW: "Zimbabwéenne"
};

export const getCode = (nationality: string) => {
    return Object.keys(nationalities)
        .find(key => nationalities[key] === nationality);
}

export const getNationality = (code: string) => {
    return nationalities[code];
}
export const toUpdateCollaboratorRequest = (collaborator: CollaboratorResponse): UpdateCollaboratorRequest => ({
    id: collaborator.id,
    firstname: collaborator.firstname,
    lastname: collaborator.lastname,
    civility: collaborator.civility,
    birthDate: collaborator.birthDate,
    birthPlace: collaborator.birthPlace,
    nationality: collaborator.nationality,
    socialSecurityNumber: collaborator.socialSecurityNumber,
    picture: collaborator.picture,

    jobTitle: collaborator.professionalSituation?.jobTitle,
    contractType: collaborator.professionalSituation?.contractType,
    hireDate: collaborator.professionalSituation?.hireDate,
    endDate: collaborator.professionalSituation?.endDate,
    location: collaborator.professionalSituation?.location,
    workHoursPerWeek: collaborator.professionalSituation?.workHoursPerWeek,
    workHoursType: collaborator.professionalSituation?.workHoursType,
    responsible: collaborator.professionalSituation?.responsible,

    category: collaborator.contractInformations?.category,
    classification: collaborator.contractInformations?.classification,
    annualSalary: collaborator.contractInformations?.annualSalary,
    variableCompensation: collaborator.contractInformations?.variableCompensation,
    totalCompensation: collaborator.contractInformations?.totalCompensation,
    benefitsInKind: collaborator.contractInformations?.benefitsInKind,
    trialPeriod: collaborator.contractInformations?.trialPeriod,
    nonCompeteClause: collaborator.contractInformations?.nonCompeteClause,

    personalPhone: collaborator.contactDetails?.personalPhone,
    personalEmail: collaborator.contactDetails?.personalEmail,
    personalAddress: collaborator.contactDetails?.personalAddress,
    emergencyCivility: collaborator.contactDetails?.emergencyContact?.civility,
    emergencyFirstname: collaborator.contactDetails?.emergencyContact?.firstname,
    emergencyLastname: collaborator.contactDetails?.emergencyContact?.lastname,
    emergencyPhone: collaborator.contactDetails?.emergencyContact?.phone,
    emergencyEmail: collaborator.contactDetails?.emergencyContact?.email,
    professionalEmail: collaborator.contactDetails?.professionalEmail,
    professionalPhone: collaborator.contactDetails?.professionalPhone,
    iban: collaborator.contactDetails?.iban,

    maritalStatus: collaborator.personalSituation?.maritalStatus,
    numberOfChildren: collaborator.personalSituation?.numberOfChildren,
    educationLevel: collaborator.personalSituation?.educationLevel,
    drivingLicenses: collaborator.personalSituation?.drivingLicenses,
    rqth: collaborator.personalSituation?.rqth,

    status: collaborator.status
});

export const isValidSocialSecurityNumber = (value?: string): boolean => {
    if (!value) {
        return false;
    }
    return /^\d{15}$/.test(value.replace(/ /g, ''));
};