"use client";

import { services } from "@/src/db/schema";
import ServiceCard from "./ui/ServiceCard";
import { Cog, ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useState } from "react";
import Reveal from "@/components/animations/Reveal";

type Service = typeof services.$inferSelect;

type ServicesSectionProps = {
  services: Service[];
};

export default function ServicesSection({ services }: ServicesSectionProps) {
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  return (
    <section className="flex min-h-[80vh] flex-col items-center gap-8 bg-[url(@/public/black-felt.png)] px-5 py-12 sm:gap-12 sm:px-8 md:gap-15 md:px-15 md:py-16">
      <Reveal>
        <h2 className="text-center font-medium text-3xl text-text-inverse sm:text-5xl md:text-6xl">
          NUESTROS SERVICIOS
        </h2>
      </Reveal>
      <Reveal className="w-full" y={36}>
        <div className="relative h-[60vh] min-h-[480px] w-full sm:px-12 md:min-h-0">
        <Swiper
          className="h-full w-full min-w-0"
          spaceBetween={16}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          modules={[A11y, Navigation]}
          navigation={{ prevEl, nextEl }}
          breakpoints={{
            640: { slidesPerView: 1.5, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
        >
          {services.map((service, index) => (
            <SwiperSlide key={index}>
              <ServiceCard
                icon={<Cog size={48} />}
                name={service.name}
                description={service.description}
                link="/services"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          ref={(node) => setPrevEl(node)}
          aria-label="Servicio anterior"
          className="absolute top-1/2 left-0 z-10 hidden -translate-y-1/2 rounded-full bg-surface-mid p-2 hover:cursor-pointer sm:block"
        >
          <ArrowLeft className="h-6 w-6 text-text-inverse" />
        </button>

        <button
          ref={(node) => setNextEl(node)}
          aria-label="Siguiente servicio"
          className="absolute top-1/2 right-0 z-10 hidden -translate-y-1/2 rounded-full bg-surface-mid p-2 hover:cursor-pointer sm:block"
        >
          <ArrowRight className="h-6 w-6 text-text-inverse" />
        </button>
        </div>
      </Reveal>
    </section>
  );
}
