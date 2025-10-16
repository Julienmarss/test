import { UUID } from "node:crypto";

export type CivilityResponse = 'Monsieur' | 'Madame';
export type MaritalStatusResponse = 'Marié(e)' | 'Célibataire' | 'Pacsé(e)';
export type StatusResponse = 'ACTIVE' | 'EXTERNAL' | 'EX_COLLABORATOR' | 'FOLLOW_UP' | 'SENSITIVE';
export type StatusResponseCollaborator = 'ACTIVE' | 'EXTERNAL' | 'IN_PROGRESS' | 'RELEASE_IN_PROGRESS' | 'INACTIVE';
export type ContractTypeResponse = 'CDI' | 'CDD' | 'APP' | 'PRO' | 'STA' | 'CTT' | 'CTI' | 'CUI' | "EXT";
export type CategoryResponse = "Ouvrier" | "Employé" | "Technicien" | "Agent de maîtrise" | "Cadre";
export type DocumentTypeResponse = 'Contrats et avenants' | 'Administratif' | 'Autres';
export type WorkHoursTypeResponse = "HEURES" | "FORFAIT_HEURES" | "FORFAIT_JOURS"

type EmergencyContactResponse = {
    civility: CivilityResponse;
    lastname: string;
    firstname: string;
    phone: string;
    email: string;
}
type ProfessionalSituationResponse = {
    jobTitle: string;
    contractType: ContractTypeResponse;
    hireDate: string;
    endDate: string;
    location: string;
    responsible: string;
    workHoursPerWeek: number;
    workHoursType: WorkHoursTypeResponse;
}
type ContractInformationsResponse = {
    category: CategoryResponse;
    classification: string;
    annualSalary: number;
    variableCompensation: number;
    totalCompensation: number;
    benefitsInKind: number;
    trialPeriod: string;
    nonCompeteClause: boolean;
}
type ContactDetailsResponse = {
    personalPhone: string;
    personalEmail: string;
    emergencyContact: EmergencyContactResponse;
    personalAddress: string;
    professionalPhone: string;
    professionalEmail: string;
    iban: string;
    bic: string;
}
type PersonalSituationResponse = {
    maritalStatus: MaritalStatusResponse;
    numberOfChildren: number;
    educationLevel: string;
    drivingLicenses: string[];
    rqth: boolean;
}
export type NoteResponse = {
    id: UUID;
    title: string;
    content: string;
    createdBy: string;
    updatedAt: string;
}
export type DocumentResponse = {
    id: UUID;
    name: string;
    filename: string;
    type: DocumentTypeResponse;
    uploadedAt: string;
}
export type CollaboratorResponse = {
    id: UUID;
    firstname: string;
    lastname: string;
    picture?: string;
    civility: CivilityResponse;
    birthDate: string;
    birthPlace: string;
    nationality: string;
    socialSecurityNumber: string;
    status: StatusResponse;
    professionalSituation?: ProfessionalSituationResponse;
    contractInformations?: ContractInformationsResponse;
    contactDetails?: ContactDetailsResponse;
    personalSituation?: PersonalSituationResponse;
    notes: NoteResponse[];
    documents: DocumentResponse[];
}