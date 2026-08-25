"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { KeyRound, Loader2 } from "lucide-react";

// Dossier palette — keep in sync with the rest of the app
const PAPER = "#e9e4d6";
const RED = "#8b1e1e";
const INK = "#111111";
const fontDisplay = 'var(--font-display, "Courier New", monospace)';
const fontBody = 'var(--font-body, "Courier New", monospace)';

const inputClass =
  "rounded-none border-2 border-black bg-transparent px-3 py-2 text-center text-lg tracking-[0.4em] text-black placeholder:tracking-normal placeholder:text-black/30 focus-visible:ring-0 focus-visible:border-[#8b1e1e]";

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    // Without this, `code` starts as undefined and the Input flips from
    // uncontrolled to controlled on the first keystroke (React warning).
    defaultValues: { code: "" },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast.add({
        title: "Identity Confirmed",
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Verification Failed",
        description:
          axiosError.response?.data.message ??
          "An error occurred. Please try again.",
        type: "error",
      });
      setIsSubmitting(false);
    }
    // no `finally` reset on success — router.replace navigates away, so
    // leaving the button disabled/loading through that transition is correct.
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12"
      style={{ backgroundColor: INK }}
    >
      {/* faint case-file grid, matches SignIn/SignUp/Messages */}
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
          File: Verification
        </div>

        <div
          className="border-2 border-black p-8 shadow-[6px_6px_0_0_rgba(0,0,0,0.4)]"
          style={{ backgroundColor: PAPER }}
        >
          <div className="mb-8 text-center">
            <KeyRound className="mx-auto mb-3 h-8 w-8" style={{ color: RED }} />
            <h1
              className="text-2xl tracking-tight md:text-3xl"
              style={{ fontFamily: fontDisplay, color: INK }}
            >
              Confirm Your Clearance
            </h1>
            <p
              className="mt-2 text-sm text-black/60"
              style={{ fontFamily: fontBody }}
            >
              Enter the code sent to the email on file for{" "}
              <span className="font-bold text-black">@{params.username}</span>.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-xs font-bold uppercase tracking-wide text-black"
                      style={{ fontFamily: fontBody }}
                    >
                      Verification Code
                    </FormLabel>
                    <Input
                      {...field}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="••••••"
                      className={inputClass}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-none border-2 border-black py-5 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-[#8b1e1e] hover:border-[#8b1e1e]"
                style={{
                  backgroundColor: INK,
                  color: PAPER,
                  fontFamily: fontBody,
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
