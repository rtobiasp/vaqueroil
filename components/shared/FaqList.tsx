import StaggerGroup from "@/components/animations/StaggerGroup";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <StaggerGroup
      className="flex w-full flex-col gap-3"
      stagger={0.07}
      y={20}
    >
      {items.map((item) => (
        <details
          key={item.question}
          data-stagger
          className="group rounded-2xl bg-surface-mid p-5 text-text-inverse transition-colors open:bg-surface-mid/80 sm:p-6"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium sm:text-lg [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-primary text-xl leading-none transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-text-inverse/75 sm:text-base">
            {item.answer}
          </p>
        </details>
      ))}
    </StaggerGroup>
  );
}
