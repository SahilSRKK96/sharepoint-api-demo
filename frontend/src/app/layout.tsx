import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KTMB Staff Dashboard",
  description: "KTMB Staff Management System POC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen bg-slate-100">
          <Sidebar />
          <main className="flex-1 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Home</span>
                <span>/</span>
                <span>Dashboard</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">Welcome, Admin</span>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  A
                </div>
              </div>
            </header>
            {/* Content */}
            <div className="flex-1 p-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
