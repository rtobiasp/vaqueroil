import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollBackToTop from "@/components/ui/ScrollBackToTop";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <ScrollBackToTop />
    </>
  );
}
