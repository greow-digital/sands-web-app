"use client";

import { useEffect } from "react";

const CLICK_ID_PARAMS = ["gclid", "gbraid", "wbraid"] as const;
const COOKIE_EXPIRY_DAYS = 90;

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export default function ClickIdCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    for (const name of CLICK_ID_PARAMS) {
      const value = params.get(name);
      if (value) setCookie(name, value, COOKIE_EXPIRY_DAYS);
    }
  }, []);

  return null;
}
