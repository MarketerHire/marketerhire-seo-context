import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import ActivityTimeline from "@/components/ActivityTimeline";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SEO Dashboard — MarketerHire",
  description:
    "Operational SEO dashboard for MarketerHire organic search",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${workSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-mh-white text-mh-black">
        {children}
        <ActivityTimeline />
      </body>
    </html>
  );
}
