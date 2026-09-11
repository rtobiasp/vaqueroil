"use client";

import Image from "next/image";
import logo from "@/public/logo.png";
import {
  LayoutDashboard,
  CalendarDays,
  Car,
  Wrench,
  Users,
  Menu,
} from "lucide-react";
import { useState } from "react";
import SideBarItem from "./ui/SideBarItem";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/admin/cars", label: "Cars", icon: Car },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function SideBar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col min-h-screen shrink-0 transition-all duration-300 ease-in-out overflow-hidden bg-bg-dark bg-felt border-r border-white/10 text-text-inverse ${collapsed ? "w-20 px-3" : "w-64 px-6"}`}
      aria-label="Barra lateral"
    >
      <header
        className={`w-full h-auto flex flex-row items-center py-3 border-b border-white/10 transition-all duration-300 ${collapsed ? "justify-center" : "justify-between"}`}
      >
        <Image
          src={logo}
          loading="eager"
          alt="Logotipo del sitio"
          className={`transition-all duration-300 object-contain ${collapsed ? "w-0 opacity-0" : "w-40 opacity-100"}`}
        />
        <button
          className="rounded-md border border-white/10 p-1.5 text-text-inverse/70 transition-colors duration-200 hover:bg-surface-mid hover:text-text-inverse hover:cursor-pointer"
          onClick={() => {
            setCollapsed(collapsed ? false : true);
          }}
        >
          <Menu />
        </button>
      </header>
      <nav
        className="flex flex-col justify-center items-center pt-4"
        aria-label="Navegación primaria"
      >
        <ul className="flex flex-col w-full text-text-inverse/75 gap-1">
          {NAV_ITEMS.map((item) => (
            <SideBarItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              collapsed={collapsed}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
