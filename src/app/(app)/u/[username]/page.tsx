"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/toast";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, Send, EyeOff } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";

// Dossier palette — keep in sync with the rest of the app
const PAPER = "#e9e4d6";
const RED = "#8b1e1e";
const INK = "#111111";
const fontDisplay = 'var(--font-display, "Courier New", monospace)';
const fontBody = 'var(--font-body, "Courier New", monospace)';

const inputClass =
  "min-h-[140px] rounded-none border-2 border-black bg-transparent px-3 py-2 text-black placeholder:text-black/30 focus-visible:ring-0 focus-visible:border-[#8b1e1e]";

const Messages = () => {
  const params = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    // Without this, `content` starts as undefined and the Textarea flips
    // from uncontrolled to controlled on the first keystroke (React warning).
    defaultValues: { content: "" },
  });
  // eslint-disable-next-line react-hooks/incompatible-library
  const messageContent = form.watch("content");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username: params.username,
        ...data,
      });

      toast.add({
        title: "Tip Delivered",
        description: response.data.message,
      });
      form.reset({ content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Failed to Send",
        description:
          axiosError.response?.data.message ??
          "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12"
      style={{ backgroundColor: INK }}
    >
      {/* faint case-file grid, matches SignIn/SignUp/SendMessage */}
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
          File: @{params.username}
        </div>

        <div
          className="border-2 border-black p-8 shadow-[6px_6px_0_0_rgba(0,0,0,0.4)]"
          style={{ backgroundColor: PAPER }}
        >
          <div className="mb-6 text-center">
            <EyeOff className="mx-auto mb-3 h-8 w-8" style={{ color: RED }} />
            <h1
              className="text-2xl tracking-tight md:text-3xl"
              style={{ fontFamily: fontDisplay, color: INK }}
            >
              Submit a Tip
            </h1>
            <p
              className="mt-2 text-sm text-black/60"
              style={{ fontFamily: fontBody }}
            >
              Anonymous to{" "}
              <span className="font-bold text-black">@{params.username}</span>.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="content"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-xs font-bold uppercase tracking-wide text-black"
                      style={{ fontFamily: fontBody }}
                    >
                      Your Message
                    </FormLabel>
                    <Textarea
                      placeholder="Write your anonymous message here…"
                      className={inputClass}
                      style={{ fontFamily: fontBody }}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading || !messageContent?.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-none border-2 border-black py-5 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-[#8b1e1e] hover:border-[#8b1e1e]"
                style={{
                  backgroundColor: INK,
                  color: PAPER,
                  fontFamily: fontBody,
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send It
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* growth loop — the person sending a tip is a prospective user too */}
          <div
            className="mt-6 border-t-2 border-black/10 pt-5 text-center text-sm text-black/70"
            style={{ fontFamily: fontBody }}
          >
            Want tips of your own?{" "}
            <Link
              href="/sign-up"
              className="font-bold underline"
              style={{ color: RED }}
            >
              Open your file
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
