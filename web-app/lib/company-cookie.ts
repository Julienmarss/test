const COOKIE_NAME = "selected-company-id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function setSelectedCompanyIdClient(companyId: string): void {
    if (typeof window === "undefined") return;

    document.cookie = `${COOKIE_NAME}=${companyId}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}