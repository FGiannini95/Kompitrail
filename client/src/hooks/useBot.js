import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { getCurrentLang } from "../helpers/oneRouteUtils";
import { formatDateTime } from "../helpers/utils";
import { BOT_URL } from "../api";

export const useBot = () => {
  const { i18n } = useTranslation();

  // Initial system welcome message
  const welcomeMessage = useMemo(() => {
    const now = new Date().toISOString();
    return [
      {
        id: "sys-welcome",
        text: "Hi! 👋 I'm the app assistant. How can I help you?",
        isSystem: true,
        createdAt: now,
      },
    ];
  }, []);

  const [messages, setMessages] = useState(() => welcomeMessage);
  const [isSending, setIsSending] = useState(false);

  // Send message to the chatbot backend
  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || "").trim();
      if (!trimmed) return;
      if (isSending) return;

      const nowIso = new Date().toISOString();

      const { time_hh_mm } = formatDateTime(nowIso, {
        locale: "es-ES",
        timeZone: "Europe/Madrid",
      });

      // Add user message optimistically
      const userMsg = {
        id: `u-${Date.now()}`,
        text: trimmed,
        fromMe: true,
        at: time_hh_mm,
        createdAt: nowIso,
        isSystem: false,
      };

      setMessages((prev) => [...prev, userMsg]);

      try {
        setIsSending(true);
        const lang = getCurrentLang(i18n);

        // Call chatbot backend
        const { data } = await axios.post(`${BOT_URL}?lang=${lang}`, {
          message: trimmed,
        });

        const replyText =
          data?.reply ||
          "Sorry, I couldn't answer that right now. Please try again.";

        const replyIso = new Date().toISOString();
        const { time_hh_mm: replyTime } = formatDateTime(replyIso);

        // Add assistant reply
        const botMsg = {
          id: `b-${Date.now()}`,
          text: replyText,
          fromMe: false,
          at: replyTime,
          createdAt: replyIso,
          isSystem: false,
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch (error) {
        // Add system error message
        const errIso = new Date().toISOString();

        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            text: "The assistant is temporarily unavailable. Please try again.",
            isSystem: true,
            createdAt: errIso,
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [i18n, isSending]
  );

  // Reset state when leaving
  useEffect(() => {
    return () => {
      setMessages(welcomeMessage);
      setIsSending(false);
    };
  }, []);

  return {
    messages,
    sendMessage,
    isSending,
  };
};
