/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Message } from "@/model/User";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  RefreshCcw,
  Copy,
  Inbox,
  FolderLock,
  Tag,
} from "lucide-react";
import Link from "next/link";
import MessageCard from "@/components/MessageCard";

// Dossier palette — keep in sync with the rest of the app
const PAPER = "#e9e4d6";
const PAPER_AGED = "#ded2ad"; // deeper/warmer cream — used once, for the header panel only,
// so it reads as "the primary document" rather than just another box in the grid
const RED = "#8b1e1e";
const GREEN = "#2f5d3a";
const TAPE = "#c9a668"; // washi-tape accent, used sparingly
const DESK = "#241d18"; // the "desk" the case file sits on
const STAMP_INK = "rgba(139,30,30,0.05)"; // near-invisible red, for the desk watermark only
const fontDisplay = 'var(--font-display, "Courier New", monospace)';
const fontBody = 'var(--font-body, "Courier New", monospace)';

const btnBase =
  "border-2 border-black text-[0.8rem] font-bold uppercase tracking-wide transition-colors";
const btnFilled = `${btnBase} bg-black text-[${PAPER}] hover:bg-[#8b1e1e] hover:border-[#8b1e1e]`;
const btnOutline = `${btnBase} bg-transparent text-black hover:bg-black hover:text-[${PAPER}]`;

// Hard-edge "dropped on the desk" shadow — a soft blur would fight the paper-cutout look,
// a hard offset shadow is what actually sells "this sits above the desk surface."
const panelShadow = "6px 6px 0 rgba(0,0,0,0.35)";

// Subtle dot-grain texture for paper panels, plus a faint edge vignette (paper "foxing")
// so panels read as aged material rather than a flat color swatch.
const grainStyle: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.06) 100%)",
  backgroundSize: "3px 3px, 100% 100%",
};

// A single strip of "tape" pinning a corner of a panel down — the one
// recurring motif used to tie the case-file panels together
const TapeStrip = ({
  className = "",
  rotate = -6,
}: {
  className?: string;
  rotate?: number;
}) => (
  <span
    aria-hidden
    className={`pointer-events-none absolute h-4 w-14 opacity-70 ${className}`}
    style={{
      backgroundColor: TAPE,
      transform: `rotate(${rotate}deg)`,
      boxShadow: "0 1px 1px rgba(0,0,0,0.15)",
    }}
  />
);

