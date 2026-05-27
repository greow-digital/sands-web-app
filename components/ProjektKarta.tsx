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

const CUSTOMER_DOT = L.divIcon({
  className: "sands-customer-dot",
  html: `<div style="
    width: 10px;
    height: 10px;
    background: #a78bfa;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    opacity: 0.85;
  "></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

function projectClusterIcon(cluster: { getChildCount: () => number }) {
  const count = cluster.getChildCount();
  const size = count >= 10 ? 44 : 38;
  return L.divIcon({
    className: "sands-cluster-project",
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
      font-size: 13px;
      font-family: var(--font-heading), system-ui;
      box-shadow: 0 2px 8px rgba(43,116,252,0.45);
      border: 3px solid white;
    ">${count}</div>`,
    iconSize: [size, size],
  });
}

function customerClusterIcon(cluster: { getChildCount: () => number }) {
  const count = cluster.getChildCount();
  const size = count >= 1000 ? 60 : count >= 250 ? 52 : count >= 50 ? 44 : 38;
  const fontSize = count >= 1000 ? 14 : 13;
  return L.divIcon({
    className: "sands-cluster-customer",
    html: `<div style="
      background: rgba(167,139,250,0.92);
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
      box-shadow: 0 2px 10px rgba(167,139,250,0.55);
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

    const markerClusterGroup = (
      L as unknown as {
        markerClusterGroup: (opts?: object) => L.LayerGroup;
      }
    ).markerClusterGroup;

    // Customer cluster (below project pins) — each customer is snapped to
    // its grid cell center (500m). spiderfy disabled so individual cell
    // positions are never revealed; markers at identical coords stay
    // stacked as a single visible dot at max zoom.
    if (densityCells && densityCells.length > 0) {
      const customerCluster = markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: false,
        zoomToBoundsOnClick: false,
        maxClusterRadius: 80,
        chunkedLoading: true,
        iconCreateFunction: customerClusterIcon,
      });
      for (const cell of densityCells) {
        for (let i = 0; i < cell.count; i++) {
          customerCluster.addLayer(
            L.marker([cell.lat, cell.lng], {
              icon: CUSTOMER_DOT,
              interactive: false,
              keyboard: false,
            })
          );
        }
      }
      map.addLayer(customerCluster);
    }

    // Project cluster (on top) — blue, clickable, popups
    const cluster = markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 40,
      iconCreateFunction: projectClusterIcon,
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

    // Lock initial view to Stockholm — outliers (Nyköping/Västerås) still
    // reachable by zooming out, but heatmap and most pins stay in focus.
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
