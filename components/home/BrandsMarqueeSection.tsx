import Image from "next/image";

const LOGO_COUNT = 8;

export default function BrandsMarqueeSection() {
  return (
    <section
      aria-label="Marcas con las que trabajamos"
      className="overflow-hidden bg-bg-dark"
    >
      <div
        aria-hidden="true"
        className="h-4 bg-[url('/race_border.svg')] bg-repeat-x bg-[size:auto_100%]"
      />
      <div className="mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] overflow-hidden py-6">
        <div
          className="animate-marquee flex w-max will-change-transform"
        >
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center"
            >
              {Array.from({ length: LOGO_COUNT }).map((_, i) => (
                <span key={i} className="flex shrink-0 items-center">
                  <span className="shrink-0 px-10">
                    <Image
                      src="/logo-white.svg"
                      alt=""
                      width={160}
                      height={55}
                      className="h-10 w-auto shrink-0 object-contain opacity-70"
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary/70"
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="h-4 bg-[url('/race_border.svg')] bg-repeat-x bg-[size:auto_100%]"
      />
    </section>
  );
}
