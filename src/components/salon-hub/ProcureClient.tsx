"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Minus, Package, Plus, X } from "lucide-react";
import {
  DistrictMandalFields,
  fieldClass,
  labelClass,
  useGeoSelection,
} from "@/components/salon-hub/DistrictMandalFields";
import {
  formatInr,
  indentWhatsAppSlipUrl,
  newIndentOrderId,
  PROCURE_PACKAGES,
  saveSalonHubOrder,
} from "@/lib/salon-hub/catalog";
import type { ProcurePackageId, SalonHubOrder } from "@/types/salon-hub";

const MAX_QTY = 20;

export function ProcureClient() {
  const [qty, setQty] = useState<Record<ProcurePackageId, number>>({
    barber: 0,
    spa: 0,
    towels: 0,
  });
  const [salonName, setSalonName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [geo, setGeo] = useGeoSelection();
  const [confirmed, setConfirmed] = useState<SalonHubOrder | null>(null);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const cart = useMemo(() => {
    const lines = PROCURE_PACKAGES.filter((p) => qty[p.id] > 0).map((p) => {
      const q = qty[p.id];
      return {
        packageId: p.id,
        nameTe: p.nameTe,
        qty: q,
        hubPriceInr: p.hubPriceInr,
        mrpInr: p.mrpInr,
        lineTotalInr: p.hubPriceInr * q,
        lineSavingsInr: (p.mrpInr - p.hubPriceInr) * q,
      };
    });
    const totalItems = lines.reduce((s, l) => s + l.qty, 0);
    const totalInr = lines.reduce((s, l) => s + l.lineTotalInr, 0);
    const savingsInr = lines.reduce((s, l) => s + l.lineSavingsInr, 0);
    return { lines, totalItems, totalInr, savingsInr };
  }, [qty]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (confirmed) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [confirmed]);

  function bumpQty(id: ProcurePackageId, delta: number) {
    setQty((q) => ({
      ...q,
      [id]: Math.min(MAX_QTY, Math.max(0, (q[id] || 0) + delta)),
    }));
  }

  function setQtyExact(id: ProcurePackageId, value: number) {
    const n = Number.isFinite(value) ? Math.floor(value) : 0;
    setQty((q) => ({
      ...q,
      [id]: Math.min(MAX_QTY, Math.max(0, n)),
    }));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (cart.lines.length === 0) {
      setError("కనీసం ఒక ప్యాకేజ్ ఎంచుకోండి (+ తో పరిమాణం పెంచండి).");
      return;
    }
    const phone = whatsapp.replace(/\D/g, "");
    if (phone.length !== 10) {
      setError("వాట్సాప్ నంబర్ సరిగ్గా 10 అంకెలు ఉండాలి.");
      return;
    }
    if (!salonName.trim() || !ownerName.trim()) {
      setError("సెలూన్ పేరు మరియు యజమాని పేరు అవసరం.");
      return;
    }
    if (!geo.districtSlug || !geo.mandalSlug) {
      setError("జిల్లా మరియు మండలం ఎంచుకోండి.");
      return;
    }

    const order: SalonHubOrder = {
      id: newIndentOrderId(geo.mandalSlug),
      createdAt: new Date().toISOString(),
      salonName: salonName.trim(),
      ownerName: ownerName.trim(),
      whatsapp: phone,
      districtSlug: geo.districtSlug,
      districtNameTe: geo.districtNameTe,
      mandalSlug: geo.mandalSlug,
      mandalNameTe: geo.mandalNameTe,
      payment: "cod_upi_hub",
      lines: cart.lines,
      totalItems: cart.totalItems,
      totalInr: cart.totalInr,
      savingsInr: cart.savingsInr,
    };

    saveSalonHubOrder(order);
    setConfirmed(order);
  }

  function closeModal() {
    setConfirmed(null);
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <header className="text-center">
        <p className="inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-[#B45309]/25 bg-[#B45309]/10 px-3 py-1.5 font-telugu text-xs font-semibold tracking-wide text-[#B45309] sm:text-sm">
          మధ్యవర్తులు లేని హోల్‌సేల్ ధరలు • ఫ్యాక్టరీ డిస్కౌంట్లు
        </p>
        <h1 className="mt-4 font-display-te text-3xl font-normal leading-snug text-[#0F172A] sm:text-4xl">
          సెలూన్ సామాగ్రి సమూహ కొనుగోళ్లు
        </h1>
        <p className="mt-1 font-telugu text-base text-[#64748B] sm:text-lg">
          Salon Supplies Wholesale Group Indent Desk
        </p>
        <p className="mx-auto mt-3 max-w-2xl font-telugu text-sm leading-relaxed text-[#475569] sm:text-base">
          తెలంగాణలోని సెలూన్ యజమానులందరి డిమాండ్‌ను కలిపి, నేరుగా తయారీదారుల
          నుంచే 30% నుండి 45% తగ్గింపు ధరలకు నాణ్యమైన సామాగ్రిని మీ మండల
          కేంద్రానికి అందిస్తాము.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"
            aria-hidden
          />
          నెలవారీ ఆర్డర్ల విండో ఓపెన్: ప్రతి నెలా 1వ తేదీ నుండి 5వ తేదీ వరకు •
          మండల హబ్‌లో డెలివరీ
        </div>
      </header>

      {/* Dual column */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start">
        {/* LEFT — packages */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[#B45309]" aria-hidden />
            <h2 className="font-display-te text-lg font-normal text-[#0F172A]">
              ప్యాకేజీలు &amp; పరిమాణం
            </h2>
          </div>

          {PROCURE_PACKAGES.map((pkg) => {
            const q = qty[pkg.id];
            const unitSave = pkg.mrpInr - pkg.hubPriceInr;
            const active = q > 0;
            return (
              <article
                key={pkg.id}
                className={`rounded-2xl border bg-white p-4 shadow-sm transition ${
                  active
                    ? "border-[#059669]/40 ring-1 ring-[#059669]/20"
                    : "border-[#E2E8F0]"
                }`}
              >
                <h3 className="font-display-te text-base font-normal leading-snug text-[#0F172A] sm:text-lg">
                  {pkg.nameTe}{" "}
                  <span className="font-telugu text-sm text-[#64748B]">
                    ({pkg.nameEn})
                  </span>
                </h3>
                <p className="mt-1.5 font-telugu text-xs leading-relaxed text-[#64748B] sm:text-sm">
                  {pkg.specs}
                </p>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="font-telugu text-lg font-bold tabular-nums text-[#059669]">
                      {formatInr(pkg.hubPriceInr)}
                    </p>
                    <p className="font-telugu text-xs text-[#94A3B8]">
                      <span className="line-through">
                        MRP {formatInr(pkg.mrpInr)}
                      </span>
                      <span className="ml-1.5 font-semibold text-[#B45309]">
                        ఆదా {formatInr(unitSave)}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="tap inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#FBFBFA] text-[#0F172A] hover:border-[#B45309]/40 disabled:opacity-40"
                      onClick={() => bumpQty(pkg.id, -1)}
                      disabled={q <= 0}
                      aria-label={`${pkg.nameEn} decrease`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={MAX_QTY}
                      value={q}
                      onChange={(e) =>
                        setQtyExact(pkg.id, Number(e.target.value))
                      }
                      className="h-11 w-14 rounded-xl border border-[#E2E8F0] bg-white text-center text-sm font-bold tabular-nums text-[#0F172A] focus:border-[#B45309]/50 focus:outline-none focus:ring-2 focus:ring-[#B45309]/15"
                      aria-label={`${pkg.nameEn} quantity`}
                    />
                    <button
                      type="button"
                      className="tap inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#FBFBFA] text-[#0F172A] hover:border-[#B45309]/40 disabled:opacity-40"
                      onClick={() => bumpQty(pkg.id, 1)}
                      disabled={q >= MAX_QTY}
                      aria-label={`${pkg.nameEn} increase`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          <div className="rounded-2xl border border-[#EAD7B5] bg-gradient-to-b from-white to-[#FFFDF9] p-4">
            <dl className="space-y-1.5 font-telugu text-sm text-[#334155]">
              <div className="flex justify-between gap-3">
                <dt>Total Items</dt>
                <dd className="font-bold tabular-nums text-[#0F172A]">
                  {cart.totalItems}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Total Cart Value</dt>
                <dd className="font-bold tabular-nums text-[#0F172A]">
                  {formatInr(cart.totalInr)}
                </dd>
              </div>
            </dl>
            <p className="mt-2 border-t border-[#EAD7B5]/80 pt-2 font-telugu text-sm font-semibold text-[#059669]">
              మీరు ఆదా చేసుకుంటున్న మొత్తం: {formatInr(cart.savingsInr)}{" "}
              (Savings)
            </p>
          </div>
        </section>

        {/* RIGHT — form */}
        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5"
        >
          <h2 className="font-display-te text-lg font-normal text-[#0F172A]">
            మండల హబ్ డెలివరీ వివరాలు
          </h2>
          <p className="font-telugu text-xs text-[#64748B]">
            Mandal Hub delivery — Cash / UPI on pickup only.
          </p>

          <div>
            <label className={labelClass} htmlFor="procure-salon">
              సెలూన్ / షాపు పేరు (Salon Name) *
            </label>
            <input
              id="procure-salon"
              className={fieldClass}
              value={salonName}
              onChange={(e) => setSalonName(e.target.value)}
              required
              autoComplete="organization"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="procure-owner">
              యజమాని పేరు (Owner Full Name) *
            </label>
            <input
              id="procure-owner"
              className={fieldClass}
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="procure-wa">
              వాట్సాప్ నంబర్ (WhatsApp Mobile - 10 digits) *
            </label>
            <input
              id="procure-wa"
              className={fieldClass}
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              value={whatsapp}
              onChange={(e) =>
                setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="10 అంకెలు"
              required
            />
          </div>

          <DistrictMandalFields
            value={geo}
            onChange={setGeo}
            idPrefix="procure"
          />

          <fieldset>
            <legend className={labelClass}>
              డెలివరీ విధానం (Delivery Mode)
            </legend>
            <div
              className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 font-telugu text-sm leading-relaxed text-emerald-900"
              aria-disabled="true"
            >
              📦 మండల కోఆర్డినేటర్ కేంద్రం (Mandal Hub Pickup) — క్యాష్ / యూపీఐ
              ఆన్ డెలివరీ (No advance payment)
            </div>
            <input type="hidden" name="delivery" value="mandal_hub_cod_upi" />
          </fieldset>

          {error ? (
            <p
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-telugu text-sm text-red-800"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="tap inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#B45309] px-4 font-telugu text-sm font-bold text-white transition hover:bg-[#92400E]"
          >
            సామూహిక ఆర్డర్ కన్ఫర్మ్ చేయండి (Submit Indent) ➔
          </button>
        </form>
      </div>

      {/* Confirmation modal */}
      <dialog
        ref={dialogRef}
        className="w-[min(100%,28rem)] rounded-2xl border border-[#E2E8F0] bg-white p-0 shadow-xl backdrop:bg-[#0F172A]/45"
        onClose={closeModal}
        onCancel={(e) => {
          e.preventDefault();
          closeModal();
        }}
      >
        {confirmed ? (
          <div className="relative p-5 sm:p-6">
            <button
              type="button"
              className="tap absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#64748B] hover:bg-[#F1F5F9]"
              onClick={closeModal}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-3 pr-8">
              <CheckCircle2
                className="mt-0.5 h-6 w-6 shrink-0 text-[#059669]"
                aria-hidden
              />
              <div>
                <h2 className="font-display-te text-xl font-normal text-[#0F172A]">
                  ఇండెంట్ నమోదు అయింది
                </h2>
                <p className="mt-1 font-telugu text-sm text-[#475569]">
                  Order Docket Number
                </p>
                <p className="mt-0.5 break-all font-mono text-sm font-bold text-[#0F172A]">
                  {confirmed.id}
                </p>
              </div>
            </div>

            <dl className="mt-4 space-y-2 rounded-xl border border-[#E2E8F0] bg-[#FBFBFA] p-3 font-telugu text-sm text-[#334155]">
              <div className="flex justify-between gap-3">
                <dt>Total Amount (pickup)</dt>
                <dd className="font-bold tabular-nums text-[#B45309]">
                  {formatInr(confirmed.totalInr)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Assigned Mandal Hub</dt>
                <dd className="text-right font-semibold text-[#0F172A]">
                  {confirmed.mandalNameTe} సమన్వయకర్త కేంద్రం
                </dd>
              </div>
              <div className="flex justify-between gap-3 text-[#059669]">
                <dt>ఆదా (Savings)</dt>
                <dd className="font-bold tabular-nums">
                  {formatInr(confirmed.savingsInr)}
                </dd>
              </div>
            </dl>

            <a
              href={indentWhatsAppSlipUrl(confirmed)}
              target="_blank"
              rel="noreferrer"
              className="tap mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#128C7E] px-4 font-telugu text-sm font-bold text-white"
            >
              వాట్సాప్‌లో ఆర్డర్ స్లిప్ పొందండి
            </a>
            <button
              type="button"
              className="tap mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#E2E8F0] bg-white px-4 font-telugu text-sm font-semibold text-[#0F172A]"
              onClick={closeModal}
            >
              మూసివేయి
            </button>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
