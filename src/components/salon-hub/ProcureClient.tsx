"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  CheckCircle2,
  Minus,
  Plus,
  ShoppingCart,
  MessageCircle,
  Lock,
} from "lucide-react";
import {
  DistrictMandalFields,
  fieldClass,
  labelClass,
  useGeoSelection,
} from "@/components/salon-hub/DistrictMandalFields";
import {
  formatInr,
  isDemandWindowOpen,
  mandalDeskWhatsAppUrl,
  newOrderId,
  PROCURE_BUNDLES,
  PROCURE_CATALOG,
  saveSalonHubOrder,
} from "@/lib/salon-hub/catalog";
import type { ProcureCartLine, SalonHubOrder } from "@/types/salon-hub";

export function ProcureClient() {
  const windowOpen = isDemandWindowOpen();
  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const item of PROCURE_CATALOG) init[item.id] = false;
    return init;
  });
  const [qty, setQty] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const item of PROCURE_CATALOG) init[item.id] = 1;
    return init;
  });
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [geo, setGeo] = useGeoSelection();
  const [confirmed, setConfirmed] = useState<SalonHubOrder | null>(null);
  const [error, setError] = useState("");

  const lines: ProcureCartLine[] = useMemo(
    () =>
      PROCURE_CATALOG.filter((i) => selected[i.id]).map((i) => ({
        itemId: i.id,
        qty: Math.max(1, qty[i.id] || 1),
      })),
    [selected, qty],
  );

  const total = useMemo(() => {
    return lines.reduce((sum, line) => {
      const item = PROCURE_CATALOG.find((i) => i.id === line.itemId);
      return sum + (item?.unitPriceInr ?? 0) * line.qty;
    }, 0);
  }, [lines]);

  function toggle(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function bumpQty(id: string, delta: number) {
    setQty((q) => ({
      ...q,
      [id]: Math.min(50, Math.max(1, (q[id] || 1) + delta)),
    }));
    setSelected((s) => ({ ...s, [id]: true }));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!windowOpen) {
      setError("నెలవారీ డిమాండ్ విండో (1–5 తేదీలు) మాత్రమే తెరిచి ఉంటుంది.");
      return;
    }
    if (lines.length === 0) {
      setError("కనీసం ఒక వస్తువు ఎంచుకోండి.");
      return;
    }
    const phone = whatsapp.replace(/\D/g, "");
    if (phone.length < 10) {
      setError("సరైన వాట్సాప్ నంబర్ ఇవ్వండి.");
      return;
    }
    if (!geo.districtSlug || !geo.mandalSlug || !name.trim()) {
      setError("పేరు, జిల్లా, మండలం అవసరం.");
      return;
    }

    const order: SalonHubOrder = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      name: name.trim(),
      whatsapp: phone.slice(-10),
      districtSlug: geo.districtSlug,
      districtNameTe: geo.districtNameTe,
      mandalSlug: geo.mandalSlug,
      mandalNameTe: geo.mandalNameTe,
      payment: "cod",
      lines: lines.map((l) => {
        const item = PROCURE_CATALOG.find((i) => i.id === l.itemId)!;
        return {
          itemId: l.itemId,
          nameTe: item.nameTe,
          qty: l.qty,
          unitPriceInr: item.unitPriceInr,
          lineTotalInr: item.unitPriceInr * l.qty,
        };
      }),
      totalInr: total,
    };

    saveSalonHubOrder(order);
    setConfirmed(order);
  }

  if (confirmed) {
    const wa = mandalDeskWhatsAppUrl(confirmed);
    return (
      <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" />
          <div>
            <h2 className="font-display-te text-xl font-normal text-[#0F172A]">
              ఇండెంట్ నమోదు అయింది
            </h2>
            <p className="mt-1 font-telugu text-sm text-[#334155]">
              ఆర్డర్ ID: <span className="font-bold">{confirmed.id}</span> ·{" "}
              {formatInr(confirmed.totalInr)}
            </p>
            <p className="mt-2 font-telugu text-sm text-[#475569]">
              చెల్లింపు: COD / UPI — {confirmed.mandalNameTe} మండల హబ్ వద్ద మాత్రమే.
              ఆర్డర్ మీ పరికరంలో సేవ్ అయింది.
            </p>
          </div>
        </div>
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="tap inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#128C7E] px-4 font-telugu text-sm font-bold text-white sm:w-auto"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          మండల డెస్క్‌కు వాట్సాప్ అలర్ట్
        </a>
        <button
          type="button"
          className="tap ml-0 mt-2 inline-flex min-h-11 items-center rounded-xl border border-[#E2E8F0] bg-white px-4 font-telugu text-sm font-semibold text-[#0F172A] sm:ml-3"
          onClick={() => setConfirmed(null)}
        >
          మరో ఇండెంట్
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className={`rounded-2xl border px-4 py-3 font-telugu text-sm ${
          windowOpen
            ? "border-emerald-200 bg-emerald-50/70 text-emerald-900"
            : "border-amber-200 bg-amber-50/80 text-amber-950"
        }`}
        role="status"
      >
        {windowOpen ? (
          <>
            <span className="font-bold">నెలవారీ డిమాండ్ విండో తెరిచి ఉంది</span> —
            ప్రతి నెల 1–5 తేదీలు మాత్రమే సమూహ ఇండెంట్ స్వీకరించబడుతుంది.
          </>
        ) : (
          <>
            <span className="font-bold">డిమాండ్ విండో మూసి ఉంది</span> — ప్రతి నెల
            1–5 తేదీలలో మాత్రమే ఇండెంట్ ఇవ్వండి. ఇప్పుడు కేటలాగ్ చూడవచ్చు; సబ్మిట్
            లాక్.
          </>
        )}
      </div>

      {PROCURE_BUNDLES.map((bundle) => {
        const items = PROCURE_CATALOG.filter((i) => i.bundleId === bundle.id);
        return (
          <section
            key={bundle.id}
            className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm"
          >
            <h2 className="font-display-te text-lg font-normal text-[#0F172A]">
              {bundle.titleTe}
            </h2>
            <p className="mt-0.5 font-telugu text-xs text-[#64748B]">
              {bundle.subtitleTe}
            </p>
            <ul className="mt-3 space-y-2">
              {items.map((item) => {
                const on = selected[item.id];
                return (
                  <li
                    key={item.id}
                    className="flex flex-col gap-2 rounded-xl border border-[#F1F5F9] bg-[#FBFBFA] p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(item.id)}
                        className="mt-1 h-4 w-4 accent-[#B45309]"
                      />
                      <span className="min-w-0">
                        <span className="block font-telugu text-sm font-semibold text-[#0F172A]">
                          {item.nameTe}
                        </span>
                        <span className="text-xs text-[#64748B]">
                          {formatInr(item.unitPriceInr)} / {item.unitTe}
                        </span>
                      </span>
                    </label>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        className="tap inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white"
                        onClick={() => bumpQty(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-bold tabular-nums">
                        {qty[item.id] || 1}
                      </span>
                      <button
                        type="button"
                        className="tap inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white"
                        onClick={() => bumpQty(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <form
        onSubmit={submit}
        className="space-y-4 rounded-2xl border border-[#EAD7B5] bg-gradient-to-b from-white to-[#FFFDF9] p-4"
      >
        <h2 className="flex items-center gap-2 font-display-te text-lg font-normal text-[#0F172A]">
          <ShoppingCart className="h-5 w-5 text-[#B45309]" aria-hidden />
          చెక్‌అవుట్
        </h2>
        <p className="font-telugu text-sm text-[#475569]">
          మొత్తం:{" "}
          <span className="font-bold text-[#B45309]">{formatInr(total)}</span>
        </p>

        <div>
          <label className={labelClass} htmlFor="procure-name">
            పేరు *
          </label>
          <input
            id="procure-name"
            className={fieldClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="procure-wa">
            వాట్సాప్ నంబర్ *
          </label>
          <input
            id="procure-wa"
            className={fieldClass}
            inputMode="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="10 అంకెలు"
            required
          />
        </div>

        <DistrictMandalFields
          value={geo}
          onChange={setGeo}
          idPrefix="procure"
        />

        <fieldset className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
          <legend className="px-1 font-telugu text-sm font-semibold text-[#0F172A]">
            చెల్లింపు (మండల హబ్ లాక్)
          </legend>
          <div className="mt-2 flex flex-wrap gap-3">
            <label className="inline-flex items-center gap-2 font-telugu text-sm text-[#334155]">
              <input
                type="radio"
                name="pay"
                checked
                readOnly
                className="accent-[#B45309]"
              />
              COD — మండల హబ్
            </label>
            <label className="inline-flex items-center gap-2 font-telugu text-sm text-[#334155]">
              <input
                type="radio"
                name="pay"
                disabled
                className="accent-[#B45309]"
              />
              UPI — మండల హబ్
              <Lock className="h-3.5 w-3.5 text-[#94A3B8]" aria-hidden />
            </label>
          </div>
          <p className="mt-2 font-telugu text-[11px] text-[#64748B]">
            ఆన్‌లైన్ చెల్లింపు లేదు — COD/UPI రెండూ మండల హబ్ డెస్క్ వద్ద మాత్రమే.
          </p>
        </fieldset>

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-telugu text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!windowOpen}
          className="tap inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#B45309] px-4 font-telugu text-sm font-bold text-white shadow-[0_0_14px_rgba(180,83,9,0.25)] transition hover:bg-[#92400E] disabled:cursor-not-allowed disabled:opacity-50"
        >
          ఇండెంట్ నమోదు చేయండి
        </button>
      </form>
    </div>
  );
}
