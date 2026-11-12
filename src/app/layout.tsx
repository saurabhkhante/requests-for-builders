import type { Metadata, Viewport } from "next";
import { DM_Sans, PT_Serif } from "next/font/google";

import { MotionProvider } from "@/components/motion/motion-provider";

import "./globals.css";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const ptSerif = PT_Serif({ variable: "--font-pt-serif", subsets: ["latin"], weight: ["400", "700"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "Requests for Builders · Builder's Day", template: "%s · Builder's Day" },
  description: "Problems founders, operators and VCs want solved, for Builder's Day at Product (Un)Conference '26, Bengaluru.",
};

export const viewport: Viewport = { themeColor: "#121a17", colorScheme: "dark", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${dmSans.variable} ${ptSerif.variable} antialiased`}>
      <body className="min-h-dvh">
        <MotionProvider>
          <main id="main" className="page-shell relative">
            {children}
          </main>
        </MotionProvider>
      </body>
    </html>
  );
}
