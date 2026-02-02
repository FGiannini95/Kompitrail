import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { EVENTS } from "@shared/chat-contract";
import { KompitrailContext } from "../context/KompitrailContext";
import { socket } from "../helpers/socket";
import { formatDateTime } from "../helpers/utils";
import axios from "axios";
import { CHAT_URL } from "../api";

export const useChat = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);

  const joinedRef = useRef(false);
  const typingTimeoutRef = useRef(null);
  const { user: currentUser } = useContext(KompitrailContext);

  // Fetch messages from the db
  useEffect(() => {
    if (!chatId || !currentUser?.user_id) return;

    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${CHAT_URL}/rooms/${chatId}/messages?user_id=${currentUser.user_id}`,
        );

        // Format messages for MessageList
        const formattedMessages = response.data.messages.map((msg) => {
          const isSystem = msg.isSystem === 1 || msg.userId === "system";

          // Format time for display (HH:mm)
          const { time_hh_mm } = formatDateTime(msg.createdAt, {
            locale: "es-ES",
            timeZone: "Europe/Madrid",
          });

          const formatted = {
            id: msg.id,
            text: msg.text,
            fromMe: !isSystem && msg.userId === currentUser.user_id,
            at: time_hh_mm,
            createdAt: msg.createdAt,
            isSystem,
            displayName: msg.displayName,
          };

          return formatted;
        });

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error al cargar los mensajes", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [chatId, currentUser]);

  // Format and add message to state coming from socket
  const handleNewMessage = useCallback(
    (payload) => {
      if (!payload || payload.chatId !== chatId) return;

      const msg = payload.message;
      const isSystem = msg.userId === "system";

      setMessages((prev) => {
        // Dedupe: ignore if message id already present
        if (prev.some((m) => m.id === msg.id)) return prev;
        // Format time for display
        const { time_hh_mm } = formatDateTime(msg.createdAt, {
          locale: "es-ES",
          timeZone: "Europe/Madrid",
        });
        // Add new message to the list
        return [
          ...prev,
          {
            id: msg.id,
            text: msg.text,
            fromMe: !isSystem && msg.userId === currentUser?.user_id,
            at: time_hh_mm,
            createdAt: msg.createdAt,
            isSystem,
            displayName: msg.displayName,
          },
        ];
      });
    },
    [chatId, currentUser?.user_id],
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
    [chatId],
  );

  // Handle typing updates -others
  const handleTypingUpdate = useCallback(
    (payload) => {
      if (!payload || payload.chatId !== chatId) return;

      const { userId, displayName, isTyping } = payload;

      setTypingUsers((prev) => {
        if (isTyping) {
          // Add user to typing list (avoid duplicates)
          return prev.some((u) => u.userId === userId)
            ? prev
            : [...prev, { userId, displayName }];
        } else {
          // Remove user from typing list
          return prev.filter((u) => u.userId !== userId);
        }
      });
    },
    [chatId],
  );

  // Send typing events - me
  const handleTypingStart = useCallback(() => {
    if (!chatId) return;

    // Conenction with the server
    socket.emit(EVENTS.C2S.TYPING_START, { chatId });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(EVENTS.C2S.TYPING_STOP, { chatId });
    }, 3000);
  }, [chatId]);

  // Send typing events - me
  const handleTypingStop = useCallback(() => {
    if (!chatId) return;

    // Conenction with the server
    socket.emit(EVENTS.C2S.TYPING_STOP, { chatId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [chatId]);

  // Join/leave room management
  useEffect(() => {
    if (!chatId || !currentUser?.user_id) return;

    const payload = { chatId, user: currentUser };

    // Join the socket room
    const join = () => {
      if (joinedRef.current) return;
      joinedRef.current = true;

      socket.emit(EVENTS.C2S.ROOM_JOIN, payload);
    };

    // Handle reconnection
    const onConnect = () => join();

    const onDisconnect = () => {
      joinedRef.current = false;
    };

    // Register socket  listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(EVENTS.S2C.MESSAGE_NEW, handleNewMessage);
    socket.on(EVENTS.S2C.TYPING_UPDATE, handleTypingUpdate);

    // If already connected, join immediately
    if (socket.connected) join();

    return () => {
      if (joinedRef.current) {
        socket.emit(EVENTS.C2S.ROOM_LEAVE, {
          chatId,
          user: currentUser,
        });
      }

      // Clear typing timeout on cleanup
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(EVENTS.S2C.MESSAGE_NEW, handleNewMessage);
      socket.off(EVENTS.S2C.TYPING_UPDATE, handleTypingUpdate);
    };
  }, [chatId, currentUser?.user_id, handleNewMessage, handleTypingUpdate]);

  return {
    messages,
    sendMessage,
    isLoading,
    handleTypingStart,
    handleTypingStop,
    typingUsers,
  };
};
