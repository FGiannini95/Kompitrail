import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box, Divider, IconButton, Typography, Chip } from "@mui/material";
import Grid from "@mui/material/Grid2";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { MessageList } from "../MessageList/MessageList";
import { MessageInput } from "../MessageInput/MessageInput";
import { socket } from "../../../helpers/chat";

export const ChatRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- connectivity state (small, non-intrusive) ---
  const [connected, setConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);

  useEffect(() => {
    // Handlers
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onPong = (data) => {
      setLastPong(new Date(data?.ts || Date.now()).toLocaleTimeString());
      // console.log("[socket] pong:", data);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("pong", onPong);

    // Fire a minimal connectivity test
    socket.emit("ping", { echo: id });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("pong", onPong);
    };
  }, [id]);

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

          <Typography variant="h6" sx={{ flex: 1, textAlign: "center" }} noWrap>
            Mi chat + nombre ruta
          </Typography>

          {/* Small connection chip (does not alter your layout) */}
          <Chip
            size="small"
            label={connected ? (lastPong ? `OK · ${lastPong}` : "OK") : "OFF"}
            sx={{
              mx: 1,
              bgcolor: connected ? "success.light" : "error.light",
              color: connected ? "success.contrastText" : "error.contrastText",
            }}
          />

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
        <MessageList items={[]} />
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
        <MessageInput
          onSend={(msg) => console.log(`SEND to chat ${id}:`, msg)}
        />
      </Box>
    </Box>
  );
};
