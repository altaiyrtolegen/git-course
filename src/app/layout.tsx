import type { Metadata } from "next";
import { Inter, Calistoga, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const calistoga = Calistoga({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-calistoga",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "AI Юрист: Анализ законодательства РК",
  description: "Анализ юридических текстов и ситуаций по УК РК с применением AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${inter.variable} ${calistoga.variable} ${jetbrains.variable} font-sans antialiased bg-background text-foreground selection:bg-accent/20 selection:text-accent`}
      >
        {children}
      </body>
    </html>
  );
}
