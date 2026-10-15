"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { LaunchpadItem, LaunchpadStatus } from "@/lib/growthship/types";
import { Badge, RatingBadge } from "./Badge";

interface Column {
  status: LaunchpadStatus;
  title: string;
  hint: string;
  /** Columns a Claude Code runner would move cards through on its own. */
  automated?: boolean;
}

const COLUMNS: Column[] = [
  { status: "Backlog", title: "Backlog", hint: "Plockat från The Radar" },
  { status: "Ready", title: "Redo att bygga", hint: "Brief klar, kan startas" },
  { status: "Building", title: "Bygger", hint: "Claude Code arbetar på en branch", automated: true },
  { status: "Review", title: "Granskning", hint: "PR och preview väntar på dig", automated: true },
  { status: "Shipped", title: "Live", hint: "Mergad till main", automated: true },
  { status: "Measured", title: "Utvärderad", hint: "Resultat och lärdom" },
];

const COLUMN_TITLE = Object.fromEntries(COLUMNS.map((c) => [c.status, c.title])) as Record<
  LaunchpadStatus,
  string
>;

type Patch = Partial<Pick<LaunchpadItem, "status" | "brief" | "result" | "learning">>;

async function patchItem(id: string, body: Patch): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/growthship/launchpad", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...body }),
  });
  if (res.ok) return { ok: true };
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  return { ok: false, error: data.error ?? "Kunde inte spara." };
}

