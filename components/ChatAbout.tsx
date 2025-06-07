import React from "react";

export default function ChatAbout() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col gap-4 w-96 text-center">
        <h1 className="text-3xl font-bold">Welcome to Daily Chat</h1>
        <p className="w-full">
          This is a chat application that power by supabase realtime
          db. Login to send message
        </p>
      </div>
    </div>
  );
}