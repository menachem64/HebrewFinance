import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/providers/query-provider";
import { SheetProvider } from "@/providers/sheet-provider";
import { Toaster } from "@/components/ui/sonner";
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "finance app",
  description: "Managing accounts app",
  icons: {
    icon: '/favicon.ico'
  },
  manifest: '/manifest.json'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
     <html lang="en">
     <Head>
       <title>{metadata.title}</title>
       <meta name="description" content="#1d4ed8" />
       <meta name="theme-color" content="#1d4ed8" />
       <link rel="icon" href={metadata.icons.icon} />
       <link rel="manifest" href="/manifest.json" />
      </Head>
      <body className={inter.className}>
        <QueryProvider>
          <Toaster/>
          <SheetProvider/>
             {children}
        </QueryProvider>
      </body>
     </html>
    </ClerkProvider>
  );
}
