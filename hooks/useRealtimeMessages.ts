// hooks/useRealtimeMessages.ts
import { toast } from "sonner";
import { supabaseBrowser } from "@/lib/supabase/browser";
import {Imessage, useMessage} from "@/lib/store/messages";
import {useEffect} from "react";


export function useRealtimeMessages(scrollRef, setNotification) {
  const {
    addMessage,
    optimisticIds,
    optimisticDeleteMessage,
    optimisticUpdateMessage,
  } = useMessage((state) => state);

  useEffect(() => {
    const supabase = supabaseBrowser();
    const channel = supabase
      .channel("chat-room")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        handleInsert(payload, optimisticIds, addMessage);
        const scrollContainer = scrollRef.current;
        if (
          scrollContainer.scrollTop <
          scrollContainer.scrollHeight -
          scrollContainer.clientHeight -
          10
        ) {
          setNotification((current) => current + 1);
        }
      })
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
}


// =========== HELPERS

async function handleInsert(
  payload: any,
  optimisticIds: string[],
  addMessage: (msg: Imessage) => void
) {
  const newMessage = payload.new;

  if (optimisticIds.includes(newMessage.id)) return;

  const supabase = supabaseBrowser();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", newMessage.send_by)
    .single();

  if (error) {
    toast.error(error.message);
    return;
  }

  addMessage({ ...newMessage, users: user } as Imessage);
}

function handleDelete(
  payload: any,
  optimisticDeleteMessage: (id: string) => void
) {
  optimisticDeleteMessage(payload.old.id);
}

function handleUpdate(
  payload: any,
  optimisticUpdateMessage: (msg: Imessage) => void
) {
  optimisticUpdateMessage(payload.new as Imessage);
}
