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
import React, { useMemo, useRef, useState } from "react";
import { socket } from "../helpers/socket";
import Contract from "@shared/chat-contract";
const { EVENTS } = Contract;

export const useChat = (chatId) => {
  const [messages, setMessages] = useState([]);
  const joinedRef = useRef(false); // Avoid duplicate join on fast renders

  // Append new message
  const pushMessage = useMemo(
    () => (msg) => setMessages((prev) => [...prev, msg]),
    []
  );

  socket.emit(EVENTS.C2S.ROOM_JOIN, { chatId });
  socket.on(EVENTS.S2C.MESSAGE_NEW, (payload) => {});
};
