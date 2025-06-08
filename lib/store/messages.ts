import { create } from "zustand";

export type Imessage = {
  created_at: string | null;
  id: string;
  is_edit: boolean | null;
  send_by: string | null;
  text: string;
  users: {
    avatar_url: string | null;
    created_at: string;
    display_name: string | null;
    id: string;
  } | null;
};

interface MessageState {
  messages: Imessage[];
  addMessage: (message: Imessage) => void;

  actionMessage: Imessage | undefined;
  setActionMessage: (message: Imessage | undefined) => void;

  optimisticIds: string[];
  setOptimisticIds: (id: string) => void;

  optimisticDeleteMessage: (messageId: string) => void;
  optimisticUpdateMessage: (message: Imessage) => void;
}

export const useMessage = create<MessageState>()((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  actionMessage: undefined,
  setActionMessage: (message) => set(() => ({ actionMessage: message })),

  optimisticIds: [],
  setOptimisticIds: (id: string) =>
    set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),

  optimisticDeleteMessage: (messageId) =>
    set((state) => {
      return {
        messages: state.messages.filter(
          (message) => message.id !== messageId
        ),
      };
    }),

  optimisticUpdateMessage: (updateMessage) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => {
          if (message.id === updateMessage.id) {
            (message.text = updateMessage.text);
              (message.is_edit = updateMessage.is_edit);
          }
          return message;
        }),
      };
    }),

}));