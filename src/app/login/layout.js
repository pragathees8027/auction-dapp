import localFont from "next/font/local";;
import "../globals.css";
import ThemeProvider from "@/components/ThemesProvider.js";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "App",
  description: "Copy app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-all ease-in-out duration-1000`}
      >
         <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
