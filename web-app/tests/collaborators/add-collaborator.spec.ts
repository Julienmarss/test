import { test, expect } from "@playwright/test";

test("Has add collaborator button", async ({ page }) => {
	await page.goto("admin");

	const button = page.getByRole("button", { name: "Ajouter un collaborateur" });

	await expect(button).toBeVisible();
	await expect(button).toBeEnabled();
});

test("Click add collaborator button open modal", async ({ page }) => {
	await page.goto("admin");

	const button = page.getByRole("button", { name: "Ajouter un collaborateur" });

	await button.click();

	const header = page.getByRole("heading", { level: 2, name: /Ajouter un collaborateur/i });

	await expect(header).toBeVisible();
});

test("Click add collaborator button display 3 creation options", async ({ page }) => {
	await page.goto("admin");

	const addCollabButton = page.getByRole("button", { name: "Ajouter un collaborateur" });
	await expect(addCollabButton).toBeVisible();
	await expect(addCollabButton).toBeEnabled();

	await addCollabButton.click();

	const optionUniqueCreation = page.getByRole("heading", { level: 3, name: /Création unique d'un collaborateur/i });
	const optionExterneCreation = page.getByRole("heading", { level: 3, name: /Création unique d'un profil freelance/i });
	const optionImportCreation = page.getByRole("heading", { level: 3, name: /Importation groupée de collaborateurs/i });

	await expect(optionUniqueCreation).toBeVisible();
	await expect(optionExterneCreation).toBeVisible();
	await expect(optionImportCreation).toBeVisible();
});
