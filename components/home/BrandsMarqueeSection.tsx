type Brand = {
  src: string;
  alt: string;
};

type BrandsMarqueeSectionProps = {
  brands?: Brand[];
  label?: string;
};

const DEFAULT_BRANDS: Brand[] = Array.from({ length: 8 }, () => ({
  src: "/logo-white.svg",
  alt: "",
}));

/**
 * Cinta decorativa de logos con scroll infinito (CSS-only).
 * Para marcas reales, pasar `brands` con logos distintos.
 */
export default function BrandsMarqueeSection({
  brands = DEFAULT_BRANDS,
  label = "Marcas con las que trabajamos",
}: BrandsMarqueeSectionProps) {
  return (
    <section
      aria-label={label}
      className="w-full select-none overflow-hidden bg-bg-dark"
    >
      <p className="sr-only">{label}</p>

      <div
        aria-hidden="true"
        className="h-5 bg-[url('/race_border.svg')] bg-center bg-repeat-x [bg-size:auto_100%] md:h-6"
      />

      <div className="overflow-hidden mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee py-6 hover:paused motion-reduce:animate-none md:py-8">
          <ul className="flex shrink-0 items-center gap-10 pr-10 md:gap-16 md:pr-16">
            {brands.map((brand, index) => (
              <li key={`a-${index}`} className="shrink-0">
                {/* next/image no optimiza SVG: <img> evita 16 wrappers JS sin beneficio */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.src}
                  alt=""
                  width={160}
                  height={55}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  className="h-8 w-auto object-contain opacity-70 transition-opacity duration-300 hover:opacity-100 md:h-10"
                />
              </li>
            ))}
          </ul>

          <ul
            aria-hidden="true"
            className="flex shrink-0 items-center gap-10 pr-10 md:gap-16 md:pr-16"
          >
            {brands.map((brand, index) => (
              <li key={`b-${index}`} className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.src}
                  alt=""
                  width={160}
                  height={55}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  tabIndex={-1}
                  className="h-8 w-auto object-contain opacity-70 transition-opacity duration-300 hover:opacity-100 md:h-10"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="h-5 bg-[url('/race_border.svg')] bg-center bg-repeat-x bg-size-[auto_100%] md:h-6"
      />
    </section>
  );
}
