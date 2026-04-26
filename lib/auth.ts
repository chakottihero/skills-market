import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as { login?: string; profileUrl?: string }).login = token.login as string;
        (session.user as { login?: string; profileUrl?: string }).profileUrl = token.profileUrl as string;
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.login = (profile as { login?: string }).login;
        token.profileUrl = (profile as { html_url?: string }).html_url;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
