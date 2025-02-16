import { Montserrat } from 'next/font/google';
import type { Metadata } from "next";
import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "Cortex",
  description: "Master Your Technical Interviews",
  icons: {
    icon: '/logos/codem.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className={`${montserrat.className}`}>
        {children}
      </body>
    </html>
  );
}