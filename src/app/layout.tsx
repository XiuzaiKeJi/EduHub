'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { Layout } from "@/components/layout/Layout";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <SessionProvider>
          <Layout>{children}</Layout>
        </SessionProvider>
      </body>
    </html>
  );
}
