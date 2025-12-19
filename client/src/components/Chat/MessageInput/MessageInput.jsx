import React, { useEffect, useRef, useState } from "react";

import { Box, Paper, IconButton, Tooltip, OutlinedInput } from "@mui/material";
import SendRounded from "@mui/icons-material/SendRounded";

export const MessageInput = ({
  onSend,
  placeholder = "Message",
  disabled = false,
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
    }
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
                color="primary"
                onClick={handleSend}
                disabled={disabled || value.trim().length === 0}
                aria-label="send"
                sx={{
                  m: 0,
                  borderRadius: 0,
                  height: "100%",
                  width: "100%",
                }}
              >
                <SendRounded />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Paper>
    </Box>
  );
};
