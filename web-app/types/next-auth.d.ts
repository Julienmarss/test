import { DefaultSession, DefaultUser } from "next-auth";
import { UUID } from "node:crypto";

declare module "next-auth" {
	interface Session {
		accessToken?: string;
		expiration?: string;
		user: {
			id?: UUID;
			name?: string;
			firstname?: string;
			lastname?: string;
			picture?: string | null;
			roles?: string[];
		} & DefaultSession["user"];
	}

	interface User extends DefaultUser {
		firstname: string;
		lastname: string;
		picture?: string;
		accessToken?: string;
		expiration?: string;
		roles?: string[];
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		accessToken?: string;
		roles?: string[];
	}
}