// The desk the file sits on: a near-black warm brown with a faint top glow,
// a soft diagonal weave, fine grain, one large near-invisible case-stamp watermark
// (the signature element — fills the empty space without competing for attention),
// and an inward vignette.
const DeskBackdrop = () => (
  <>
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 70% 55% at 50% 8%, rgba(255,255,255,0.05), transparent 60%)",
      }}
    />
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-40"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 4px)",
      }}
    />
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "3px 3px",
      }}
    />

    {/* Signature element: one oversized, barely-visible case-stamp mark, low and
        off-center so it reads as "stamped into the desk" rather than a centered logo. */}
    <div
      aria-hidden
      className="pointer-events-none absolute select-none overflow-hidden inset-0"
    >
      <span
        style={{
          position: "absolute",
          bottom: "-4rem",
          right: "-2rem",
          fontFamily: fontDisplay,
          fontSize: "18rem",
          fontWeight: 900,
          color: STAMP_INK,
          transform: "rotate(-8deg)",
          letterSpacing: "-0.05em",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        CF
      </span>
    </div>

    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ boxShadow: "inset 0 0 160px 40px rgba(0,0,0,0.45)" }}
    />
  </>
);

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [acceptMessages, setAcceptMessages] = useState(false);
  const [profileUrl, setProfileUrl] = useState(""); // filled client-side only, see effect below

  const { data: session, status } = useSession();

  const handleMessageDelete = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id.toString() !== messageId),
    );
  };

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitching(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message");
      setAcceptMessages(response.data.isAcceptingMessage ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message accepting status",
        type: "error",
      });
    } finally {
      setIsSwitching(false);
    }
  }, []);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitching(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.add({
            title: "Refreshed",
            description: "Showing the latest tips",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.add({
          title: "Message Status",
          description:
            axiosError.response?.data.message || "Failed to fetch messages",
          type: "error",
        });
      } finally {
        setIsLoading(false);
        setIsSwitching(false);
      }
    },
    [setIsLoading, setMessages],
  );

  useEffect(() => {
    if (!session || !session?.user) return;

    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchAcceptMessage, fetchMessages]);

  // `window` doesn't exist during the server render pass for client components,
  // so this must be computed in an effect, not inline in the render body.
  useEffect(() => {
    if (typeof window === "undefined" || !session?.user?.username) return;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    setProfileUrl(`${baseUrl}/u/${session.user.username}`);
  }, [session?.user?.username]);

  const handleSwitchChange = async (checked: boolean) => {
    setIsSwitching(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: checked,
      });
      setAcceptMessages(checked);
      toast.add({ title: response.data.message });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to update setting",
        type: "error",
      });
    } finally {
      setIsSwitching(false);
    }
  };

  const copyToClipboard = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl);
    toast.add({
      title: "Link Copied",
      description: "Your distribution link is on the clipboard.",
    });
  };

  // ---- Session still resolving: don't flash "please log in" ----
  if (status === "loading") {
    return (
      <div
        className="relative flex min-h-[70vh] items-center justify-center overflow-hidden"
        style={{ backgroundColor: DESK }}
      >
        <DeskBackdrop />
        <Loader2 className="relative z-10 h-6 w-6 animate-spin text-white/40" />
      </div>
    );
  }

  // ---- No active session ----
  if (status === "unauthenticated" || !session?.user) {
    return (
      <div
        className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden p-6"
        style={{ backgroundColor: DESK }}
      >
        <DeskBackdrop />
        <div
          className="relative z-10 flex flex-col items-center gap-4 border-2 border-black px-8 py-10 text-center"
          style={{
            backgroundColor: PAPER,
            ...grainStyle,
            boxShadow: panelShadow,
          }}
        >
          <FolderLock className="h-8 w-8" style={{ color: RED }} />
          <p className="text-black/70" style={{ fontFamily: fontBody }}>
            This file is sealed. Sign in to view it.
          </p>
          <Link href="/sign-in" className={`${btnFilled} px-5 py-2.5`}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const { username } = session.user;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: DESK }}
    >
      <DeskBackdrop />

      <div
        className="relative z-10 mx-4 my-8 w-full max-w-6xl md:mx-8 lg:mx-auto"
        style={{ fontFamily: fontBody }}
      >
        {/* ---- Header: manila folder tab ---- */}
        <div className="mb-8">
          <div
            className="inline-block -translate-y-[2px] border-2 border-b-0 border-black px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.25em]"
            style={{ backgroundColor: PAPER_AGED }}
          >
            Case File
          </div>
          <div
            className="flex flex-wrap items-end justify-between gap-4 border-2 border-black px-5 py-5"
            style={{
              backgroundColor: PAPER_AGED,
              ...grainStyle,
              boxShadow: panelShadow,
            }}
          >
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-black/45">
                Subject / Handle
              </p>
              <h1
                className="mt-1 text-3xl leading-none md:text-5xl"
                style={{ fontFamily: fontDisplay }}
              >
                {username}
              </h1>
            </div>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
              className={`group ${btnOutline} flex items-center gap-2 rounded-none px-4 py-2`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* ---- Status + distribution link ---- */}
        <div className="mb-8 grid gap-5 md:grid-cols-5">
          {/* Case status: rubber-stamp treatment */}
          <div
            className="relative border-2 border-black p-5 md:col-span-2"
            style={{
              backgroundColor: PAPER,
              ...grainStyle,
              boxShadow: panelShadow,
            }}
          >
            <TapeStrip className="-left-3 -top-2" />
            <h2 className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-black/50">
              Case Status
            </h2>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div
                className="inline-block -rotate-3 border-[3px] px-3 py-1.5 text-sm font-black uppercase tracking-widest"
                style={{
                  borderColor: acceptMessages ? GREEN : RED,
                  color: acceptMessages ? GREEN : RED,
                }}
              >
                {acceptMessages ? "Open" : "Sealed"}
              </div>
              <Switch
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitching}
                className="data-[state=checked]:bg-[#2f5d3a] data-[state=unchecked]:bg-[#8b1e1e]"
              />
            </div>

            <p className="mt-4 text-xs leading-relaxed text-black/50">
              {acceptMessages
                ? "New tips are being logged to this file as they arrive."
                : "This file is closed. New submissions are turned away."}
            </p>
          </div>

          {/* Distribution link: evidence-tag treatment */}
          <div
            className="relative border-2 border-black p-5 md:col-span-3"
            style={{
              backgroundColor: PAPER,
              ...grainStyle,
              boxShadow: panelShadow,
            }}
          >
            <div
              className="absolute -top-3 left-6 flex items-center gap-1.5 border-2 border-black px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-widest"
              style={{ backgroundColor: PAPER }}
            >
              <Tag className="h-3 w-3" />
              Evidence Tag
            </div>

            <h2 className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-black/50">
              Distribution Link
            </h2>
            <p className="mt-1 text-xs text-black/50">
              Share this to start collecting anonymous tips.
            </p>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={profileUrl}
                disabled
                placeholder="Generating your link…"
                className="w-full border-2 border-black bg-transparent px-3 py-2 text-sm text-black/80 disabled:opacity-70"
              />
              <Button
                onClick={copyToClipboard}
                disabled={!profileUrl}
                className={`${btnFilled} flex shrink-0 items-center gap-2 rounded-none px-4 py-2`}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
          </div>
        </div>

        {/* ---- Torn divider into exhibits ---- */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-0 flex-1 border-t-2 border-dashed border-white/15" />
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-white/40">
            Exhibits
          </span>
          <div className="h-0 flex-1 border-t-2 border-dashed border-white/15" />
        </div>

        {/* ---- Messages ---- */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-white/40">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-[0.65rem] uppercase tracking-[0.25em]">
              Pulling file…
            </p>
          </div>
        ) : messages.length > 0 ? (
          <>
            <p className="mb-4 text-xs uppercase tracking-widest text-white/40">
              {messages.length} item{messages.length !== 1 ? "s" : ""} on file
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {messages.map((message, index) => (
                <MessageCard
                  key={index}
                  message={message}
                  onMessageDelete={handleMessageDelete}
                />
              ))}
            </div>
          </>
        ) : (
          <div
            className="relative flex flex-col items-center gap-3 border-2 border-dashed border-white/20 py-16 text-center"
            style={{ backgroundColor: "rgba(233,228,214,0.03)" }}
          >
            <span
              className="pointer-events-none absolute right-6 top-6 -rotate-12 border-2 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-widest opacity-70"
              style={{ borderColor: RED, color: RED }}
            >
              Empty
            </span>
            <Inbox className="h-6 w-6 text-white/30" />
            <p className="text-sm text-white/50">
              No tips filed yet. Share your link to start receiving them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
