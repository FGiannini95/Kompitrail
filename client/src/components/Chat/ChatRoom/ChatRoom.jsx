import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { Box, Divider, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// Hooks & Providers
import { useChat } from "../../../hooks/useChat";
// Components
import { MessageList } from "../MessageList/MessageList";
import { MessageInput } from "../MessageInput/MessageInput";
import { useMemo } from "react";

export const ChatRoom = ({
  mode = "group",
  chatId: propChatId = null,
  messages: propMessages = null,
  sendMessage: propSendMessage = null,
  isLoading: propIsLoading = null,
  isSending: propIsSending = null,
  title: propTitle = null,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // If chatId not explicitly passed as prop, try to read from route params
  const params = useParams();
  const routeChatId = params?.id || null;
  const chatId = propChatId ?? routeChatId;

  // Fallback: use existing useChat hook only when external props are not provided.
  const chatHook = useMemo(() => {
    return useChat(chatId);
  }, [chatId]);

  // Define final values
  const messages = propMessages ?? chatHook.messages ?? [];
  const sendMessage = propSendMessage ?? chatHook.sendMessage;
  const isLoading = propIsLoading ?? chatHook.isLoading ?? false;
  const isSending = propIsSending ?? false;

  const title =
    propTitle ||
    location.state?.title ||
    (mode === "group" ? "Chat" : "Assistant");

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
            <ArrowBackIosIcon
              aria-hidden
              sx={(theme) => ({
                color: theme.palette.text.primary,
              })}
            />
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
            <Typography variant="h6" color="text.primary" noWrap title={title}>
              {title}
            </Typography>
            {mode === "bot" && (
              <Typography variant="caption" color="text.secondary" noWrap>
                Chat bot
              </Typography>
            )}
          </Box>

          {mode === "group" && (
            <IconButton
              onClick={() => {
                if (chatId) navigate(`/route/${chatId}`);
              }}
              aria-label="info"
            >
              <InfoOutlinedIcon />
            </IconButton>
          )}
          {mode === "bot" && <Box sx={{ width: 48 }} />}
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
        <MessageInput onSend={sendMessage} disabled={isSending || isLoading} />
      </Box>
    </Box>
  );
};
