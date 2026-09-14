"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

type SideBarItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  collapsed?: boolean;
  onNavigate?: () => void;
};

export default function SideBarItem({
  href,
  label,
  icon: Icon,
  collapsed = false,
  onNavigate,
}: SideBarItemProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        title={collapsed ? label : undefined}
        className={`flex flex-row gap-2 items-center rounded-xl px-3 py-2 transition-colors duration-200 overflow-hidden whitespace-nowrap ${
          active
            ? "bg-accent-primary text-text-inverse hover:bg-accent-primary-hover"
            : "hover:bg-surface-mid hover:text-text-inverse"
        } ${collapsed ? "justify-center" : ""}`}
      >
        <Icon className="shrink-0" />
        <span
          className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${collapsed ? "hidden" : ""}`}
        >
          {label}
        </span>
      </Link>
    </li>
  );
}
