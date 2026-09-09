export default function HeroSection() {
  return (
    <section className="min-h-full">
      <div
        id="background-image"
        className="absolute w-full h-full top-0 left-0 z-1 bg-[url(@/public/hero_background.jpg)] bg-no-repeat bg-center bg-cover"
      ></div>
      <div id="contend" className="z-2"></div>
    </section>
  );
}
