import ThemeProvider from "@/components/ThemesProvider";
import AuctionApp from "@/components/AuctionList";

export default function Home() {
  return (
    <ThemeProvider>
      <AuctionApp />
    </ThemeProvider>
  );
}
