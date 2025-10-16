import { countries } from "@/utils/countries";

const dialCodes = countries.map((country) => country.dialCode.replaceAll("(", "").replaceAll(")", ""));

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);

export const isValidPhoneNumber = (phone: string): boolean => {
	const cleanedPhone = phone
		.replace(/\s+/g, "")
		.replace(/\./g, "")
		.replace(/^\(\+(\d+)\)/, "+$1"); // ex: "(+33)" → "+33"

	return dialCodes.some((dialCode) => {
		if (cleanedPhone.startsWith(dialCode)) {
			const phoneNumber = cleanedPhone.slice(dialCode.length);
			return /^[0-9]{6,15}$/.test(phoneNumber);
		}
		return false;
	});
};
