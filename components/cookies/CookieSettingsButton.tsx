"use client";

import { useCookieConsent } from "./consent-context";

export default function CookieSettingsButton() {
  const { reset } = useCookieConsent();

  return (
    <button
      type="button"
      onClick={reset}
      className="transition-colors hover:text-text-inverse"
    >
      Cookies
    </button>
  );
}
