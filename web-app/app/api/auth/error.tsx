'use client'

import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    return (
        <div>
            <h1>Désolé, nous avons rencontré un problème lors de la connexion...</h1>
            <p>{error}</p>
        </div>
    );
}