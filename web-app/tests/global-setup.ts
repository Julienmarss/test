import { chromium, FullConfig } from "@playwright/test";

export default async function globalSetup(config: FullConfig) {
	const browser = await chromium.launch();
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("http://localhost:3000/signin");
	await page.getByPlaceholder(/Saisissez votre adresse e-mail/i).fill("testaccount@legipilot.com");
	await page.getByPlaceholder(/Entrez votre mot de passe/i).fill("Admin1234!");
	await page.getByRole("button", { name: /Se connecter/i }).click();

	await page.waitForURL("**/admin"); // Waiting redirection after successfull login
	await context.storageState({ path: "auth.json" }); // cookies + localStorage
	await browser.close();
}
