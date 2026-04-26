"use client";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "./LanguageContext";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </SessionProvider>
  );
}
