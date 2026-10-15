"use client";

import { useMemo, useState } from "react";

export interface TableColumn<T> {
  key: string;
  label: string;
  numeric?: boolean;
  get: (row: T) => string | number | null;
  format?: (row: T) => string;
  /** 1 if a higher value is good, -1 if lower is good, omit for neutral. */
  better?: 1 | -1;
}

export default function SortableTable<T>({
  rows,
  columns,
  rowKey,
  defaultSortKey,
  defaultDesc = true,
}: {
  rows: T[];
  columns: TableColumn<T>[];
  rowKey: (row: T) => string;
  defaultSortKey?: string;
  defaultDesc?: boolean;
}) {
  const [sort, setSort] = useState<{ key: string; desc: boolean }>({
    key: defaultSortKey ?? columns[0].key,
    desc: defaultDesc,
  });

  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const va = col.get(a);
      const vb = col.get(b);
      if (col.numeric) {
        const na = va == null ? null : Number(va);
        const nb = vb == null ? null : Number(vb);
        if (na == null) return 1;
        if (nb == null) return -1;
        return sort.desc ? nb - na : na - nb;
      }
      return sort.desc
        ? String(vb ?? "").localeCompare(String(va ?? ""))
        : String(va ?? "").localeCompare(String(vb ?? ""));
    });
    return copy;
  }, [rows, columns, sort]);

  function toggleSort(key: string, numeric?: boolean) {
    setSort((prev) =>
      prev.key === key ? { key, desc: !prev.desc } : { key, desc: !!numeric }
    );
  }

  function changeClass(row: T, col: TableColumn<T>): string | undefined {
    if (!col.better) return undefined;
    const v = col.get(row);
    if (v == null) return undefined;
    const n = Number(v);
    if (n === 0) return undefined;
    return Math.sign(n) * col.better > 0 ? "sd-good" : "sd-bad";
  }

  return (
    <div className="gs-tablebox" style={{ maxHeight: "22rem", overflow: "auto" }}>
      <table className="gs-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={c.numeric ? "sd-num" : undefined}
                aria-sort={sort.key === c.key ? (sort.desc ? "descending" : "ascending") : undefined}
              >
                <button
                  type="button"
                  onClick={() => toggleSort(c.key, c.numeric)}
                  style={{
                    all: "unset",
                    cursor: "pointer",
                    color: sort.key === c.key ? "var(--gs-text)" : "inherit",
                  }}
                >
                  {c.label}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((c) => {
                const cls = changeClass(row, c);
                return (
                  <td
                    key={c.key}
                    className={c.numeric ? "sd-num" : undefined}
                    style={{
                      color:
                        cls === "sd-good"
                          ? "var(--gs-success)"
                          : cls === "sd-bad"
                            ? "var(--gs-danger)"
                            : undefined,
                      maxWidth: c.numeric ? undefined : "22rem",
                      overflow: c.numeric ? undefined : "hidden",
                      textOverflow: c.numeric ? undefined : "ellipsis",
                      whiteSpace: c.numeric ? undefined : "nowrap",
                    }}
                    title={c.numeric ? undefined : String(c.get(row) ?? "")}
                  >
                    {c.format ? c.format(row) : (c.get(row) ?? "-")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
