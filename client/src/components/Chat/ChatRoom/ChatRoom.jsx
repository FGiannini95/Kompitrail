import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Box, Divider, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { RoutesString } from "../../../routes/routes";
// Components
import { MessageList } from "../MessageList/MessageList";
import { MessageInput } from "../MessageInput/MessageInput";
import { TypingIndicator } from "../TypingIndicator/TypingIndicator";
import { useKeyboardHeight } from "../../../hooks/useKeyboardHeight";

export const ChatRoom = ({
  mode = "group",
  chatId = null,
  messages = [],
  sendMessage,
  isLoading = false,
  isSending = false,
  title: propTitle = null,
  typingUsers = [],
  onTypingStart,
  onTypingStop,
  isPastRoute = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { messagesBoxRef, keyboardHeight } = useKeyboardHeight();

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
        height: `calc(100dvh - ${keyboardHeight}px)`,
        maxHeight: `calc(100dvh - ${keyboardHeight}px)`,
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          backgroundColor: (t) => t.palette.kompitrail.card,
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          wrap="nowrap"
          sx={{ px: 1, py: 1 }}
        >
          <IconButton
            onClick={() => navigate(RoutesString.infouser)}
            aria-label="back"
          >
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
        ref={messagesBoxRef}
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden auto",
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
          marginBottom: 1,
        }}
      >
        <MessageList items={messages} />
      </Box>
      {!isPastRoute && (
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            zIndex: 2,
            backgroundColor: (t) => t.palette.background.default,
            borderTop: (t) => `1px solid ${t.palette.divider}`,
            paddingBottom: "env(safe-area-inset-bottom, 16px)",
            py: 1,
            px: 1,
          }}
        >
          <TypingIndicator typingUsers={typingUsers} />
          <MessageInput
            onSend={sendMessage}
            disabled={isSending || isLoading}
            onTypingStart={onTypingStart}
            onTypingStop={onTypingStop}
          />
        </Box>
      )}
    </Box>
  );
};
