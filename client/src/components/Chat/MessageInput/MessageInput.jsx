import React, { useEffect, useRef, useState } from "react";

import { Box, Paper, IconButton, Tooltip, OutlinedInput } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

export const MessageInput = ({
  onSend,
  placeholder = "Message",
  disabled = false,
  onTypingStart,
  onTypingStop,
}) => {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend?.(text);
    setValue("");
    inputRef.current?.focus();
  };

  // Enter = send; Shift+Enter = newline
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key !== "Enter") {
      onTypingStart?.();
    }
  };

  const handleBlur = () => {
    onTypingStop?.();
  };

  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        backgroundColor: (t) => t.palette.background.default,
        pb: "env(safe-area-inset-bottom)",
        pt: 1,
        px: 1,
        zIndex: 3,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <OutlinedInput
          inputRef={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          multiline
          minRows={1}
          maxRows={6}
          sx={{
            flex: 1,
            px: 1.25,
            py: 0.75,
            alignItems: "flex-end",
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          }}
        />

        <Box
          sx={{
            width: 56,
            borderLeft: (t) => `1px solid ${t.palette.divider}`,
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <Tooltip title="Send">
            <span style={{ flex: 1 }}>
              <IconButton
                onClick={handleSend}
                disabled={disabled || value.trim().length === 0}
                aria-label="send"
                sx={{
                  color: (t) => t.palette.text.primary,
                  m: 0,
                  borderRadius: 0,
                  height: "100%",
                  width: "100%",
                }}
              >
                <SendOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Paper>
    </Box>
  );
};
