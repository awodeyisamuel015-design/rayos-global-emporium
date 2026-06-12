import "./globals.css";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
// import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Rayos Global Emporium",
  description: "Luxury Fashion Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className="
          bg-white text-black
          dark:bg-black dark:text-white
          transition-colors duration-300
        "
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}