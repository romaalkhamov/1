/**
 * TrustDepo — Overlay additions
 * Drop this file into src/ and import what you need in Composition.tsx
 *
 * Contains:
 *  1. Caption/message text that appears over the video
 *  2. Sound-effect trigger helpers (using Remotion <Audio>)
 *  3. Counter component (animated number)
 *  4. Background gradient that shifts on every txn push
 */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";

// ─── Easing helper ────────────────────────────────────────────────────────────
const ease = (f: number, s: number, e: number, from = 0, to = 1) =>
  interpolate(f, [s, e], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

// ═══════════════════════════════════════════════════════════════════════════
// 1. CAPTION / MESSAGE OVERLAY
//    Shows hook text before the phone appears, then feature captions
//    alongside each transaction.
//
//    Usage in Composition.tsx:
//      import { CaptionOverlay } from "./Overlay";
//      <CaptionOverlay txnStartFrame={60} txnGap={27} />
// ═══════════════════════════════════════════════════════════════════════════

const MESSAGES = [
  // [startFrame, endFrame, text]
  // Hook — plays during logo (frame 0-22)
  [0,  22,  "Still sending money\nto strangers direct?"] as const,
  // Phone lands — frame 52, first message
  [52, 88,  "Meet TrustDepo.\nEscrow for everyone."] as const,
  // Transaction 1 — frame 60
  [60, 90,  "Deposit lands.\nFunds locked instantly."] as const,
  // Transaction 2 — frame 87
  [87, 118, "MacBook sale?\nBuyer's funds held safe."] as const,
  // Transaction 3 — frame 114
  [114,145, "£4,800 Rolex.\nNo risk on either side."] as const,
  // Transaction 4 — frame 141
  [141,172, "Every deal.\nEvery amount. Covered."] as const,
  // Transaction 5 — frame 168
  [168,200, "BMW 3 Series.\n£8,500 — secured."] as const,
];

export const CaptionOverlay: React.FC<{
  txnStartFrame?: number;
  txnGap?: number;
}> = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {MESSAGES.map(([s, e, text], i) => {
        const op  = interpolate(f, [s, s + 8, e - 6, e], [0, 1, 1, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const y = ease(f, s, s + 10, 16, 0);
        if (op === 0) return null;

        // Alternate position: odd messages bottom, even messages top
        const isBottom = i % 2 === 0;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0, right: 0,
              ...(isBottom
                ? { bottom: 280 }
                : { top: 200 }),
              display: "flex",
              justifyContent: "center",
              opacity: op,
              transform: `translateY(${isBottom ? y : -y}px)`,
            }}
          >
            <div
              style={{
                background: "rgba(0,0,0,0.72)",
                backdropFilter: "blur(12px)",
                borderRadius: 20,
                padding: "18px 36px",
                maxWidth: 820,
                textAlign: "center",
              }}
            >
              {text.split("\n").map((line, li) => (
                <div
                  key={li}
                  style={{
                    fontSize: li === 0 ? 52 : 40,
                    fontWeight: li === 0 ? 800 : 500,
                    color: li === 0 ? "#FFFFFF" : "#E8854A",
                    lineHeight: 1.25,
                    letterSpacing: li === 0 ? -1 : 0,
                    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 2. SOUND EFFECTS
//    Uses freely-available CDN sounds (no local files needed).
//    Remotion renders audio from URLs in <Audio>.
//
//    ⚠️  For production: download these and put them in public/sounds/
//        then use staticFile("sounds/cash.mp3") etc.
//
//    Usage in Composition.tsx:
//      import { SoundEffects } from "./Overlay";
//      <SoundEffects txnStartFrame={60} txnGap={27} />
// ═══════════════════════════════════════════════════════════════════════════

// Free sound URLs (Pixabay / freesound CDN — no attribution required)
// Replace with staticFile("sounds/xxx.mp3") once downloaded to public/sounds/
const SOUNDS = {
  // Coin/cash register on each transaction
  cash: "https://cdn.pixabay.com/audio/2022/03/15/audio_1a25fd4cc3.mp3",
  // Soft whoosh on phone entrance
  whoosh: "https://cdn.pixabay.com/audio/2022/03/24/audio_5b2e1cbc41.mp3",
  // Gentle ding on logo
  ding: "https://cdn.pixabay.com/audio/2022/10/30/audio_946b8ebb15.mp3",
  // Success chime on last txn
  success: "https://cdn.pixabay.com/audio/2023/04/06/audio_34a1d2d8e9.mp3",
};

export const SoundEffects: React.FC<{
  txnStartFrame?: number;
  txnGap?: number;
}> = ({ txnStartFrame = 60, txnGap = 27 }) => {
  // Frames when each new txn arrives (txns 1-5, index 0 is Website which is static)
  const txnFrames = Array.from({ length: 5 }, (_, i) => txnStartFrame + i * txnGap);

  return (
    <>
      {/* Logo ding */}
      <Sequence from={0} durationInFrames={30}>
        <Audio src={SOUNDS.ding} volume={0.35} />
      </Sequence>

      {/* Phone whoosh on entry */}
      <Sequence from={20} durationInFrames={35}>
        <Audio src={SOUNDS.whoosh} volume={0.5} />
      </Sequence>

      {/* Cash sound on each transaction */}
      {txnFrames.map((startF, i) => (
        <Sequence key={i} from={startF} durationInFrames={25}>
          <Audio src={SOUNDS.cash} volume={0.55} />
        </Sequence>
      ))}

      {/* Success chime on last txn */}
      <Sequence from={txnFrames[4] + 4} durationInFrames={40}>
        <Audio src={SOUNDS.success} volume={0.6} />
      </Sequence>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 3. ANIMATED COUNTER
//    Counts from `from` to `to` over `durationFrames`.
//    Shows comma-separated GBP formatting with rolling digit effect.
//
//    Usage in Composition.tsx (standalone, not tied to balance):
//      import { AnimatedCounter } from "./Overlay";
//      <AnimatedCounter from={0} to={8500} startFrame={168} durationFrames={22}
//        prefix="£" style={{ fontSize: 80, color: "#111" }} />
// ═══════════════════════════════════════════════════════════════════════════

export const AnimatedCounter: React.FC<{
  from?: number;
  to: number;
  startFrame: number;
  durationFrames?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ from = 0, to, startFrame, durationFrames = 24, prefix = "£", suffix = "", style = {} }) => {
  const f = useCurrentFrame();
  const progress = ease(f, startFrame, startFrame + durationFrames, 0, 1);
  const value = Math.round(from + (to - from) * progress);
  const formatted = value.toLocaleString("en-GB");

  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}{formatted}{suffix}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 4. SHIFTING BACKGROUND GRADIENT
//    Smoothly transitions between gradient presets on each txn push.
//    Wrap your whole composition with this behind everything.
//
//    Usage in Composition.tsx:
//      import { ShiftingBackground } from "./Overlay";
//      // Place FIRST inside <AbsoluteFill>:
//      <ShiftingBackground txnStartFrame={60} txnGap={27} />
// ═══════════════════════════════════════════════════════════════════════════

// Each gradient corresponds to a "phase" of the video
const GRADIENTS = [
  // 0 — logo / intro: clean light grey
  "#F2F2F7",
  // 1 — phone lands: very subtle warm cream
  "#F5F0EB",
  // 2 — first txn (Deposit): soft sage tint
  "#EFF5F0",
  // 3 — MacBook: soft sky tint
  "#EFF3F8",
  // 4 — Rolex: soft lavender tint
  "#F3EFF8",
  // 5 — Logo Design: soft peach tint
  "#F8F0EE",
  // 6 — BMW (last txn): back to clean white
  "#F7F7F7",
];

// Radial accent colors (subtle top-right glow)
const ACCENTS = [
  "rgba(232,133,74,0.06)",  // orange
  "rgba(232,133,74,0.09)",
  "rgba(16,185,129,0.06)",  // green
  "rgba(37,99,235,0.06)",   // blue
  "rgba(139,92,246,0.06)",  // purple
  "rgba(232,133,74,0.08)",
  "rgba(232,133,74,0.10)",
];

export const ShiftingBackground: React.FC<{
  txnStartFrame?: number;
  txnGap?: number;
}> = ({ txnStartFrame = 60, txnGap = 27 }) => {
  const f = useCurrentFrame();

  // Which phase are we in?
  const PHONE_IN_E = 52;
  const phase =
    f < PHONE_IN_E ? 0
    : f < txnStartFrame ? 1
    : Math.min(6, Math.floor((f - txnStartFrame) / txnGap) + 2);

  // Blend between current and next gradient
  const phaseLocalF = f < PHONE_IN_E ? f
    : f < txnStartFrame ? f - PHONE_IN_E
    : (f - txnStartFrame) % txnGap;
  const blend = ease(phaseLocalF, 0, 14, 0, 1);

  const curr = GRADIENTS[Math.min(phase, GRADIENTS.length - 1)];
  const next = GRADIENTS[Math.min(phase + 1, GRADIENTS.length - 1)];
  const accent = ACCENTS[Math.min(phase, ACCENTS.length - 1)];

  // Interpolate hex colors via opacity trick — overlay next on current
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Base — current gradient */}
      <AbsoluteFill style={{ background: curr }} />
      {/* Next — fades in */}
      <AbsoluteFill style={{ background: next, opacity: blend }} />
      {/* Radial accent glow top-right */}
      <div style={{
        position: "absolute",
        top: -200, right: -200,
        width: 900, height: 900,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${accent} 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// HOW TO WIRE EVERYTHING INTO Composition.tsx
// ─────────────────────────────────────────────────────────────────────────
//
// 1. At the top of Composition.tsx add:
//    import { ShiftingBackground, CaptionOverlay, SoundEffects } from "./Overlay";
//
// 2. Inside the <AbsoluteFill> return, FIRST CHILD:
//    <ShiftingBackground txnStartFrame={60} txnGap={27} />
//
//    (Replace the existing `<AbsoluteFill style={{ background: BG ... }}>`
//     plain background — remove it or set it to transparent)
//
// 3. After the iPhone shell div, add:
//    <CaptionOverlay />
//    <SoundEffects txnStartFrame={60} txnGap={27} />
//
// 4. The AnimatedCounter is used standalone if you want a big number
//    overlay — otherwise the balance inside AppScreen already animates.
//
// ─────────────────────────────────────────────────────────────────────────
// SOUNDS — to use local files instead of CDN:
//
// mkdir -p public/sounds
// Download from freesound.org or pixabay.com (free license):
//   cash.mp3    — search "cash register" or "coin"
//   whoosh.mp3  — search "whoosh" or "swipe"
//   ding.mp3    — search "notification ding"
//   success.mp3 — search "success chime"
//
// Then in SoundEffects replace SOUNDS.cash with staticFile("sounds/cash.mp3") etc.
// ═══════════════════════════════════════════════════════════════════════════
