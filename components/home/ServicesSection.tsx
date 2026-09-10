"use client";

import { services } from "@/src/db/schema";
import ServiceCard from "./ui/ServiceCard";
import { Cog, ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useState } from "react";

type Service = typeof services.$inferSelect;

type ServicesSectionProps = {
  services: Service[];
};

export default function ServicesSection({ services }: ServicesSectionProps) {
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  return (
    <section className="min-h-[80vh] flex flex-col items-center gap-15 px-15 py-16">
      <h2 className="text-text-inverse font-medium text-6xl">
        NUESTROS SERVICIOS
      </h2>
      <div className="relative w-full px-12">
        <Swiper
          className="w-full min-w-0"
          spaceBetween={30}
          slidesPerView={3}
          centeredSlides={true}
          loop={true}
          modules={[Navigation]}
          navigation={{ prevEl, nextEl }}
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
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-surface-mid p-2 hover:cursor-pointer"
        >
          <ArrowLeft className="h-6 w-6 text-text-inverse" />
        </button>

        <button
          ref={(node) => setNextEl(node)}
          aria-label="Siguiente servicio"
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-surface-mid p-2 hover:cursor-pointer"
        >
          <ArrowRight className="h-6 w-6 text-text-inverse" />
        </button>
      </div>
    </section>
  );
}
