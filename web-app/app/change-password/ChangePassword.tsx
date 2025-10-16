"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/buttons/Button";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useModifyPassword } from "@/api/administrator/administrators.auth.api";

export const ChangePassword = () => {
	const searchParams = useSearchParams();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const token = searchParams.get("token");
	const { isPending, error, isError, isSuccess, mutate: modifyPassword } = useModifyPassword();

	return (
		<form
			className="w-full"
			onSubmit={(e) => {
				e.preventDefault();
				token && modifyPassword({ token, email, password });
			}}
		>
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
				placeholder="Saisissez votre mot de passe (minimum 8 caractères)"
				help="Le mot de passe doit contenir au moins 8 caractères avec au moins une majuscule, une minuscule et un chiffre."
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				classNameLabel="mt-4"
			/>

			<Input
				type="password"
				label="Verification du mot de passe"
				placeholder="Confirmer le mot de passe"
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				error={
					password && confirmPassword && password !== confirmPassword ? "Les mots de passe ne correspondent pas." : ""
				}
				classNameLabel="mt-4"
			/>

			{isSuccess && (
				<p className="mt-4 text-sm text-green-600">Votre mot de passe a bien été modifié. Veuillez vous reconnecter.</p>
			)}

			{isError && <p className="mt-4 text-sm text-red-600">{error.message}</p>}

			<div className="mt-8 flex items-center">
				<Button
					type="submit"
					className="h-8 w-full bg-sky-600 font-medium text-white hover:bg-sky-700"
					disabled={isPending || isSuccess || !password || !confirmPassword || password !== confirmPassword}
				>
					{isPending ? "Changement en cours..." : "Changer le mot de passe"}
				</Button>
			</div>
		</form>
	);
};
