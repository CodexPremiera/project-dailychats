"use client";
import { useMessage } from "@/lib/store/messages";
import React, {useEffect, useRef, useState} from "react";
import Message from "./Message";
import {DeleteAlert, EditAlert} from "@/components/MessageActions";

import { ArrowDown } from "lucide-react";
import {useRealtimeMessages} from "@/hooks/useRealtimeMessages";

export default function ListMessages() {
  const messages = useMessage((state) => state.messages);

  // Fetch latest messages as they are updated
  useRealtimeMessages();

  const scrollRef = useRef() as React.MutableRefObject<HTMLElement>;
  const [userScrolled, setUserScrolled] = useState(false);

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScroll = scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
      setUserScrolled(isScroll);
    }
  };

  // Scroll to bottom on initial mount
  const scrollDown = () => scrollRef.current.scrollTo({
    top: scrollRef.current.scrollHeight,
    behavior: "smooth"
  });

  useEffect(() => {
    scrollDown()
  }, [messages]);

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

      <div className={`absolute bottom-20 right-1/2 transition-opacity duration-300 ${userScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div
          className="w-10 h-10 bg-accent rounded-full flex items-center justify-center border cursor-pointer hover:scale-110 transition-all duration-400"
          onClick={scrollDown}
        >
          <ArrowDown/>
        </div>
      </div>
      <DeleteAlert/>
      <EditAlert/>
    </>
  );
}