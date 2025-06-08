import React from "react";
import ChatHeader from "@/components/ChatHeader";
import { supabaseServer } from "@/lib/supabase/server";
import InitUser from "@/lib/store/InitUser";
import ChatInput from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import ChatAbout from "@/components/ChatAbout";

export default async function Page() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  return (
    <>
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className=" h-full border rounded-md flex flex-col relative">
          <ChatHeader user={data.user ? data.user : undefined} />

          {data.user ? (
            <>
              <ChatMessages />
              <ChatInput />
              <InitUser user={data.user} />
            </>
          ) : (
            <ChatAbout />
          )}
        </div>
      </div>
    </>
  );
}