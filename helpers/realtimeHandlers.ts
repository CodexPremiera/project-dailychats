// helpers/realtimeHandlers.ts
import { toast } from "sonner";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Imessage } from "@/lib/store/messages";

export async function handleInsert(
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

export function handleDelete(
  payload: any,
  optimisticDeleteMessage: (id: string) => void
) {
  optimisticDeleteMessage(payload.old.id);
}

export function handleUpdate(
  payload: any,
  optimisticUpdateMessage: (msg: Imessage) => void
) {
  optimisticUpdateMessage(payload.new as Imessage);
}
