"use client";
import { Imessage, useMessage } from "@/lib/store/messages";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { ArrowDown } from "lucide-react";
import {DeleteAlert, EditAlert} from "@/components/MessageActions";
import {useRealtimeMessages} from "@/hooks/useRealtimeMessages";

export default function ListMessages() {
  const messages = useMessage((state) => state.messages);

  const scrollRef = useRef() as React.MutableRefObject<HTMLElement>;
  const [userScrolled, setUserScrolled] = useState(false);
  const [notification, setNotification] = useState(0);

  // Fetch latest messages as they are updated
  useRealtimeMessages(scrollRef, setNotification);

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScroll = scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
      setUserScrolled(isScroll);
      if (
        scrollContainer.scrollTop ===
        scrollContainer.scrollHeight - scrollContainer.clientHeight
      ) {
        setNotification(0);
      }
    }
  };

  // Scroll to bottom on initial mount
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer && !userScrolled) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const scrollDown = () => {
    setNotification(0);
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  };

  return (
    <>
      <div className="flex-1 flex flex-col p-5 h-full overflow-y-auto scrollbar-thin"
           ref={scrollRef}
           onScroll={handleOnScroll}
      >
        <div className=" space-y-7">
          {messages.map((value, index) => {
            return <Message key={index} message={value}/>;
          })}
        </div>
      </div>

      <div
        className={`absolute bottom-20 w-full transition-opacity duration-300 ${userScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {notification ? (
          <div
            className="w-36 h-6 mx-auto bg-accent rounded-lg flex items-center justify-center border cursor-pointer"
            onClick={scrollDown}
          >
            <span>New {notification} messages</span>
          </div>
        ) : (
          <div
            className="w-10 h-10 mx-auto bg-accent rounded-full flex items-center justify-center border cursor-pointer hover:scale-110 transition-all duration-400"
            onClick={scrollDown}
          >
            <ArrowDown/>
          </div>
        )}
      </div>

      <DeleteAlert/>
      <EditAlert/>
    </>
  );
}