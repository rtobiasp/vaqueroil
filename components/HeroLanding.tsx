import Breadcrumbs from "./Breadcrumbs";

type HeroLandingProps = {
  bg_image: string;
  title: string;
};

export default function HeroLanding({ bg_image, title }: HeroLandingProps) {
  return (
    <section className="relative -mt-20 flex min-h-[60vh] overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat blur-xs"
        style={{ backgroundImage: `url(${bg_image})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-accent-primary/60 mix-blend-multiply"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-bg-dark/50 via-transparent to-transparent"
      />

      <div className="absolute inset-x-0 top-24 z-20 sm:top-28">
        <div className="mx-auto flex w-full max-w-6xl justify-start px-4 sm:px-8">
          <Breadcrumbs />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 pt-32 pb-12 text-center sm:px-8">
        <h1 className="text-5xl font-medium text-text-inverse sm:text-[100px]">
          {title}
        </h1>
      </div>
    </section>
  );
}
