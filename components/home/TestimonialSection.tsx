"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { ArrowLeft, ArrowRight, BadgeCheck, Quote, Star } from "lucide-react";
import Reveal from "@/components/animations/Reveal";

const testimonials = [
  {
    name: "Roberto",
    description:
      "Llevé el coche para la revisión y todo perfecto. Me explicaron cada paso, sin sorpresas en el precio y me lo entregaron antes de lo previsto. Repetiré seguro.",
    rating: 5,
  },
  {
    name: "María García",
    description:
      "Trato muy profesional y cercano. Detectaron un fallo que en otro taller no habían visto y lo solucionaron en el mismo día. Totalmente recomendable.",
    rating: 5,
  },
  {
    name: "Javier López",
    description:
      "Cambio de aceite y filtros rápido y a buen precio. Me avisaron de unos frenos desgastados con fotos y presupuesto claro. Se agradece la transparencia.",
    rating: 4,
  },
  {
    name: "Lucía Fernández",
    description:
      "Muy contenta con el cambio de neumáticos y alineado. El coche va mucho más suave y me asesoraron genial sobre qué marca me convenía por mi uso diario.",
    rating: 5,
  },
  {
    name: "Carlos Martín",
    description:
      "Tuve un problema con el aire acondicionado en pleno verano y me lo dejaron funcionando en una mañana. Eficaces, puntuales y buen precio.",
    rating: 5,
  },
  {
    name: "Ana Torres",
    description:
      "Pedí cita online y fue comodísimo. Me recogieron el coche, me mantuvieron informada por WhatsApp y la reparación del embrague quedó perfecta.",
    rating: 4,
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function TestimonialSection() {
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  return (
    <section className="flex min-h-[80vh] flex-col items-center gap-8 bg-bg-dark bg-felt px-5 py-12 sm:gap-12 sm:px-8 sm:py-16 md:px-15 md:py-20">
      <Reveal className="flex w-full max-w-7xl flex-col items-center gap-4 text-center">
        <div className="flex w-full max-w-7xl flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-medium leading-[1.05] text-text-inverse sm:text-5xl md:text-6xl">
          LO QUE DICEN NUESTROS CLIENTES
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-text-inverse/70 sm:text-lg">
          La confianza se gana con trabajo bien hecho. Esto opinan quienes ya
          han pasado por nuestro taller.
        </p>
        </div>
      </Reveal>

      <Reveal className="relative w-full sm:px-12" y={36}>
      <div className="relative w-full sm:px-12">
        <Swiper
          loop={true}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1}
          spaceBetween={16}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 30 },
          }}
          modules={[Navigation]}
          navigation={{ prevEl, nextEl }}
          className="w-full min-w-0 py-4!"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.name} className="h-auto!">
              {({ isActive }) => (
                <article
                  className={`flex h-full min-h-80 flex-col justify-between gap-6 rounded-2xl p-6 transition-all duration-300 sm:p-8 ${
                    isActive
                      ? "bg-accent-primary text-text-inverse"
                      : "scale-[0.96] bg-surface-mid text-text-inverse opacity-60"
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <Quote
                        size={32}
                        className={
                          isActive
                            ? "text-text-inverse/90"
                            : "text-accent-primary"
                        }
                      />
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < t.rating
                                ? "fill-current"
                                : "text-current opacity-30"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-base leading-relaxed sm:text-lg">“{t.description}”</p>
                  </div>

                  <footer className="flex items-center gap-4">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold ${
                        isActive
                          ? "bg-text-inverse text-accent-primary"
                          : "bg-accent-primary text-text-inverse"
                      }`}
                    >
                      {getInitials(t.name)}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-lg font-medium">{t.name}</span>
                      <span
                        className={`flex items-center gap-1.5 text-sm ${
                          isActive
                            ? "text-text-inverse/85"
                            : "text-text-inverse/60"
                        }`}
                      >
                        <BadgeCheck size={14} />
                        Cliente verificado
                      </span>
                    </span>
                  </footer>
                </article>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          ref={(node) => setPrevEl(node)}
          aria-label="Testimonio anterior"
          className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-surface-mid p-2 transition hover:bg-accent-primary hover:cursor-pointer sm:block"
        >
          <ArrowLeft className="h-6 w-6 text-text-inverse" />
        </button>

        <button
          ref={(node) => setNextEl(node)}
          aria-label="Siguiente testimonio"
          className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-surface-mid p-2 transition hover:bg-accent-primary hover:cursor-pointer sm:block"
        >
          <ArrowRight className="h-6 w-6 text-text-inverse" />
        </button>
        </div>
      </Reveal>
    </section>
  );
}
