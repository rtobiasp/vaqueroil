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
      className={`flex flex-col items-center justify-between p-10 transition duration-300 rounded-2xl text-text-inverse ${swiperSlide.isActive ? "bg-accent-primary min-h-full" : "bg-surface-mid min-h-[90%]"}`}
    >
      <div className="flex flex-col items-center gap-5">
        {icon}
        <h3 className="text-4xl text-center">{name}</h3>
        <p className="text-center">{description}</p>
      </div>
      <a href={link} className="flex h-fit flex-row items-center gap-3">
        Leer más <MoveRight />
      </a>
    </article>
  );
}
