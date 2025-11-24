import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { Box, Divider, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// Utils
import { formatDateTime } from "../../../helpers/utils";
import { socket } from "../../../helpers/chat";
// Hooks & Providers
import { KompitrailContext } from "../../../context/KompitrailContext";
// Components
import { MessageList } from "../MessageList/MessageList";
import { MessageInput } from "../MessageInput/MessageInput";

import { EVENTS } from "@shared/chat-contract";

export const ChatRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser } = useContext(KompitrailContext);

  const title = location.state?.title || "Chat";

  const [messages, setMessages] = useState([]);

  // Listen for new messages
  useEffect(() => {
    const handleNewMessage = (payload) => {
      if (payload.chatId !== id) return;

      const msg = payload.message;
      const isSystem = msg.userId === "system";

      // dedupe: ignore if message id already present
      setMessages((prev) => {
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
    };

    socket.on(EVENTS.S2C.MESSAGE_NEW, handleNewMessage);
    return () => socket.off(EVENTS.S2C.MESSAGE_NEW, handleNewMessage);
  }, [id, currentUser]);

  // JOIN the room on mount (and on reconnect); LEAVE on unmount
  useEffect(() => {
    if (!id || !currentUser?.user_id) return;

    const payload = { chatId: id, user: currentUser };

    const join = () => {
      // join the socket room for this route_id
      socket.emit(EVENTS.C2S.ROOM_JOIN, payload);
    };

    // join immediately if already connected
    if (socket.connected) join();

    // re-join after any reconnect
    socket.on("connect", join);

    return () => {
      socket.off("connect", join);
      // leave when you exit the screen
      socket.emit(EVENTS.C2S.ROOM_LEAVE, { chatId: id, user: currentUser });
    };
  }, [id, currentUser?.user_id]);

  const handleSendMessage = (text) => {
    socket.emit(EVENTS.C2S.MESSAGE_SEND, {
      chatId: id,
      text,
    });
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        backgroundColor: (t) => t.palette.background.default,
        overflow: "hidden",
        height: "100dvh",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          backgroundColor: (t) => t.palette.background.default,
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          wrap="nowrap"
          sx={{ px: 1, py: 1 }}
        >
          <IconButton onClick={() => navigate(-1)} aria-label="back">
            <ArrowBackIosIcon style={{ color: "black" }} />
          </IconButton>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 0.25,
            }}
          >
            <Typography variant="h6" noWrap title={title}>
              {title}
            </Typography>
          </Box>

          <IconButton
            onClick={() => navigate(`/route/${id}`)}
            aria-label="info"
          >
            <InfoOutlinedIcon />
          </IconButton>
        </Grid>

        <Divider sx={{ "&::before, &::after": { borderTopWidth: 2 } }} />
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <MessageList items={messages} />
      </Box>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 2,
          backgroundColor: (t) => t.palette.background.default,
          borderTop: (t) => `1px solid ${t.palette.divider}`,
          py: 1,
          px: 1,
        }}
      >
        <MessageInput onSend={handleSendMessage} />
      </Box>
    </Box>
  );
};
