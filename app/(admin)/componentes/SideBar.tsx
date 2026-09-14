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
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  // Cierra con Escape y bloquea el scroll del body
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Topbar móvil */}
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/10 bg-bg-dark bg-felt px-4 py-3 text-text-inverse lg:hidden">
        <Image
          src={logo}
          loading="eager"
          alt="Logotipo del sitio"
          className="w-32 object-contain sm:w-40"
        />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú de administración"
          aria-expanded={mobileOpen}
          className="rounded-md border border-white/10 p-2 text-text-inverse/80 transition-colors hover:bg-surface-mid hover:text-text-inverse"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar desktop */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden bg-bg-dark bg-felt border-r border-white/10 text-text-inverse transition-all duration-300 ease-in-out lg:flex ${collapsed ? "w-20 px-3" : "w-64 px-6"}`}
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
            type="button"
            aria-label={collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
            aria-expanded={!collapsed}
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

      {/* Overlay móvil */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      {/* Drawer móvil */}
      <aside
        aria-label="Menú de administración"
        aria-hidden={!mobileOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-80 flex-col bg-bg-dark bg-felt border-r border-white/10 text-text-inverse transition-transform duration-300 ease-in-out lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <header className="flex w-full flex-row items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
          <Image
            src={logo}
            loading="eager"
            alt="Logotipo del sitio"
            className="w-32 object-contain"
          />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú de administración"
            className="rounded-md border border-white/10 p-2 text-text-inverse/80 transition-colors hover:bg-surface-mid hover:text-text-inverse"
          >
            <X size={20} />
          </button>
        </header>
        <nav
          className="flex-1 overflow-y-auto px-4 pt-4 pb-6"
          aria-label="Navegación primaria móvil"
        >
          <ul className="flex flex-col w-full text-text-inverse/75 gap-1">
            {NAV_ITEMS.map((item) => (
              <SideBarItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
