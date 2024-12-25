import { Inter, Suranna, Libre_Bodoni } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Head from "./head";
import { AuthProvider } from "@/context/AuthContext";
import Logout from "@/components/Logout";

const inter = Inter({ subsets: ["latin"], });

const suranna = Suranna({ subsets: ["latin"], weight: ["400"], });

const libreBodoni = Libre_Bodoni({ subsets: ["latin"], weight: ["700"], });

export const metadata = {
  title: "Overbrewed",
  description: "Track your daily caffeine intake!",
};

export default function RootLayout({ children }) {
  const header = (
    <header className="p-4 sm:p-8 flex items-center justify-between gap-4 brewedText">
      <Link href={'/'}>
        <h1 className={'p-4 text-base sm:text-lg ' + libreBodoni.className}>Overbrewed</h1>
      </Link>
      <Logout/>
    </header>
  )

  const footer = (
    <footer className="p-4 sm:p-8 gap-2 grid place-items-center">
      <p className="text-stone-500">Made by Bao Phung ♥️</p>
      <a className="text-stone-500 text-xs" href="https://www.flaticon.com/free-icons/mug" title="Drink Icons">Icons created by Freepik - Flaticon</a>
    </footer>
  )

  return (
    <html lang="en">
      <Head/>
      <AuthProvider>
        <body
          className={'w-full max-width-[1000px] mx-auto text-sm ' 
            + 'sm:text-base min-h-screen flex flex-col text-stone-900 ' 
            + inter.className}>
          {header}
          {children}
          {footer}
        </body>
      </AuthProvider>
    </html>
  );
}
