'use client';

import {Input} from "@/components/ui/Input";
import {Button} from "@/components/ui/buttons/Button";
import {useState} from "react";
import {useForgottenPassword} from "@/api/administrator/administrators.auth.api";

export const ForgottenPassword = () => {
    const [email, setEmail] = useState('');
    const {isPending, error, isError, isSuccess, mutate: forgottenPassword} = useForgottenPassword();

    return (
        <form className="w-full"
              onSubmit={(e) => {
                  e.preventDefault();
                  forgottenPassword({email});
              }}>
            <Input
                type="email"
                label="E-mail"
                placeholder="Saisissez votre adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            {isSuccess && (
                <p className="mt-4 text-sm text-green-600">Si votre compte existe, vous avez reçu un lien de
                    réinitialisation par e-mail.</p>
            )}

            {isError && (
                <p className="mt-4 text-sm text-red-600">{error.message}</p>
            )}

            <div className="flex items-center mt-8">
                <Button type="submit"
                        className="h-8 bg-sky-600 hover:bg-sky-700 text-white font-medium w-full"
                        disabled={isPending || isSuccess}>
                    {isPending ? "Envoi en cours..." : "Recevoir mon lien de réinitialisation"}
                </Button>
            </div>
        </form>
    );
};