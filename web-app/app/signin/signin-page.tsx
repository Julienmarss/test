"use client"

import {useEffect, useState} from "react"
import {Button} from "@/components/ui/buttons/Button"
import Link from "next/link"
import {signIn} from "next-auth/react";
import {useRouter, useSearchParams} from "next/navigation";
import {Input} from "@/components/ui/Input";
import {isServiceError} from "@/api/client.api";
import "./signin-page.scss";
import {Checkbox} from "@/components/ui/checkbox";

export default function SignInPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const ssoError = searchParams.get("error");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        if (ssoError) {
            setError(ssoError);
        }
    }, [ssoError]);

    async function login({username, password}: { username: string; password: string }) {
        setIsLoading(true);
        setError("");

        const result = await signIn("credentials", {
            redirect: false,
            username,
            password,
        });

        setIsLoading(false);

        if (result?.error) {
            try {
                const parsedError = JSON.parse(result.error);
                if (isServiceError(parsedError)) {
                    setError(parsedError.message);
                } else {
                    setError("Combinaison e-mail / mot de passe incorrecte.");
                }
            } catch {
                setError("Une erreur est survenue lors de la connexion.");
            }
        } else if (result?.ok) {
            router.push("/admin");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br bg-orange-200 flex items-center justify-center p-2 gap-2">

            {/* White card */}
            <div
                className="flex flex-col justify-between items-start py-20 px-12 bg-white rounded-lg h-[98vh] md:max-w-[36vw] overflow-y-auto">

                <img src="/picto-legipilot.svg" alt="Logo de Legipilot" className="w-10 h-auto mt-4"/>

                {/* Welcome Text */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900">Bienvenue !</h1>
                    <p className="text-gray-500">Connectez-vous à LégiPilot pour continuer.</p>
                </div>

                {/* Sign In Form */}
                <form className="w-full"
                      onSubmit={(e) => {
                          e.preventDefault();
                          login({username: email, password});
                      }}>
                    <Input
                        type="email"
                        label="E-mail"
                        placeholder="Saisissez votre adresse e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        type="password"
                        label="Mot de passe"
                        placeholder="Entrez votre mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        classNameLabel="mt-4"
                    />

                    {error && (
                        <p className="mt-4 text-sm text-red-600">{error}</p>
                    )}

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                            <Checkbox className="text-white" />
                            <span className="ml-2 text-sm text-gray-500">Rester connecté</span>
                        </div>
                        <Link href="/forgotten-password" className="text-sm font-semibold text-gray-900 underline mr-1">
                            Mot de passe oublié ?
                        </Link>
                    </div>

                    <div className="flex items-center mt-8">
                        <Button type="submit"
                                className="h-8 bg-sky-600 hover:bg-sky-700 text-white font-medium w-full"
                                disabled={isLoading}>
                            {isLoading ? "Connexion..." : "Se connecter"}
                        </Button>
                    </div>
                </form>

                {/* Divider */}
                <div className="flex items-center w-full">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="mx-4 text-xs text-slate-500 bg-white px-2 uppercase">Ou</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Social Sign In */}
                <div className="space-y-3">
                    <Button variant="outline"
                            className="w-full h-12 border-slate-200 hover:bg-slate-50 bg-transparent"
                            onClick={() => signIn('google', {callbackUrl: '/admin'})}
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continuer avec Google
                    </Button>

                    <Button variant="outline"
                            className="w-full h-12 border-slate-200 hover:bg-slate-50 bg-transparent"
                            onClick={() => signIn('azure-ad', {callbackUrl: '/admin'})}
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path fill="#f25022" d="M1 1h10v10H1z"/>
                            <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                            <path fill="#7fba00" d="M1 13h10v10H1z"/>
                            <path fill="#ffb900" d="M13 13h10v10H13z"/>
                        </svg>
                        Continuer avec Microsoft
                    </Button>
                </div>

                {/* Divider */}
                <div className="flex items-center w-full mt-4">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center text-slate-600 mb-4">
                    Pas encore de compte ?{" "}
                    <Link href="/signup"
                          className="text-slate-900 hover:text-slate-700 underline underline-offset-4 font-bold">
                        Créer un compte
                    </Link>
                </div>
            </div>

            {/* Right Panel - Branding */}
            <div className="right-panel flex-1 text-center content-center bg-orange-100 h-[98vh] rounded-lg">
                <div className="flex items-center justify-center space-x-4 px-6">
                    <img src="https://legipilot-documents.s3.fr-par.scw.cloud/public/prod/visuals/Illustration-Connexion.png" className="h-[90vh]" alt="Logo de Legipilot"/>
                </div>
            </div>
        </div>
    )
}
