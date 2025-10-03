import FormCompletedByCollaborator from "./FormCompletedByCollaborator";
import { notFound } from 'next/navigation';

interface PageProps {
    searchParams: {
        token: string
    }
}

export default async function CollaboratorPage({ searchParams }: PageProps) {
    const { token } = searchParams;

    if (!token) {
        return notFound();
    }

    return <FormCompletedByCollaborator token={token} />
}