import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { SOLTO_THEME } from "@/lib/theme";

export const metadata: Metadata = {
  title: `${SOLTO_THEME.name} — ${SOLTO_THEME.tagline}`,
  description: SOLTO_THEME.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-950 text-slate-100">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
        <Navigation />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
