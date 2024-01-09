import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import { ThemeProvider } from "@/components/common/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/react-query/providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Machine Learning Tools ",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              <Header />
              {children}
            </div>
          </ThemeProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
