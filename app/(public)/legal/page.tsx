import type { Metadata } from "next";
import HeroLanding from "@/components/HeroLanding";
import CtaBanner from "@/components/shared/CtaBanner";
import LegalContent from "@/components/legal/LegalContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Aviso legal",
  description:
    "Aviso legal, privacidad y condiciones de uso de la web de Vaqueroil, taller en Logroño.",
  alternates: { canonical: absoluteUrl("/legal") },
  robots: { index: true, follow: true },
};

export default function LegalPage() {
  return (
    <main id="contenido" tabIndex={-1}>
      <HeroLanding
        bg_image="/hero_background.jpg"
        title="AVISO LEGAL"
        alt="Aviso legal de Vaqueroil, taller en Logroño"
      />
      <LegalContent />
      <CtaBanner
        title="¿DUDAS SOBRE TUS DATOS?"
        description="Escríbenos a info@vaqueroil.es o llámanos al 941 04 76 95."
        primaryLink="/contact"
        primaryText="Contactar"
      />
    </main>
  );
}
