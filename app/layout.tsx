import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/context/AuthContext";
import Navbar from "@/components/navigation/Navbar";
import getLoggedIn from "@/components/getLoggedIn";
import Footer from "@/components/navigation/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const syne = Syne({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "THHS Hawktivities",
  description:
    "Townsend Harris High School's clubs and extracurricular database. Created and maintained by THHS Hack Club.",
};

// @ts-ignore
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className={"min-h-screen relative"}>
        <div className={"pb-20"}>
          <AuthContextProvider>
            <Toaster />
            <Navbar />
            {children}
            <Footer />
          </AuthContextProvider>
        </div>
      </body>
    </html>
  );
}
