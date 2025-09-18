'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/buttons/Button';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log l'erreur vers un service de monitoring
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">
                    Oops! Une erreur s'est produite
                </h1>

                <p className="text-gray-600 mb-6">
                    {error.message || 'Une erreur inattendue s\'est produite'}
                </p>

                <div className="space-x-4">
                    <Button onClick={reset} variant="outline">
                        Réessayer
                    </Button>

                    <Button onClick={() => window.location.href = '/'}>
                        Retour à l'accueil
                    </Button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <details className="mt-8 text-left">
                        <summary className="cursor-pointer text-sm text-gray-500">
                            Détails de l'erreur (dev only)
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto">
              {error.stack}
            </pre>
                    </details>
                )}
            </div>
        </div>
    );
}