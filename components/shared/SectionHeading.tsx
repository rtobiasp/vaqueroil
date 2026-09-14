type SectionHeadingProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
};

export default function SectionHeading({
  title,
  description,
  align = "left",
  dark = true,
}: SectionHeadingProps) {
  const alignClasses =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex w-full flex-col ${alignClasses}`}>
      <h2
        className={`max-w-3xl text-3xl leading-[1.05] font-medium sm:text-5xl md:text-6xl ${
          dark ? "text-text-inverse" : "text-text-main"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 max-w-2xl text-base leading-relaxed sm:text-lg ${
            dark ? "text-text-inverse/70" : "text-text-main/70"
          } ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
