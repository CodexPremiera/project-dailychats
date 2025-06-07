"use client";
import { Imessage, useMessage } from "@/lib/store/messages";
import React, { useEffect } from "react";
import Message from "./Message";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import {DeleteAlert, EditAlert} from "@/components/MessageActions";
import {handleDelete, handleInsert, handleUpdate} from "@/helpers/realtimeHandlers";

export default function ListMessages() {
  const {
    messages,
    addMessage,
    optimisticIds,
    optimisticDeleteMessage,
    optimisticUpdateMessage,
  } = useMessage((state) => state);

  const supabase = supabaseBrowser();
  useEffect(() => {
    const supabase = supabaseBrowser();
    const channel = supabase
      .channel("chat-room")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) =>
        handleInsert(payload, optimisticIds, addMessage)
      )
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "messages" }, (payload) =>
        handleDelete(payload, optimisticDeleteMessage)
      )
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "messages" }, (payload) =>
        handleUpdate(payload, optimisticUpdateMessage)
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [optimisticIds, addMessage, optimisticDeleteMessage, optimisticUpdateMessage]);

  return (
    <div className="flex-1 flex flex-col justify-end p-5 h-full overflow-y-auto scrollbar-thin">
      <div className="space-y-7">
        {messages.map((value, index) => {
          return <Message key={index} message={value}/>;
        })}
      </div>
      <DeleteAlert/>
      <EditAlert />
    </div>
  );
}