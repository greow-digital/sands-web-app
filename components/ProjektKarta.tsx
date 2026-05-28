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

export type DensityCell = {
  lat: number;
  lng: number;
  count: number;
};

// Highlighted pin for the projects we've written customer cases about.
// Larger, fully opaque, with a soft blue halo so it pops out from the
// background project dots when a cluster breaks apart.
const CASE_PIN = L.divIcon({
  className: "sands-case-pin",
  html: `<div style="
    width: 22px;
    height: 22px;
    background: #2B74FC;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow:
      0 0 0 3px rgba(43,116,252,0.25),
      0 2px 8px rgba(0,0,0,0.3);
    position: relative;
  "><div style="
    position: absolute;
    inset: 5px;
    background: white;
    border-radius: 50%;
  "></div></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

// Background project marker, represents one completed job among the
// 2 600+ we've done. Small and subtle so the case-study pins (CASE_PIN)
// remain the visual focus.
const PROJECT_DOT = L.divIcon({
  className: "sands-project-dot",
  html: `<div style="
    width: 8px;
    height: 8px;
    background: #2B74FC;
    border: 1.5px solid white;
    border-radius: 50%;
    opacity: 0.75;
  "></div>`,
  iconSize: [8, 8],
  iconAnchor: [4, 4],
});

function projektClusterIcon(cluster: { getChildCount: () => number }) {
  const count = cluster.getChildCount();
  const size = count >= 1000 ? 60 : count >= 250 ? 52 : count >= 50 ? 44 : 38;
  const fontSize = count >= 1000 ? 14 : 13;
  return L.divIcon({
    className: "sands-cluster-projekt",
    html: `<div style="
      background: #2B74FC;
      color: white;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: ${fontSize}px;
      font-family: var(--font-heading), system-ui;
      box-shadow: 0 2px 10px rgba(43,116,252,0.45);
      border: 3px solid white;
    ">${count.toLocaleString("sv-SE")}</div>`,
    iconSize: [size, size],
  });
}

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
      <div style="font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #2B74FC; margin-bottom: 4px;">
        Kundcase
      </div>
      <div style="font-weight: 700; font-size: 14px; color: #060607; margin-bottom: 4px;">
        ${escapeHtml(pin.title)}
      </div>
      <div style="font-size: 12px; color: #6B7280; margin-bottom: 10px;">
        ${escapeHtml(sub)}
      </div>
      <a href="/projekt-sanity-poc/${encodeURIComponent(pin.slug)}"
         style="font-size: 13px; font-weight: 600; color: #2B74FC; text-decoration: none;">
        Läs kundcaset →
      </a>
    </div>
  `;
}

interface ProjektKartaProps {
  pins: ProjektPin[];
  densityCells?: DensityCell[];
}

export default function ProjektKarta({ pins, densityCells }: ProjektKartaProps) {
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

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    // Unified cluster: every completed project (anonymized address dots
    // + highlighted case-study pins). spiderfy disabled so customer
    // markers stacked at the same 500m grid cell never expand.
    const cluster = (
      L as unknown as {
        markerClusterGroup: (opts?: object) => L.LayerGroup;
      }
    ).markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 90,
      chunkedLoading: true,
      iconCreateFunction: projektClusterIcon,
    });

    // Background project dots first, case pins added last so they
    // render on top when a cluster breaks apart.
    if (densityCells && densityCells.length > 0) {
      for (const cell of densityCells) {
        for (let i = 0; i < cell.count; i++) {
          cluster.addLayer(
            L.marker([cell.lat, cell.lng], {
              icon: PROJECT_DOT,
              interactive: false,
              keyboard: false,
            })
          );
        }
      }
    }

    for (const pin of pins) {
      const marker = L.marker([pin.lat, pin.lng], {
        icon: CASE_PIN,
        zIndexOffset: 1000,
      });
      marker.bindPopup(buildPopup(pin), {
        closeButton: true,
        autoPanPadding: [40, 40],
      });
      cluster.addLayer(marker);
    }

    map.addLayer(cluster);

    // Lock initial view to Stockholm, outliers (Nyköping/Västerås)
    // still reachable by zooming out.
    map.fitBounds(
      L.latLngBounds([59.22, 17.65], [59.55, 18.35]),
      { padding: [20, 20] }
    );

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [pins, densityCells]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[420px] md:h-[520px] rounded-2xl overflow-hidden border border-gray-100"
      aria-label="Karta över utförda projekt i Stockholmsområdet"
    />
  );
}
