"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Loader2, Fingerprint } from "lucide-react";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

// Dossier palette — keep in sync with Navbar.jsx / page.jsx
const PAPER = "#e9e4d6";
const RED = "#8b1e1e";
const INK = "#111111";
const fontDisplay = 'var(--font-display, "Courier New", monospace)';
const fontBody = 'var(--font-body, "Courier New", monospace)';

const inputClass =
  "rounded-none border-2 border-black bg-transparent px-3 py-2 text-black placeholder:text-black/30 focus-visible:ring-0 focus-visible:border-[#8b1e1e]";

const SignIn = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      setIsSubmitting(false);

      toast.add({
        title: "Access Denied",
        description: result.error,
        type: "error",
      });
    }
    setIsSubmitting(false);

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-2"
      style={{ backgroundColor: INK }}
    >
      {/* faint case-file grid, matches the hero section on the home page */}
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
          File: Access Request
        </div>

        <div
          className="border-2 border-black p-8 shadow-[6px_6px_0_0_rgba(0,0,0,0.4)]"
          style={{ backgroundColor: PAPER }}
        >
          <div className="mb-8 text-center">
            <Fingerprint
              className="mx-auto mb-3 h-8 w-8"
              style={{ color: RED }}
            />
            <h1
              className="text-2xl tracking-tight md:text-3xl"
              style={{ fontFamily: fontDisplay, color: INK }}
            >
              Verify Your Identity
            </h1>
            <p
              className="mt-2 text-sm text-black/60"
              style={{ fontFamily: fontBody }}
            >
              Sign in to check your inbox and see who&apos;s talking.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-xs font-bold uppercase tracking-wide text-black"
                      style={{ fontFamily: fontBody }}
                    >
                      Agent ID (Email or Username)
                    </FormLabel>
                    <Input {...field} name="email" className={inputClass} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-xs font-bold uppercase tracking-wide text-black"
                      style={{ fontFamily: fontBody }}
                    >
                      Passcode
                    </FormLabel>
                    <Input
                      type="password"
                      {...field}
                      name="password"
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
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <div
            className="mt-6 border-t-2 border-black/10 pt-5 text-center text-sm text-black/70"
            style={{ fontFamily: fontBody }}
          >
            Not on file yet?{" "}
            <Link
              href="/sign-up"
              className="font-bold underline"
              style={{ color: RED }}
            >
              Open a file
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
