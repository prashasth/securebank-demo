import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider as DescopeProvider } from "@descope/nextjs-sdk";
import { AppProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "SecureBank — Your Trusted Banking Partner",
  description: "SecureBank demo application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DescopeProvider projectId={process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID!}>
          <AppProvider>{children}</AppProvider>
        </DescopeProvider>
      </body>
    </html>
  );
}
