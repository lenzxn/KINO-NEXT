import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "@/styles/main.scss";

export const metadata: Metadata = {
  title: { default: "Kino", template: "%s | Kino" },
  description: "Din lokala biograf – köp biljetter och läs recensioner online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body>
        <Header />
        <main className="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
