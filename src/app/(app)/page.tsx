"use client";

import Link from "next/link";
import { Mail, Fingerprint, EyeOff, Send, ArrowRight, Pin } from "lucide-react";
import messages from "@/messages.json";

// Dossier palette, matching Navbar.jsx
const PAPER = "#e9e4d6";
const RED = "#8b1e1e";
const INK = "#111111";
const fontDisplay = 'var(--font-display, "Courier New", monospace)';
const fontBody = 'var(--font-body, "Courier New", monospace)';

const STEPS = [
  {
    icon: Fingerprint,
    num: "01",
    title: "Open your file",
    desc: "Create your profile in seconds. No verification, no real name required.",
  },
  {
    icon: Send,
    num: "02",
    title: "Circulate your link",
    desc: "Share your unique link anywhere — bio, story, group chat. Anyone can send a tip.",
  },
  {
    icon: EyeOff,
    num: "03",
    title: "Receive, unread by anyone else",
    desc: "Messages land only in your inbox. Senders stay off the record, always.",
  },
];

const FEATURES = [
  { label: "No login to send a message" },
  { label: "Sender identity never recorded" },
];

// Cycled per card so the board looks scattered/pinned rather than a tidy grid.
const TILTS = [
  "-rotate-2",
  "rotate-1",
  "-rotate-1",
  "rotate-2",
  "-rotate-3",
  "rotate-3",
];

export default function Home() {
  return (
    <>
      <main
        style={{ backgroundColor: PAPER }}
        className="min-h-screen text-black"
      >
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden border-b-2 border-black px-4 py-16 text-center md:px-24 md:py-32">
          {/* faint case-file grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />

          <div className="relative mx-auto max-w-2xl">
            <span
              className="mb-6 inline-block -rotate-3 border-2 border-black px-3 py-1 text-xs font-bold uppercase tracking-widest"
              style={{
                backgroundColor: RED,
                color: PAPER,
                fontFamily: fontBody,
              }}
            >
              Anonymous Tips
            </span>

            <h1
              className="text-3xl leading-tight md:text-5xl"
              style={{ fontFamily: fontDisplay }}
            >
              Every message is anonymous.
              <br />
            </h1>

            <p
              className="mx-auto mt-4 max-w-lg text-sm text-black/70 md:text-base"
              style={{ fontFamily: fontBody }}
            >
              Whisprd lets anyone send you honest feedback, confessions, or a
              tip — without ever revealing who they are.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="flex items-center gap-2 border-2 border-black px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-[#8b1e1e] hover:border-[#8b1e1e]"
                style={{
                  backgroundColor: INK,
                  color: PAPER,
                  fontFamily: fontBody,
                }}
              >
                Open Your File
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="border-2 border-black px-6 py-3 text-sm font-bold uppercase tracking-wide text-black transition-colors hover:bg-black hover:text-[#e9e4d6]"
                style={{ fontFamily: fontBody }}
              >
                How It Works
              </a>
            </div>

            {/* feature strip */}
            <ul
              className="mx-auto mt-10 flex max-w-xl flex-col gap-2 text-xs uppercase tracking-wide text-black/70 sm:flex-row sm:justify-center sm:gap-6"
              style={{ fontFamily: fontBody }}
            >
              {FEATURES.map((f) => (
                <li
                  key={f.label}
                  className="flex items-center justify-center gap-1.5"
                >
                  <span style={{ color: RED }}>&#9632;</span>
                  {f.label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================= EVIDENCE BOARD ================= */}
        <section
          className="relative overflow-hidden px-4 py-16 md:px-24"
          style={{ backgroundColor: "#ddd7c4" }}
        >
          {/* corkboard-style texture so pinned notes read as physically pinned */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />

          <div className="relative mx-auto max-w-2xl text-center">
            <h2
              className="mt-1 text-2xl md:text-3xl"
              style={{ fontFamily: fontDisplay }}
            >
              Message Board
            </h2>
            <p
              className="mt-2 text-sm text-black/60"
              style={{ fontFamily: fontBody }}
            >
              A few tips that came in off the record.
            </p>
          </div>

          <div className="relative mx-auto mt-12 grid max-w-4xl gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`group relative border border-black/15 p-5 pt-7 transition-all duration-200 hover:z-10 hover:-translate-y-1 hover:rotate-0 hover:shadow-xl ${
                  TILTS[index % TILTS.length]
                }`}
                style={{
                  backgroundColor: PAPER,
                  boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
                }}
              >
                {/* pushpin */}
                <Pin
                  className="absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 drop-shadow-md"
                  style={{ color: RED }}
                  fill={RED}
                />

                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3
                    className="text-base leading-snug"
                    style={{ fontFamily: fontDisplay }}
                  >
                    {message.title}
                  </h3>
                  <span
                    className="shrink-0 border border-black/20 px-1.5 py-0.5 text-[0.6rem] text-black/45"
                    style={{ fontFamily: fontBody }}
                  >
                    #{String(index + 1).padStart(3, "0")}
                  </span>
                </div>

                <div
                  className="flex items-start gap-2"
                  style={{ fontFamily: fontBody }}
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-black/40" />
                  <p className="text-sm text-black/80">{message.content}</p>
                </div>

                {/* stamped timestamp */}
                <p
                  className="mt-4 inline-block -rotate-2 border border-black/25 px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-black/45"
                  style={{ fontFamily: fontBody }}
                >
                  Received {message.received}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section
          id="how-it-works"
          className="border-y-2 border-black px-4 py-16 md:px-24"
          style={{ backgroundColor: INK, color: PAPER }}
        >
          <div className="mx-auto max-w-2xl text-center">
            <p
              className="text-xs uppercase tracking-[0.2em]"
              style={{ fontFamily: fontBody, color: "#a89f8a" }}
            >
              Standard Procedure
            </p>
            <h2
              className="mt-1 text-2xl md:text-3xl"
              style={{ fontFamily: fontDisplay }}
            >
              How a Tip Gets to You
            </h2>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="border-2 border-[#e9e4d6]/20 p-5 transition-colors hover:border-[#8b1e1e]"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-6 w-6" style={{ color: RED }} />
                    <span
                      className="text-xs text-[#e9e4d6]/40"
                      style={{ fontFamily: fontBody }}
                    >
                      {step.num}
                    </span>
                  </div>
                  <h3
                    className="mt-4 text-lg"
                    style={{ fontFamily: fontDisplay }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="mt-2 text-sm text-[#e9e4d6]/70"
                    style={{ fontFamily: fontBody }}
                  >
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="px-4 py-16 text-center md:px-24">
          <h2
            className="text-2xl md:text-3xl"
            style={{ fontFamily: fontDisplay }}
          >
            Ready to hear what people really think?
          </h2>
          <Link
            href="/sign-up"
            className="mt-6 inline-flex items-center gap-2 border-2 border-black px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-[#8b1e1e] hover:border-[#8b1e1e]"
            style={{ backgroundColor: INK, color: PAPER, fontFamily: fontBody }}
          >
            Open Your File
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer
        className="border-t-2 border-black px-4 py-6 text-center text-xs uppercase tracking-wide"
        style={{ backgroundColor: INK, color: "#a89f8a", fontFamily: fontBody }}
      >
        © {new Date().getFullYear()} MYSTERY MESSENGER — Case files remain
        confidential.
      </footer>
    </>
  );
}
