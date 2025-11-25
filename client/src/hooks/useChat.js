import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { socket } from "../helpers/socket";
import { EVENTS } from "@shared/chat-contract";
import { KompitrailContext } from "../context/KompitrailContext";
import { formatDateTime } from "../helpers/utils";

export const useChat = (chatId) => {
  const [messages, setMessages] = useState([]);
  const joinedRef = useRef(false);
  const { user: currentUser } = useContext(KompitrailContext);

  // Format and add message to state
  const handleNewMessage = useCallback(
    (payload) => {
      if (!payload || payload.chatId !== chatId) return;

      const msg = payload.message;
      const isSystem = msg.userId === "system";

      setMessages((prev) => {
        // Dedupe: ignore if message id already present
        if (prev.some((m) => m.id === msg.id)) return prev;

        const { time_hh_mm } = formatDateTime(msg.createdAt, {
          locale: "es-ES",
          timeZone: "Europe/Madrid",
        });

        return [
          ...prev,
          {
            id: msg.id,
            text: msg.text,
            fromMe: !isSystem && msg.userId === currentUser?.user_id,
            at: time_hh_mm,
            createdAt: msg.createdAt,
            isSystem,
          },
        ];
      });
    },
    [chatId, currentUser?.user_id]
  );

  // Send message function
  const sendMessage = useCallback(
    (text) => {
      if (!chatId || !text?.trim()) return;

      socket.emit(EVENTS.C2S.MESSAGE_SEND, {
        chatId,
        text,
      });
    },
    [chatId]
  );

  // Join/leave room management
  useEffect(() => {
    if (!chatId || !currentUser?.user_id) return;

    const payload = { chatId, user: currentUser };

    const join = () => {
      if (joinedRef.current) return;
      socket.emit(EVENTS.C2S.ROOM_JOIN, payload);
      joinedRef.current = true;
    };

    const onConnect = () => join();

    const onDisconnect = () => {
      joinedRef.current = false;
    };

    // Register listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(EVENTS.S2C.MESSAGE_NEW, handleNewMessage);

    // If already connected, join immediately
    if (socket.connected) join();

    return () => {
      if (joinedRef.current) {
        socket.emit(EVENTS.C2S.ROOM_LEAVE, {
          chatId,
          user: currentUser,
        });
        joinedRef.current = false;
      }
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(EVENTS.S2C.MESSAGE_NEW, handleNewMessage);
    };
  }, [chatId, currentUser, handleNewMessage]);

  return {
    messages,
    sendMessage,
  };
};
