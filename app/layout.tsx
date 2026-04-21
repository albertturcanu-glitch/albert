import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MTT Exploit Dojo v2",
  description: "Structured exploit-training environment for online MTT grinders.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
