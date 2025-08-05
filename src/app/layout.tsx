import type { Metadata } from "next";
import { Roboto, Montserrat } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hermes SLI",
  description: "Health tracking dashboard for Hermes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
