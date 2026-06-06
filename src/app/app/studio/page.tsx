"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PACKAGING_TABS, PACKAGING_OUTPUT, LISTING } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import type { PackagingOutput, ShopeeListing } from "@/lib/types";

function Typewriter({ text }: { text: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [text]);
  return <>{text.slice(0, count)}</>;
}

function dot(status: string) {
  if (status === "complete") return "bg-go";
  if (status === "running") return "bg-orange";
  return "bg-ink-faint/40";
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-orange">
      {children}
    </p>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return <p className="text-[14px] leading-relaxed text-ink-soft">{children}</p>;
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-baseline gap-3">
          <span className="font-mono text-[12px] text-ink-faint">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-[13px] leading-snug text-ink-soft">{it}</span>
        </div>
      ))}
    </div>
  );
}

function ImageSlot({ label, dir }: { label: string; dir: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex aspect-[4/3] w-full max-w-md flex-col items-center justify-center gap-1 rounded-lg bg-ivory-deep p-4 text-center"
    >
      <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
        {label}
      </span>
      <span className="text-[12px] italic text-ink-soft">{dir}</span>
    </motion.div>
  );
}

/** Renders the right-canvas content for the active tab. */
function TabContent({
  active,
  p,
  listing,
}: {
  active: string;
  p: PackagingOutput;
  listing: ShopeeListing;
}) {
  switch (active) {
    case "brief":
      return (
        <>
          <Label>Product Brief</Label>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Mini Desk Vacuum
          </h2>
          <p className="font-mono text-[12px] text-ink-faint">
            Shopee · Singapore · selected from Opportunity Board
          </p>
          <Para>{p.productDescription}</Para>
        </>
      );
    case "title":
      return (
        <>
          <Label>Shopee Title · Generated</Label>
          <h2 className="font-display text-xl font-semibold leading-tight text-ink">
            <Typewriter text={p.localizedShopeeTitle} />
          </h2>
          <p className="font-mono text-[12px] text-ink-faint">
            {p.titleCharCount} chars · SEO optimized · Shopee SG compliant
          </p>
        </>
      );
    case "points":
      return (
        <>
          <Label>Selling Points</Label>
          <NumberedList items={p.sellingPoints} />
        </>
      );
    case "positioning":
      return (
        <>
          <Label>Positioning</Label>
          <Para>{p.positioningAngle}</Para>
        </>
      );
    case "bundle":
      return (
        <>
          <Label>Bundle Strategy</Label>
          <Para>{p.bundleStrategy}</Para>
          <p className="font-mono text-[12px] text-ink-faint">
            Raises average order value.
          </p>
        </>
      );
    case "gift":
      return (
        <>
          <Label>Gift Strategy</Label>
          <Para>{p.giftStrategy}</Para>
          <p className="font-mono text-[12px] text-ink-faint">
            Boosts click-through and perceived value.
          </p>
        </>
      );
    case "prompts":
      return (
        <>
          <Label>Image Prompts</Label>
          <NumberedList items={p.imagePrompts} />
        </>
      );
    case "main":
      return (
        <>
          <Label>Main Image</Label>
          <ImageSlot label="Main Image" dir={p.heroImageDirection} />
        </>
      );
    case "lifestyle":
      return (
        <>
          <Label>Lifestyle Image</Label>
          <ImageSlot label="Lifestyle" dir={p.lifestyleImageDirection} />
        </>
      );
    case "feature":
      return (
        <>
          <Label>Feature Image</Label>
          <ImageSlot label="Feature" dir={p.featureImageDirection} />
        </>
      );
    case "preview":
      return (
        <>
          <Label>Listing Preview</Label>
          <div className="max-w-sm">
            <div className="mb-3 flex h-32 items-center justify-center rounded-md bg-ivory-deep">
              <span className="font-mono text-[11px] text-ink-faint">Main image</span>
            </div>
            <h3 className="font-display text-base font-semibold leading-snug text-ink">
              {listing.preview.title}
            </h3>
            <p className="my-1.5 font-mono text-lg font-semibold text-orange">
              {listing.preview.price}
            </p>
            <div className="flex flex-col gap-1">
              {listing.preview.bullets.map((b) => (
                <span
                  key={b}
                  className="flex items-baseline gap-1.5 text-[12px] text-ink-soft"
                >
                  <span className="text-orange">·</span>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </>
      );
    case "compliance":
      return (
        <>
          <Label>Compliance Notes</Label>
          <NumberedList items={p.complianceNotes} />
          <div className="border-t hairline pt-3.5">
            <Label>Price Uplift Reasoning</Label>
            <Para>{p.priceUpliftReasoning}</Para>
          </div>
        </>
      );
    default:
      return null;
  }
}

export default function StudioPage() {
  const router = useRouter();
  const [active, setActive] = useState("brief");
  const p = useAppStore((s) => s.packaging) ?? PACKAGING_OUTPUT;
  const listing = useAppStore((s) => s.listing) ?? LISTING;

  return (
    <div className="grid min-h-[70vh] grid-cols-[200px_1fr]">
      {/* Sidebar tabs */}
      <div className="border-r hairline bg-ivory-deep py-4">
        <p className="px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-faint mb-3">
          Mini Desk Vacuum
        </p>
        {PACKAGING_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex w-full items-center gap-2 px-4 py-2 text-[12px] transition-colors ${
              active === t.id
                ? "border-l-2 border-orange bg-surface font-semibold text-ink"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <span className={`h-[5px] w-[5px] shrink-0 rounded-full ${dot(t.status)}`} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="flex flex-col bg-surface px-8 py-7">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col gap-4"
            >
              <TabContent active={active} p={p} listing={listing} />
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={() => router.push("/app/listing")}
          className="mt-6 self-start bg-ink px-5 py-2.5 font-display text-xs font-black text-white"
        >
          Generate Shopee Listing →
        </button>
      </div>
    </div>
  );
}
