import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fulk | فُلك - Sailing You Toward Digital Transformation",
  description:
    "Fulk Software Solutions - Your partner in digital transformation. ERP systems, web development, mobile apps, UI/UX design, and IT consulting.",
  keywords: [
    "Fulk",
    "فُلك",
    "software company",
    "digital transformation",
    "ERP",
    "web development",
    "mobile development",
    "Saudi Arabia",
  ],
  openGraph: {
    title: "Fulk | فُلك - Digital Transformation",
    description: "Sailing You Toward Digital Transformation",
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fulk | فُلك",
    description: "Sailing You Toward Digital Transformation",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-tajawal antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
