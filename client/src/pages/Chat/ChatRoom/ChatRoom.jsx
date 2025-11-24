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

import CircleIcon from "@mui/icons-material/Circle";

// helper badge
function ConnectedBadge({ connected, rttMs }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <CircleIcon
        sx={{ fontSize: 10, color: connected ? "success.main" : "error.main" }}
      />
      <Typography variant="caption" color="text.secondary">
        {connected
          ? `Connected${rttMs != null ? ` ${rttMs}ms` : ""}`
          : "Offline"}
      </Typography>
    </Box>
  );
}

export const ChatRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser } = useContext(KompitrailContext);

  // STATE
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [rttMs, setRttMs] = useState(null);

  // EFFECT: socket connect/disconnect
  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => {
      setIsConnected(false);
      setRttMs(null);
    };
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // EFFECT: ping/pong every 15s
  useEffect(() => {
    let timer;
    const onPong = (payload) => {
      // payload can be echo of sent ts; if not, just use Date.now()
      const now = Date.now();
      const sent = payload?.ts ? Number(payload.ts) : now;
      setRttMs(Math.max(0, now - sent));
    };

    socket.on(EVENTS.S2C.PONG, onPong);

    const sendPing = () => {
      const ts = Date.now();
      socket.emit(EVENTS.C2S.PING, { ts });
    };

    // send immediately then interval
    sendPing();
    timer = setInterval(sendPing, 15000);

    return () => {
      clearInterval(timer);
      socket.off(EVENTS.S2C.PONG, onPong);
    };
  }, []);

  const title = location.state?.title || "Chat";

  const [messages, setMessages] = useState([]);

  // Listen for new messages
  useEffect(() => {
    const handleNewMessage = (payload) => {
      console.log("📩 Received message:", payload);
      if (payload.chatId !== id) return;

      const msg = payload.message;
      const isSystem = msg.userId === "system";

      const { time_hh_mm } = formatDateTime(msg.createdAt, {
        locale: "es-ES",
        timeZone: "Europe/Madrid",
      });

      setMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          text: msg.text,
          fromMe: !isSystem && msg.userId === currentUser?.user_id,
          at: time_hh_mm,
          createdAt: msg.createdAt,
          isSystem,
        },
      ]);
    };

    socket.on(EVENTS.S2C.MESSAGE_NEW, handleNewMessage);

    return () => {
      socket.off(EVENTS.S2C.MESSAGE_NEW, handleNewMessage);
    };
  }, [id, currentUser]);

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
            <ConnectedBadge connected={isConnected} rttMs={rttMs} />
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
