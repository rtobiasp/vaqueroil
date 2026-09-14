import HeroLanding from "@/components/HeroLanding";
import CtaBanner from "@/components/shared/CtaBanner";
import LegalContent from "@/components/legal/LegalContent";

export default function LegalPage() {
  return (
    <main>
      <HeroLanding bg_image="/hero_background.jpg" title="AVISO LEGAL" />
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
