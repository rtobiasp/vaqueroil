import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type BrandButtonProps = {
  link: string;
  text: string;
};

export default function BrandButton({ text, link }: BrandButtonProps) {
  return (
    <Link
      href={link}
      className="flex h-fit flex-row items-center gap-2 rounded-lg bg-accent-primary px-3 py-3 text-bg-dark uppercase transition-colors duration-200 hover:bg-accent-primary-hover hover:text-text-inverse"
    >
      {text}
      <ArrowUpRight aria-hidden="true" />
    </Link>
  );
}
