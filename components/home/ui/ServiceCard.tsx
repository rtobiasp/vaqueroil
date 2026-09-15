import Link from "next/link";
import { MoveRight } from "lucide-react";
import { useSwiperSlide } from "swiper/react";

type ServiceCardProps = {
  icon: React.ReactElement;
  name: string;
  description: string | null;
  link: string;
};

export default function ServiceCard({
  icon,
  name,
  description,
  link,
}: ServiceCardProps) {
  const swiperSlide = useSwiperSlide();

  return (
    <article
      className={`flex flex-col items-center justify-between gap-8 rounded-2xl p-6 transition duration-300 sm:p-8 lg:gap-0 lg:p-10 ${swiperSlide.isActive ? "bg-accent-primary min-h-full text-bg-dark" : "bg-surface-mid min-h-[90%] text-text-inverse"}`}
    >
      <div className="flex flex-col items-center gap-4 sm:gap-5">
        <span aria-hidden="true">{icon}</span>
        <h3 className="text-center text-2xl sm:text-3xl lg:text-4xl">{name}</h3>
        <p className="text-center text-sm leading-relaxed sm:text-base">{description}</p>
      </div>
      <Link
        href={link}
        aria-label={`Leer más sobre ${name}`}
        className="flex h-fit flex-row items-center gap-3"
      >
        Leer más <MoveRight aria-hidden="true" />
      </Link>
    </article>
  );
}
