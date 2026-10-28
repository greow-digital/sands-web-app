"use client";

import { useActionState } from "react";
import { loggaIn } from "../actions";

export default function Inloggning() {
  const [res, action, pending] = useActionState(loggaIn, null);
  return (
    <form action={action} className="space-y-3">
      <label className="block text-sm font-medium">
        Lösenord
        <input
          name="losen"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-border px-3 py-2"
        />
      </label>
      {res?.fel && <p className="text-sm text-red-600">{res.fel}</p>}
      <button disabled={pending} className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white disabled:opacity-60">
        {pending ? "Loggar in..." : "Logga in"}
      </button>
    </form>
  );
}
