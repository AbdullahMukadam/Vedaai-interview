import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { AssessmentProvider } from "@/providers/assessment-provider";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Assessment Extraction",
  description: "AI-powered assessment extraction and answer mapping",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={bricolageGrotesque.variable}>
      <body className="font-['Bricolage_Grotesque',sans-serif]">
        <QueryProvider>
          <AssessmentProvider>{children}</AssessmentProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
