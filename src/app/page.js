import ThemeProvider from "@/components/ThemesProvider";
import HomePage from "@/components/HomePage";

export default function Home() {
  return (
    <ThemeProvider>
      <HomePage />
    </ThemeProvider>
  );
}
