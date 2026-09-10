import { ArrowUpRight } from "lucide-react";

type BrandButtonProps = {
  link: string;
  text: string;
};

export default function BrandButton({ text, link }: BrandButtonProps) {
  return (
    <a
      href={link}
      className="flex h-fit flex-row items-center gap-2 px-3 py-3 uppercase rounded-lg transition-colors duration-200 bg-accent-primary text-text-inverse hover:bg-accent-primary-hover"
    >
      {text}
      <ArrowUpRight />
    </a>
  );
}
