import HeroLanding from "@/components/HeroLanding";
import CtaBanner from "@/components/shared/CtaBanner";
import TestimonialSection from "@/components/home/TestimonialSection";
import StorySection from "@/components/about/StorySection";
import ValuesSection from "@/components/about/ValuesSection";

export default function AboutUsPage() {
  return (
    <main>
      <HeroLanding bg_image="/hero_about-us.jpg" title="SOBRE NOSOTROS" />
      <StorySection />
      <ValuesSection />
      <TestimonialSection />
      <CtaBanner
        title="VEN A VERNOS"
        description="Estamos en C. Calahorra 12, Logroño. Pásate, pide cita y nos conocemos."
      />
    </main>
  );
}
