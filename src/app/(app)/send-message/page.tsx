"use client";

import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";

// Dossier palette — keep in sync with the rest of the app
const PAPER = "#e9e4d6";
const RED = "#8b1e1e";
const INK = "#111111";
const fontDisplay = 'var(--font-display, "Courier New", monospace)';
const fontBody = 'var(--font-body, "Courier New", monospace)';

const SendMessage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const findUser = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSearching(true);
    try {
      const response = await axios.get(
        `/api/find-user?username=${encodeURIComponent(username.trim())}`,
      );

      router.push(`/u/${encodeURIComponent(response.data.username)}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      setErrorMessage(
        axiosError.response?.data.message ?? "Unable to find username",
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12"
      style={{ backgroundColor: INK }}
    >
      {/* faint case-file grid, matches SignIn/SignUp */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#e9e4d6 1px, transparent 1px), linear-gradient(90deg, #e9e4d6 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* folder tab */}
        <div
          className="ml-6 inline-block border-2 border-b-0 border-black px-4 py-1 text-xs font-bold uppercase tracking-widest"
          style={{ backgroundColor: RED, color: PAPER, fontFamily: fontBody }}
        >
          File: Message Lookup
        </div>

        <div
          className="border-2 border-black p-8 shadow-[6px_6px_0_0_rgba(0,0,0,0.4)]"
          style={{ backgroundColor: PAPER }}
        >
          <div className="mb-8 text-center">
            <Search className="mx-auto mb-3 h-8 w-8" style={{ color: RED }} />
            <h1
              className="text-2xl tracking-tight md:text-3xl"
              style={{ fontFamily: fontDisplay, color: INK }}
            >
              Locate a File
            </h1>
            <p
              className="mt-2 text-sm text-black/60"
              style={{ fontFamily: fontBody }}
            >
              Enter a username to send them an anonymous tip.
            </p>
          </div>

          <form onSubmit={findUser} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-black"
                style={{ fontFamily: fontBody }}
              >
                Recipient Username
              </label>
              <input
                id="username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="e.g. anon_412"
                autoComplete="off"
                className="w-full rounded-none border-2 border-black bg-transparent px-3 py-2 text-black placeholder:text-black/30 focus:border-[#8b1e1e] focus:outline-none"
                style={{ fontFamily: fontBody }}
              />
              {errorMessage && (
                <p
                  className="mt-2 text-xs font-bold uppercase tracking-wide"
                  style={{ color: RED, fontFamily: fontBody }}
                >
                  {errorMessage}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSearching || !username.trim()}
              className="flex w-full items-center justify-center gap-2 border-2 border-black py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-[#8b1e1e] hover:border-[#8b1e1e] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black disabled:hover:border-black"
              style={{
                backgroundColor: INK,
                color: PAPER,
                fontFamily: fontBody,
              }}
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendMessage;
