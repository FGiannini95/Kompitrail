import React from "react";
import { useBot } from "../../../hooks/useBot";
import { ChatRoom } from "../../../components/Chat/ChatRoom/ChatRoom";

export const ChatRoomBotPage = () => {
  const { messages, sendMessage, isSending } = useBot();

  return (
    <ChatRoom
      mode="bot"
      title="Kompitrail bot"
      messages={messages}
      sendMessage={sendMessage}
      isLoading={false}
      isSending={isSending}
    />
  );
};
