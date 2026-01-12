import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Satark Portal - Delhi Police Intelligence Portal",
  description: "Secure Citizen Intelligence & Community Policing Platform",
};

import I18nProvider from "@/components/I18nProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/assets/css/ux4g.css" />
        <link rel="stylesheet" href="/assets/css/ux4g-utilities.css" />
        <link rel="stylesheet" href="/assets/css/ux4g-icons.css" />
      </head>
      <body suppressHydrationWarning>
        <I18nProvider>
          {children}
        </I18nProvider>
        <Script src="/assets/js/ux4g.bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
