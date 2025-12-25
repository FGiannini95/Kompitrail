import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useChat } from "../../../hooks/useChat";
import { ChatRoom } from "../../../components/Chat/ChatRoom/ChatRoom";

export const ChatRoomGroupPage = () => {
  const { id } = useParams();
  const location = useLocation();

  const { messages, sendMessage, isLoading } = useChat(id);
  return (
    <ChatRoom
      mode="group"
      chatId={id}
      title={location.state?.title || "Chat"}
      messages={messages}
      sendMessage={sendMessage}
      isLoading={isLoading}
      isSending={false}
    />
  );
};
