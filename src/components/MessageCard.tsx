"use client";

import { useState } from "react";
import { Mail, X, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Message } from "@/model/User";
import { toast } from "./ui/toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

// Dossier palette — keep in sync with the rest of the app
const PAPER = "#e9e4d6";
const RED = "#8b1e1e";
const INK = "#111111";
const fontDisplay = 'var(--font-display, "Courier New", monospace)';
const fontBody = 'var(--font-body, "Courier New", monospace)';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function formatReceived(date: Message["createdAt"]) {
  if (!date) return null;
  return new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const received = formatReceived(message.createdAt);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`,
      );
      toast.add({
        title: "Message Deleted",
        description: response.data.message,
      });
      setIsDialogOpen(false); // only close once the delete actually succeeds
      onMessageDelete(message._id.toString());
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Delete Failed",
        description:
          axiosError.response?.data.message ||
          "Could not delete this message. Try again.",
        type: "error",
      });
      // dialog stays open on failure so the user can see the error and retry
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="group relative border-2 border-black p-5 pr-12 shadow-[4px_4px_0_0_rgba(0,0,0,0.15)] transition-shadow hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.2)]"
      style={{ backgroundColor: PAPER }}
    >
      <div
        className="flex items-start gap-2.5"
        style={{ fontFamily: fontBody }}
      >
        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-black/40" />
        <p className="text-sm leading-relaxed text-black/85">
          {message.content}
        </p>
      </div>

      {received && (
        <p
          className="mt-4 inline-block border border-black/25 px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-black/45"
          style={{ fontFamily: fontBody }}
        >
          Received {received}
        </p>
      )}

      {/* ---- Delete ---- */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger
          aria-label="Delete message"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center border-2 border-black/20 text-black/40 transition-colors hover:border-black hover:bg-black hover:text-[#e9e4d6]"
        >
          <X className="h-3.5 w-3.5" />
        </AlertDialogTrigger>
        <AlertDialogContent
          className="rounded-none border-2 border-black"
          style={{ backgroundColor: PAPER, fontFamily: fontBody }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              className="text-black"
              style={{ fontFamily: fontDisplay }}
            >
              Discard this message?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black/60">
              This will permanently delete this message from your inbox. This
              action cannot be undone — the sender stays anonymous either way.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-none border-2 border-black bg-transparent text-black hover:bg-black/5"
              style={{ fontFamily: fontBody }}
            >
              Keep It
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-none border-2 border-black text-[#e9e4d6] hover:border-[#8b1e1e]"
              style={{
                backgroundColor: isDeleting ? "#6b1717" : RED,
                fontFamily: fontBody,
              }}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Deleting
                </>
              ) : (
                "Delete Message"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MessageCard;
