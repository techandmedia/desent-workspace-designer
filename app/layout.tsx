import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "monis.rent — Workspace designer",
  description: "Design a beautiful, ready-to-rent workspace in Bali.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "Design your Monis workspace",
    description: "A workspace that feels like yours, delivered in Bali.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
