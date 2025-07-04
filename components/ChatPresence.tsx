"use client";

import { useUser } from "@/lib/store/user";
import { supabaseBrowser } from "@/lib/supabase/browser";
import React, { useEffect, useState } from "react";

type PresenceEntry = { user_id: string };
type PresenceState = { [id: string]: PresenceEntry[] };

export default function ChatPresence() {
  const user = useUser((state) => state.user);
  const supabase = supabaseBrowser();
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const channel = supabase.channel("room1");
    channel
      .on("presence", { event: "sync" }, () => {
        const presence = channel.presenceState() as PresenceState;

        const userIds = [];
        for (const id in presence) {
          userIds.push(presence[id][0].user_id);
        }
        setOnlineUsers([...new Set(userIds)].length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user?.id,
          });
        }
      });
  }, [user, supabase]);

  if (!user) {
    return <div className=" h-3 w-1"></div>;
  }

  return (
    <div className="flex items-center gap-1">
      <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
      <h1 className="text-sm text-gray-400">{onlineUsers} online</h1>
    </div>
  );
}