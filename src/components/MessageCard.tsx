"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { toast } from "./ui/toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "./ui/button";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDelete = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`,
    );
    toast.add({
      title: response.data.message,
    });
    onMessageDelete(message._id.toString());
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{message.content}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant={"destructive"}>
              <X />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
