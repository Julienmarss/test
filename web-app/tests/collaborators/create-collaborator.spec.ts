import { test, expect } from "@playwright/test";

test("Create single collaborator — end-to-end with real backend", async ({ page }) => {
	await page.goto("/admin");

	// Données uniques pour éviter les collisions
	const uid = Date.now().toString().slice(-6);
	const lastName = `Dupont-${uid}`;
	const firstName = `Claire-${uid}`;
	const personalEmail = `claire.${uid}@example.com`;

	// Ouvre l’assistant
	await page.getByRole("button", { name: /Ajouter un collaborateur/i }).click();
	await page
		.getByRole("button", { name: /\+\s*Créer le profil/i })
		.first()
		.click();

	// === Étape 1
	await page.getByPlaceholder(/Saisissez le nom de votre collaborateur/i).fill(lastName);
	await page.getByPlaceholder(/Saisissez le prénom de votre collaborateur/i).fill(firstName);
	await page.getByPlaceholder(/Saisissez l'email personnel du collaborateur/i).fill(personalEmail);

	await page.getByText("Sélectionnez la civilité de votre collaborateur", { exact: true }).click();
	await page
		.getByRole("listbox")
		.getByRole("option", { name: /^Madame$/i })
		.click()
		.catch(async () => {
			await page.getByText(/^Madame$/i).click();
		});

	await page.getByPlaceholder(/^JJ\/MM\/AAAA$/i).fill("12/05/1990");
	await page.getByPlaceholder(/Saisissez le lieu de naissance/i).fill("Lille");
	await page.getByPlaceholder(/Saisissez le numéro de sécurité sociale/i).fill("184127512345678");

	await page.getByTestId("rfs-btn").click();
	await page
		.getByRole("listbox")
		.getByRole("option", { name: "Française" })
		.click()
		.catch(async () => {
			await page.getByText(/^Française$/).click();
		});
	await expect(page.getByTestId("rfs-btn")).toContainText("Française");

	const toProBtn = page.getByRole("button", { name: /Continuer vers\s+[«"]?Situation Professionnelle[»"]?/i });
	await expect(toProBtn).toBeEnabled();
	await toProBtn.click();

	// **Signal de succès création** : l’étape 2 s’affiche
	await expect(page.getByText(/^Situation Professionnelle$/i).first()).toBeVisible({ timeout: 15000 });

	// === Étape 2
	await page.getByPlaceholder(/Saisissez l'intitulé du poste/i).fill("Développeuse Frontend Senior");
	await page.getByText("Sélectionnez le type de contrat", { exact: true }).click();
	await page
		.getByRole("listbox")
		.getByRole("option", { name: /^Contrat à durée indéterminée$/i })
		.click()
		.catch(async () => {
			await page.getByText(/^Contrat à durée indéterminée$/i).click();
		});
	await page.getByPlaceholder(/Saisissez la date d'embauche/i).fill("01/09/2024");
	await page.getByRole("button", { name: /Continuer vers\s+[«"]?Situation Contractuelle/i }).click();

	// === Étape 3
	await page.getByText("Saisissez le statut de votre collaborateur", { exact: true }).click();
	await page
		.getByRole("listbox")
		.getByRole("option", { name: /^Cadre$/i })
		.click()
		.catch(async () => {
			await page.getByText(/^Cadre$/i).click();
		});
	await page.getByPlaceholder(/Saisissez le salaire annuel brut/i).fill("55000");
	await page.getByRole("button", { name: /Continuer vers\s+[«"]?Coordonnées/i }).click();

	// === Étape 4
	await page
		.getByPlaceholder(/Ex:\s*\(\+33\)\s*6 00 00 00 00/i)
		.first()
		.fill("+33611223344");
	await page.getByPlaceholder(/Saisissez l'adresse de votre collaborateur/i).fill("12 rue Nationale, 59800 Lille");
	await page.getByRole("button", { name: /Continuer vers\s+[«"]?Situation Personnelle/i }).click();

	// === Étape 5
	await page.getByText("Sélectionnez votre situation familiale", { exact: true }).click();
	await page
		.locator('[id$="-listbox"]')
		.last()
		.getByRole("option", { name: /^Marié\(e\)$/i })
		.click();
	await page.getByRole("button", { name: /Continuer vers\s+[«"]?Ajout de documents/i }).click();

	// === Étape 6
	await expect(page.getByText(/^Ajout de documents$/i).first()).toBeVisible();

	const finalizeBtn = page.getByRole("button", { name: /Finaliser la création du profil/i });
	await expect(finalizeBtn).toBeEnabled();
	await finalizeBtn.click();

	await page.goto("/admin");
	const row = page
		.getByRole("row")
		.filter({ hasText: new RegExp(`${firstName} ${lastName}`, "i") })
		.first();
	await expect(row).toBeVisible();

	await row.click();
	await expect(
		page.getByRole("heading", { level: 1, name: new RegExp(`${firstName}\\s+${lastName}`, "i") }),
	).toBeVisible();

	// Suppression
	await page
		.getByRole("button", { name: /Mes actions/i })
		.first()
		.click();
	await page.getByRole("button", { name: /Supprimer/i }).click();
	const confirmDeleteButton = page.getByRole("button", { name: /Confirmer la suppression/i });
	await expect(confirmDeleteButton).toBeVisible();
	await confirmDeleteButton.click();

	const titleHomePage = page.getByRole("heading", { level: 1, name: /Rechercher un collaborateur/i });
	await expect(titleHomePage).toBeVisible();
});
