/*
Join/leave the room for a given routeId.
Emit/send:
chat:message { routeId, body }
chat:typing { routeId, isTyping } (debounced in the hook)
chat:read { routeId, lastSeenMessageId }
Listen/handle:
chat:message (append to UI)
system:message (join/leave/delete notices)
chat:typing (drive TypingIndicator)
chat:read (update double checks)
chat:locked (disable MessageInput)
Cleanup listeners on unmount.
*/
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { socket } from "../helpers/socket";
import { EVENTS } from "@shared/chat-contract";

import { KompitrailContext } from "../context/KompitrailContext";

export const useChat = (chatId) => {
  const [messages, setMessages] = useState([]);
  const joinedRef = useRef(false); // Avoid duplicate join on fast renders
  const { user: currentUser } = useContext(KompitrailContext);

  // Append new message
  const pushMessage = useMemo(
    () => (msg) => setMessages((prev) => [...prev, msg]),
    []
  );

  useEffect(() => {
    if (!chatId) return;

    // Join after socket is connect
    const join = () => {
      if (joinedRef.current) return;
      socket.emit(EVENTS.C2S.ROOM_JOIN, { chatId, user: currentUser });
      joinedRef.current = true;
    };

    const onConnect = () => join();
    const onDisconnect = () => {
      joinedRef.current = false;
    };

    const onMessageNew = (payload) => {
      if (!payload || payload.chatId !== chatId) return;
      pushMessage(payload.message);
    };

    // Register listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(EVENTS.S2C.MESSAGE_NEW, onMessageNew);

    // If already connect, join inmidiately
    if (socket.connected) join();

    return () => {
      if (joinedRef.current) {
        socket.emit(EVENTS.C2S.ROOM_LEAVE, { chatId });
        joinedRef.current = false;
      }
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(EVENTS.S2C.MESSAGE_NEW, onMessageNew);
    };
  }, [chatId, currentUser, pushMessage]);

  return { messages };
};
