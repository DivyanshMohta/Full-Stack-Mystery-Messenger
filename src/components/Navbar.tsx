/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Inbox", href: "/dashboard" },
  { label: "Send Message", href: "/send-message" },
];

// Shared hard-edge button styles so Login/Logout look identical everywhere they appear.
const btnBase =
  "border-2 border-black px-3.5 py-1.5 text-[0.8rem] font-bold uppercase tracking-wide transition-colors";
const btnFilled = `${btnBase} bg-black text-[#e9e4d6] hover:bg-[#8b1e1e] hover:border-[#8b1e1e]`;
const btnOutline = `${btnBase} bg-transparent text-black hover:bg-black hover:text-[#e9e4d6]`;

function isLinkActive(pathname: any, href: any) {
  if (href === "/") return pathname === "/";
  return pathname?.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header
      className="sticky top-0 z-50 border-b-2 border-b-amber-900 shadow-md"
      style={{ backgroundColor: "#e9e4d6" }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        {/* ---- Logo — always the brand mark, never swapped for session state ---- */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span
            className="flex h-10 w-10 items-center justify-center border-2 border-black"
            style={{ backgroundColor: "#8b1e1e" }}
          >
            <span
              className="text-xl font-bold"
              style={{
                color: "#e9e4d6",
                fontFamily: 'var(--font-display, "Courier New", monospace)',
              }}
            >
              ?
            </span>
          </span>
          <span
            className="text-[1.1rem] tracking-tight text-black"
            style={{
              fontFamily: 'var(--font-display, "Courier New", monospace)',
            }}
          >
            MYSTERY MESSENGER
          </span>
        </Link>

        {/* ---- Center nav links (desktop) — folder-tab style ---- */}
        <ul
          className="hidden items-stretch gap-1 md:flex"
          style={{ fontFamily: 'var(--font-body, "Courier New", monospace)' }}
        >
          {LINKS.map((link) => {
            const active = isLinkActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-3 py-1.5 text-[0.85rem] uppercase tracking-wide transition-colors ${
                    active
                      ? "-mb-0.5 rounded-t-sm border-2 border-b-0 border-black text-[#e9e4d6]"
                      : "text-black hover:bg-black/5"
                  }`}
                  style={active ? { backgroundColor: "#8b1e1e" } : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ---- Right cluster (desktop): session chip + auth action ---- */}
        <div
          className="hidden items-center gap-3 md:flex"
          style={{ fontFamily: 'var(--font-body, "Courier New", monospace)' }}
        >
          {session && (
            <span className="border-2 border-black px-2.5 py-1 text-[0.75rem] uppercase tracking-wide text-black">
              {user?.username || user?.email}
            </span>
          )}
          {session ? (
            <button onClick={() => signOut()} className={btnFilled}>
              Logout
            </button>
          ) : (
            <>
              <Link href="/sign-in" className={btnOutline}>
                Login
              </Link>
              <Link href="/sign-up" className={btnOutline}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* ---- Mobile menu toggle ---- */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="border-2 border-black p-1.5 text-black md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* ---- Mobile menu ---- */}
      {menuOpen && (
        <div
          className="border-t-2 border-black px-5 pb-5 pt-3 md:hidden"
          style={{
            backgroundColor: "#e9e4d6",
            fontFamily: 'var(--font-body, "Courier New", monospace)',
          }}
        >
          {session && (
            <div className="mb-3 border-2 border-black px-2.5 py-1.5 text-[0.75rem] uppercase tracking-wide text-black">
              {user?.username || user?.email}
            </div>
          )}

          <ul className="flex flex-col gap-1.5">
            {LINKS.map((link) => {
              const active = isLinkActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block border-2 border-black px-3 py-2.5 text-[0.85rem] uppercase tracking-wide ${
                      active ? "text-[#e9e4d6]" : "text-black hover:bg-black/5"
                    }`}
                    style={active ? { backgroundColor: "#8b1e1e" } : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-3">
            {session ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  signOut();
                }}
                className={`w-full ${btnFilled}`}
              >
                Logout
              </button>
            ) : (
              <Link
                href="/sign-in"
                onClick={() => setMenuOpen(false)}
                className={`block w-full text-center ${btnOutline}`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
