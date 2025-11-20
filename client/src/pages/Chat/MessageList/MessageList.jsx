// MessageList.jsx
import * as React from "react";

// MessageList.jsx (only a small change: bottom padding so the last bubble is never hidden)
import { useEffect, useRef } from "react";
import { Box, Paper, Typography } from "@mui/material";

/**
 * MessageList
 * ---------------------------------------------
 * Scrollable list of bubbles. Adds bottom padding so the input never overlaps
 * the last message. Auto-scrolls to bottom when items change.
 *
 * Props:
 * - items: Array<{ id: string, text: string, fromMe: boolean, at?: string }>
 */
export const MessageList = ({ items = [] }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [items]);

  return (
    <Box
      ref={scrollRef}
      sx={{
        flex: 1,
        overflow: "auto",
        px: 2,
        pt: 2,
        pb: 10, // keep bottom space so the sticky input never covers content
        display: "flex",
        flexDirection: "column",
        gap: 1,
        backgroundColor: (t) => t.palette.background.default,
      }}
    >
      {items.map((m) => {
        const mine = !!m.fromMe;
        return (
          <Box
            key={m.id}
            sx={{
              display: "flex",
              justifyContent: mine ? "flex-end" : "flex-start",
            }}
          >
            <Paper
              elevation={1}
              sx={{
                maxWidth: "78%",
                px: 1.5,
                py: 1,
                borderRadius: 3,
                bgcolor: (t) =>
                  mine ? t.palette.primary.main : t.palette.background.paper,
                color: (t) =>
                  mine
                    ? t.palette.primary.contrastText
                    : t.palette.text.primary,
              }}
            >
              <Typography variant="body2">{m.text}</Typography>
              {m.at && (
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.75,
                    display: "block",
                    mt: 0.25,
                    textAlign: "right",
                  }}
                >
                  {m.at}
                </Typography>
              )}
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
};
