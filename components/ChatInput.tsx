"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/lib/store/user";
import { Imessage, useMessage } from "@/lib/store/messages";
import { Button } from "@/components/ui/button";
import { Send as SendIcon } from "lucide-react";

export default function ChatInput() {
  const [text, setText] = useState("");
  const user = useUser((state) => state.user);
  const addMessage = useMessage((state) => state.addMessage);
  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);

  const supabase = supabaseBrowser();

  const handleSendMessage = async () => {
    if (!text.trim()) return;

    const id = uuidv4();
    const newMessage = {
      id: id,
      text,
      send_by: user?.id,
      is_edit: false,
      created_at: new Date().toISOString(),
      users: {
        id: user?.id,
        avatar_url: user?.user_metadata.avatar_url,
        created_at: new Date().toISOString(),
        display_name: user?.user_metadata.user_name,
      },
    };

    addMessage(newMessage as Imessage);
    setOptimisticIds(newMessage.id);

    const { error } = await supabase.from("messages").insert({ id, text });
    if (error) toast.error(error.message);

    setText(""); // Clear input
  };

  return (
    <div className="flex gap-3 pl-5 pr-4 py-5">
      <Input
        placeholder="send message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
      />
      <Button onClick={handleSendMessage}>
        Send
        <SendIcon />
      </Button>
    </div>
  );
}