function LaunchpadCard({
  item,
  onOpen,
  dragging,
  onDragStart,
  onDragEnd,
}: {
  item: LaunchpadItem;
  onOpen: () => void;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const impl = item.implementation;
  return (
    <button
      type="button"
      className="gs-kanban-card"
      data-dragging={dragging}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", item.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onClick={onOpen}
    >
      <span className="gs-kanban-card-title">{item.title}</span>
      <span className="gs-kanban-card-desc">{item.hypothesis}</span>
      <span className="gs-opportunity-meta">
        <RatingBadge label="Impact" value={item.expectedImpact} />
        <Badge tone="low">Effort {item.effort}</Badge>
        {item.status === "Backlog" && !item.brief?.trim() && <Badge tone="medium">Saknar brief</Badge>}
        {impl?.state === "failed" && <Badge tone="danger">Bygget misslyckades</Badge>}
        {impl?.branch && <Badge tone="neutral">{impl.branch}</Badge>}
      </span>
    </button>
  );
}

function ItemDialog({
  item,
  onClose,
  onMove,
  initialError,
}: {
  item: LaunchpadItem;
  onClose: () => void;
  onMove: (status: LaunchpadStatus, extra?: Patch) => Promise<string | null>;
  initialError: string | null;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [brief, setBrief] = useState(item.brief ?? "");
  const [result, setResult] = useState(item.result ?? "");
  const [learning, setLearning] = useState(item.learning ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  const briefEditable = item.status === "Backlog" || item.status === "Ready";
  const showOutcome = item.status === "Shipped" || item.status === "Measured";

  async function save() {
    setSaving(true);
    const res = await patchItem(item.id, {
      ...(briefEditable ? { brief } : {}),
      ...(showOutcome ? { result, learning } : {}),
    });
    setSaving(false);
    if (!res.ok) return setError(res.error);
    router.refresh();
    onClose();
  }

  async function move(status: LaunchpadStatus) {
    setSaving(true);
    // Send the brief along, so writing it and moving out of Backlog is one step.
    const err = await onMove(status, briefEditable ? { brief } : undefined);
    setSaving(false);
    if (err) setError(err);
    else onClose();
  }

  return (
    <dialog ref={ref} className="gs-dialog" onClose={onClose} aria-labelledby="gs-dialog-title">
      <div className="gs-dialog-head">
        <div>
          <div className="gs-kanban-col-hint">{COLUMN_TITLE[item.status]}</div>
          <h2 id="gs-dialog-title" className="gs-dialog-title">
            {item.title}
          </h2>
        </div>
        <button type="button" className="gs-btn" data-variant="ghost" onClick={onClose} aria-label="Stäng">
          ✕
        </button>
      </div>

      <div className="gs-dialog-body">
        <section>
          <div className="gs-dialog-label">Hypotes</div>
          <p className="gs-opportunity-desc">{item.hypothesis}</p>
        </section>

        <section>
          <label className="gs-dialog-label" htmlFor="gs-brief">
            Brief
          </label>
          <p className="gs-dialog-help">
            Det här är vad Claude Code kommer att få som uppdrag. Skriv vilka sidor eller filer som berörs, vad som ska
            ändras och hur man ser att det fungerar.
          </p>
          <textarea
            id="gs-brief"
            className="gs-input"
            rows={7}
            value={brief}
            readOnly={!briefEditable}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Ex: Lägg till FAQ-fråga om snörasskydd på /tjanster/takbyte. Uppdatera FAQPage JSON-LD. Verifiera med Rich Results Test."
          />
        </section>

        {item.status === "Ready" && (
          <section className="gs-dialog-agent">
            <div>
              <div className="gs-dialog-label">Implementation</div>
              <p className="gs-dialog-help" style={{ marginBottom: 0 }}>
                Kommer: startar en Claude Code-session som bygger briefen på en egen branch, öppnar en PR och flyttar
                kortet till Granskning.
              </p>
            </div>
            <button type="button" className="gs-btn" disabled title="Inte inkopplat ännu">
              Starta med Claude Code
            </button>
          </section>
        )}

        {item.implementation && (
          <section>
            <div className="gs-dialog-label">Senaste körning</div>
            <div className="gs-opportunity-meta">
              <Badge tone={item.implementation.state === "failed" ? "danger" : "neutral"}>
                {item.implementation.state}
              </Badge>
              {item.implementation.branch && <Badge tone="low">{item.implementation.branch}</Badge>}
              {item.implementation.pullRequestUrl && (
                <a className="gs-link" href={item.implementation.pullRequestUrl} target="_blank" rel="noreferrer">
                  Pull request
                </a>
              )}
              {item.implementation.previewUrl && (
                <a className="gs-link" href={item.implementation.previewUrl} target="_blank" rel="noreferrer">
                  Preview
                </a>
              )}
            </div>
          </section>
        )}

        {showOutcome && (
          <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="gs-dialog-label">Utfall</div>
            <textarea
              className="gs-input"
              placeholder="Resultat (vad hände?)"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              rows={2}
            />
            <textarea
              className="gs-input"
              placeholder="Lärdom (vad tar vi med oss?)"
              value={learning}
              onChange={(e) => setLearning(e.target.value)}
              rows={2}
            />
          </section>
        )}

        {error && (
          <p role="alert" className="gs-dialog-error">
            {error}
          </p>
        )}
      </div>

      <div className="gs-dialog-foot">
        <label className="gs-dialog-move">
          <span>Flytta till</span>
          <select
            className="gs-input"
            value={item.status}
            disabled={saving}
            onChange={(e) => move(e.target.value as LaunchpadStatus)}
          >
            {COLUMNS.map((c) => (
              <option key={c.status} value={c.status}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        {(briefEditable || showOutcome) && (
          <button type="button" className="gs-btn" data-variant="primary" disabled={saving} onClick={save}>
            {saving ? "Sparar..." : "Spara"}
          </button>
        )}
      </div>
    </dialog>
  );
}

export default function LaunchpadBoard({ items }: { items: LaunchpadItem[] }) {
  const router = useRouter();
  // Local copy so a drop moves the card immediately; resynced whenever the
  // server sends fresh items after router.refresh().
  const [board, setBoard] = useState(items);
  const [synced, setSynced] = useState(items);
  if (synced !== items) {
    setSynced(items);
    setBoard(items);
  }

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<LaunchpadStatus | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [openError, setOpenError] = useState<string | null>(null);

  async function move(id: string, status: LaunchpadStatus, extra?: Patch): Promise<string | null> {
    const before = board;
    const current = before.find((i) => i.id === id);
    if (!current || (current.status === status && !extra)) return null;
    setBoard((b) => b.map((i) => (i.id === id ? { ...i, ...extra, status } : i)));
    const res = await patchItem(id, { ...extra, status });
    if (!res.ok) {
      setBoard(before);
      return res.error;
    }
    router.refresh();
    return null;
  }

  async function drop(status: LaunchpadStatus, id: string) {
    setOverColumn(null);
    setDraggingId(null);
    const err = await move(id, status);
    // The usual reason is a missing brief, which is written in the dialog.
    if (err) {
      setOpenError(err);
      setOpenId(id);
    }
  }

  const openItem = openId ? board.find((i) => i.id === openId) : null;

  return (
    <>
      <div className="gs-kanban" role="list">
        {COLUMNS.map((col) => {
          const cards = board.filter((i) => i.status === col.status);
          return (
            <section
              key={col.status}
              role="listitem"
              aria-label={col.title}
              className="gs-kanban-col"
              data-automated={col.automated ?? false}
              data-over={overColumn === col.status}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (overColumn !== col.status) setOverColumn(col.status);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverColumn(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                if (id) drop(col.status, id);
              }}
            >
              <header className="gs-kanban-col-head">
                <div className="gs-kanban-col-title">
                  {col.title}
                  <span className="gs-kanban-count">{cards.length}</span>
                </div>
                <div className="gs-kanban-col-hint">{col.hint}</div>
              </header>
              <div className="gs-kanban-cards">
                {cards.map((item) => (
                  <LaunchpadCard
                    key={item.id}
                    item={item}
                    dragging={draggingId === item.id}
                    onDragStart={() => setDraggingId(item.id)}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setOverColumn(null);
                    }}
                    onOpen={() => {
                      setOpenError(null);
                      setOpenId(item.id);
                    }}
                  />
                ))}
                {cards.length === 0 && <div className="gs-kanban-empty">Släpp kort här</div>}
              </div>
            </section>
          );
        })}
      </div>

      {openItem && (
        <ItemDialog
          key={openItem.id}
          item={openItem}
          initialError={openError}
          onClose={() => {
            setOpenId(null);
            setOpenError(null);
          }}
          onMove={(status, extra) => move(openItem.id, status, extra)}
        />
      )}
    </>
  );
}
