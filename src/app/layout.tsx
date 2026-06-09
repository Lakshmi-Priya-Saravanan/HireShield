import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "HireShield — AI-Powered Fake Job Detection & Verification Platform",
  description: "Verify job descriptions, check domains, verify recruiter emails, and audit offer letters for recruitment scams in real time using 7-classifier ensemble reasoning.",
  openGraph: {
    title: "HireShield — AI-Powered Fake Job Detection",
    description: "Verify job descriptions, check domains, verify recruiter emails, and audit offer letters for recruitment scams in real time.",
    type: "website",
    locale: "en_US"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="font-body min-h-full flex flex-col justify-between antialiased">
        <div>
          <Navbar />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
