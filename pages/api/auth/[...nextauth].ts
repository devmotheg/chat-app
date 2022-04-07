/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { globalErrorHandler } from "../../../lib";
import { User } from "../../../models";

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID!,
			clientSecret: process.env.GOOGLE_SECRET!,
		}),
	],
	pages: {
		signIn: "/auth/signin",
		signOut: "/",
		error: "/",
		verifyRequest: "/",
		newUser: "/",
	},
	callbacks: {
		signIn: async ({ user, account }) => {
			try {
				if (!(await User.findOne({ _s: account.providerAccountId })))
					await User.create({ ...user, _s: account.providerAccountId });
				return true;
			} catch (err) {
				globalErrorHandler(err);
				return false;
			}
		},
		async jwt({ token, account }) {
			if (account) token.id = account.providerAccountId;
			return token;
		},
		async session({ session, token }) {
			session.id = token.id;
			if (!(await User.findOne({ _p: session.id })))
				return { ...session, error: true };
			return session;
		},
	},
});
