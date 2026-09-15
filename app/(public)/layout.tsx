import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CookieBanner from "@/components/cookies/CookieBanner";
import { CookieConsentProvider } from "@/components/cookies/consent-context";
import ScrollBackToTop from "@/components/ui/ScrollBackToTop";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CookieConsentProvider>
      <Header />
      {children}
      <Footer />
      <ScrollBackToTop />
      <CookieBanner />
    </CookieConsentProvider>
  );
}
