import { test, expect } from "@playwright/test";

test("Has title", async ({ page }) => {
	await page.goto("admin");

	await expect(page).toHaveTitle("Legipilot App");
});

test("No redirect", async ({ page }) => {
	await page.goto("admin");

	await expect(page).toHaveURL(/\/admin/);
});

test("Has working searchbar", async ({ page }) => {
	await page.goto("admin");

	const input = page.getByPlaceholder(/Nom, fonction, responsable, type de contrat,/i);

	await expect(input).toBeVisible(); // présent à l’écran
	await expect(input).toBeEnabled(); // pas disabled
	await expect(input).toBeEditable(); // éditable
	await expect(input).toHaveValue(""); // valeur vide par défaut

	await input.fill("Constant");
	await expect(input).toHaveValue("Constant");
});
