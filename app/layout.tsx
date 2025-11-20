import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const braunLinear = localFont({
  src: [
    {
      path: "./fonts/Braun Linear Font/BraunLinear-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/Braun Linear Font/BraunLinear-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Braun Linear Font/BraunLinear-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Braun Linear Font/BraunLinear-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Braun Linear Font/BraunLinear-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-braun-linear",
  display: "swap",
});

export const metadata: Metadata = {
  title: "David Korn",
  description: "Personal website of David Korn",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${braunLinear.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
