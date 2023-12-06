import "@rainbow-me/rainbowkit/styles.css";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { Providers } from "~~/components/Providers";
import "~~/styles/globals.css";

export const metadata = {
  title: "Chainfluence",
  description: "Chainfluence platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="relative flex flex-col flex-1"> {children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
