import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PREVAIL",
  description: "Predicting power outages and optimizing crew deployment for SDG&E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
