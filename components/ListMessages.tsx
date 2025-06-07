"use client";
import React from "react";
import {useMessage} from "@/lib/store/messages";
import Message from "@/components/Message";
import {DeleteAlert, EditAlert} from "@/components/MessageActions";

export default function ListMessages() {
  const messages = useMessage((state) => state.messages);

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