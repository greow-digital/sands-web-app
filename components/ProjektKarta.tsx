"use client";

import { useEffect, useRef } from "react";
import L, { type Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

export type ProjektPin = {
  slug: string;
  title: string;
  ort: string;
  typ: string | null;
  kvm: number | null;
  ar: number | null;
  lat: number;
  lng: number;
};

const PIN_ICON = L.divIcon({
  className: "sands-pin",
  html: `<div style="
    width: 18px;
    height: 18px;
    background: #2B74FC;
    border: 2.5px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0,0,0,0.35);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildPopup(pin: ProjektPin): string {
  const sub = [pin.typ, pin.kvm && `${pin.kvm} kvm`, pin.ar]
    .filter(Boolean)
    .join(" · ");
  return `
    <div style="font-family: var(--font-body), system-ui; min-width: 200px;">
      <div style="font-weight: 700; font-size: 14px; color: #060607; margin-bottom: 4px;">
        ${escapeHtml(pin.title)}
      </div>
      <div style="font-size: 12px; color: #6B7280; margin-bottom: 10px;">
        ${escapeHtml(sub)}
      </div>
      <a href="/projekt-sanity-poc/${encodeURIComponent(pin.slug)}"
         style="font-size: 13px; font-weight: 600; color: #2B74FC; text-decoration: none;">
        Se projekt →
      </a>
    </div>
  `;
}

interface ProjektKartaProps {
  pins: ProjektPin[];
}

export default function ProjektKarta({ pins }: ProjektKartaProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [59.37, 18.0],
      zoom: 9,
      scrollWheelZoom: false,
      attributionControl: true,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    // markercluster injects markerClusterGroup onto L when imported
    const cluster = (
      L as unknown as {
        markerClusterGroup: (opts?: object) => L.LayerGroup;
      }
    ).markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 50,
    });

    for (const pin of pins) {
      const marker = L.marker([pin.lat, pin.lng], { icon: PIN_ICON });
      marker.bindPopup(buildPopup(pin), {
        closeButton: true,
        autoPanPadding: [40, 40],
      });
      cluster.addLayer(marker);
    }

    map.addLayer(cluster);

    // Fit map to all pins (with reasonable padding)
    if (pins.length > 0) {
      const bounds = L.latLngBounds(
        pins.map((p) => [p.lat, p.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [pins]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[420px] md:h-[520px] rounded-2xl overflow-hidden border border-gray-100"
      aria-label="Karta över utförda projekt i Stockholmsområdet"
    />
  );
}
