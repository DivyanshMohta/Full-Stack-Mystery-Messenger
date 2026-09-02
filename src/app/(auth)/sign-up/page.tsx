"use client";

import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
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
import axios, { AxiosError } from "axios";
import { Loader2, FolderPlus, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";

// Dossier palette — keep in sync with SignIn.tsx / Navbar.jsx / page.jsx
const PAPER = "#e9e4d6";
const RED = "#8b1e1e";
const GREEN = "#2f5d3a";
const INK = "#111111";
const fontDisplay = 'var(--font-display, "Courier New", monospace)';
const fontBody = 'var(--font-body, "Courier New", monospace)';

const inputClass =
  "rounded-none border-2 border-black bg-transparent px-3 py-2 text-black placeholder:text-black/30 focus-visible:ring-0 focus-visible:border-[#8b1e1e]";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage(""); // Reset message
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username?username=${username}`,
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username",
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);

      toast.add({
        title: "File Opened",
        description: response.data.message,
      });

      // router.replace(`/verify/${username}`);
      router.replace("/sign-in");

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error during sign-up:", error);

      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage =
        axiosError.response?.data.message ||
        "There was a problem opening your file. Please try again.";

      toast.add({
        title: "Registration Failed",
        description: errorMessage,
      });

      setIsSubmitting(false);
    }
  };

  const isAvailable = usernameMessage === "Username is available";

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12"
      style={{ backgroundColor: INK }}
    >
      {/* faint case-file grid, matches SignIn.tsx and the home page hero */}
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
          File: New Registration
        </div>

        <div
          className="border-2 border-black p-8 shadow-[6px_6px_0_0_rgba(0,0,0,0.4)]"
          style={{ backgroundColor: PAPER }}
        >
          <div className="mb-8 text-center">
            <FolderPlus
              className="mx-auto mb-3 h-8 w-8"
              style={{ color: RED }}
            />
            <h1
              className="text-2xl tracking-tight md:text-3xl"
              style={{ fontFamily: fontDisplay, color: INK }}
            >
              Open Your File
            </h1>
            <p
              className="mt-2 text-sm text-black/60"
              style={{ fontFamily: fontBody }}
            >
              Register an alias to start receiving anonymous tips.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-xs font-bold uppercase tracking-wide text-black"
                      style={{ fontFamily: fontBody }}
                    >
                      Username
                    </FormLabel>
                    <Input
                      {...field}
                      className={inputClass}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />

                    {isCheckingUsername && (
                      <div
                        className="flex items-center gap-1.5 text-xs text-black/50"
                        style={{ fontFamily: fontBody }}
                      >
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Checking availability
                      </div>
                    )}
                    {!isCheckingUsername && usernameMessage && (
                      <div
                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide"
                        style={{
                          fontFamily: fontBody,
                          color: isAvailable ? GREEN : RED,
                        }}
                      >
                        {isAvailable ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <X className="h-3.5 w-3.5" />
                        )}
                        {isAvailable ? "Username Available" : usernameMessage}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-xs font-bold uppercase tracking-wide text-black"
                      style={{ fontFamily: fontBody }}
                    >
                      Contact Email
                    </FormLabel>
                    <Input {...field} name="email" className={inputClass} />
                    {/* <p
                      className="text-xs text-black/45"
                      style={{ fontFamily: fontBody }}
                    >
                      A verification code will be sent here.
                    </p> */}
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
                    Filing
                  </>
                ) : (
                  "Open File"
                )}
              </Button>
            </form>
          </Form>

          <div
            className="mt-6 border-t-2 border-black/10 pt-5 text-center text-sm text-black/70"
            style={{ fontFamily: fontBody }}
          >
            Already on file?{" "}
            <Link
              href="/sign-in"
              className="font-bold underline"
              style={{ color: RED }}
            >
              Verify your identity
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
