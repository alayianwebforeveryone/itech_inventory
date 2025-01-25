import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./media.css";
import ClientProvider from "./clientProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "I tech Inventory System",
  description: "A powerful and efficient inventory management system designed to streamline stock tracking, product management, and inventory control.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} `}>
        {/* Render client-side provider */}
        <ClientProvider>{children}</ClientProvider>
        {/* Render ToastContainer here */}
        <ToastContainer />
      </body>
    </html>
  );
}
