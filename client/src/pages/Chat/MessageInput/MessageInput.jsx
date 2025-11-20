import * as React from "react";
// MessageInput.jsx
// MessageInput.jsx
import { useEffect, useRef, useState } from "react";
import { Box, Paper, IconButton, Tooltip, OutlinedInput } from "@mui/material";
import SendRounded from "@mui/icons-material/SendRounded";

/**
 * MessageInput
 * ---------------------------------------------
 * Bottom-fixed composer. The right action column fills the component height,
 * making the send button a large, easy touch target.
 *
 * Requirements covered:
 * - Always stays at the bottom (sticky inside a 100dvh flex column container).
 * - Does not create page scroll; only the message list scrolls.
 * - Send icon on the right, occupying the full available height.
 *
 * Props:
 * - onSend: (text: string) => void
 * - placeholder?: string
 * - disabled?: boolean
 */
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

  // Send helper
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
          alignItems: "stretch", // let the right column fill height
        }}
      >
        {/* Text area (flex:1) */}
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

        {/* Right action column (full height, big touch target) */}
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
                // Full-height / full-width button
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
