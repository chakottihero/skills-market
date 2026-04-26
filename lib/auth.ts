import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const isOAuthConfigured =
  !!process.env.GITHUB_ID &&
  !!process.env.GITHUB_SECRET &&
  process.env.GITHUB_ID !== "your_github_client_id" &&
  process.env.GITHUB_ID !== "placeholder_github_id" &&
  process.env.GITHUB_SECRET !== "your_github_client_secret" &&
  process.env.GITHUB_SECRET !== "placeholder_github_secret";

export { isOAuthConfigured };

export const authOptions: NextAuthOptions = {
  providers: isOAuthConfigured
    ? [
        GitHubProvider({
          clientId: process.env.GITHUB_ID!,
          clientSecret: process.env.GITHUB_SECRET!,
        }),
      ]
    : [],
  pages: {
    error: "/auth/error",
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as { login?: string; profileUrl?: string }).login =
          token.login as string;
        (session.user as { login?: string; profileUrl?: string }).profileUrl =
          token.profileUrl as string;
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
