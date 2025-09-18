import { UpdateCollaboratorRequest, useSendMailCollaboratorToComplete } from "@/api/collaborator/collaborators.api";
import { Button } from "@/components/ui/buttons/Button";
import { useCompany } from "@/components/utils/CompanyProvider";

type Props = {
    collaborator: UpdateCollaboratorRequest,
};

const CompleteProfileForm = ({ collaborator }: Props) => {
    const { company } = useCompany();
    const { mutate: sendEmail, isPending: isSendPending } = useSendMailCollaboratorToComplete();
    console.log("here", company && collaborator?.id);
    return (
        <div id="complete-profile" className="flex flex-col gap-y-4 bg-white rounded-lg border border-slate-200 p-6 overflow-visible z-0">
            <div className="flex items-center gap-2">
                <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.75 3.75V14.25C20.75 15.4926 19.7426 16.5 18.5 16.5H3.5C2.25736 16.5 1.25 15.4926 1.25 14.25V3.75M20.75 3.75C20.75 2.50736 19.7426 1.5 18.5 1.5H3.5C2.25736 1.5 1.25 2.50736 1.25 3.75M20.75 3.75V3.99271C20.75 4.77405 20.3447 5.49945 19.6792 5.90894L12.1792 10.5243C11.4561 10.9694 10.5439 10.9694 9.82078 10.5243L2.32078 5.90894C1.65535 5.49945 1.25 4.77405 1.25 3.99271V3.75" stroke="#99A1AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">Inviter le collaborateur à compléter son profil</h3>
            </div>
            <div className="flex border rounded-xl flex-col items-center justify-center py-6 gap-4">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="80" height="80" rx="40" fill="#0084D1" />
                    <path d="M59.5 29.5V50.5C59.5 52.9853 57.4853 55 55 55H25C22.5147 55 20.5 52.9853 20.5 50.5V29.5M59.5 29.5C59.5 27.0147 57.4853 25 55 25H25C22.5147 25 20.5 27.0147 20.5 29.5M59.5 29.5V29.9854C59.5 31.5481 58.6893 32.9989 57.3584 33.8179L42.3584 43.0487C40.9121 43.9387 39.0879 43.9387 37.6416 43.0487L22.6416 33.8179C21.3107 32.9989 20.5 31.5481 20.5 29.9854V29.5" stroke="#F0F9FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span className="font-semibold text-regular text-gray-900">Inviter {`${collaborator.firstname} ${collaborator.lastname}`} à compléter son profil</span>
                <span className="text-sm text-gray-500">Votre collaborateur pourra éditer certaines informations personnelles</span>
                <Button onClick={() => {
                    if (company && collaborator?.id){
                        sendEmail({ companyId: company.id, collaboratorId: collaborator.id })
                    }
                }}
                    disabled={isSendPending}
                    className="bg-transparent text-gray-900 semi-bold border border-gray-200 hover:bg-gray-200">
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 0C0.671573 0 0 0.671573 0 1.5V2.29294C0.0256828 2.30204 0.051129 2.31264 0.0762339 2.32476L6.67411 5.50994C6.88011 5.60939 7.12023 5.60939 7.32623 5.50994L13.9241 2.32476C13.9491 2.31269 13.9744 2.30214 14 2.29306V1.5C14 0.671573 13.3284 0 12.5 0H1.5Z" fill="#99A1AF" />
                        <path d="M14 3.95377L7.97836 6.86077C7.36036 7.15911 6.63999 7.15911 6.02199 6.86077L0 3.9536V8.5C0 9.32843 0.671573 10 1.5 10H12.5C13.3284 10 14 9.32843 14 8.5V3.95377Z" fill="#99A1AF" />
                    </svg>
                    Envoyer l’invitation
                </Button>
            </div>
        </div>
    )
}
export default CompleteProfileForm;