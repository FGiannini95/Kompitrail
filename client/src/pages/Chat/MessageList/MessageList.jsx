import React, { useEffect, useRef } from "react";
import { Box, Paper, Typography, Divider } from "@mui/material";
import { formatDateTime } from "../../../helpers/utils";

const formatDateDivider = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();

  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return "Hoy";
  } else {
    // Formato: "21 nov" o "24 sept"
    const day = date.getDate();
    const month = date.toLocaleDateString("es-ES", { month: "short" });
    return `${day} ${month}`;
  }
};

const groupMessagesByDate = (messages) => {
  const groups = [];
  let currentDate = null;

  messages.forEach((msg) => {
    const msgDate = new Date(msg.createdAt).toDateString();

    if (msgDate !== currentDate) {
      currentDate = msgDate;
      groups.push({
        type: "date-divider",
        date: msg.createdAt,
        id: `divider-${msgDate}`,
      });
    }

    groups.push(msg);
  });

  return groups;
};

export const MessageList = ({ items = [] }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [items]);

  const groupedItems = groupMessagesByDate(items);

  return (
    <Box
      ref={scrollRef}
      sx={{
        flex: 1,
        overflow: "auto",
        px: 2,
        pt: 2,
        pb: 10,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        backgroundColor: (t) => t.palette.background.default,
      }}
    >
      {groupedItems.map((item) => {
        // Date divider
        if (item.type === "date-divider") {
          return (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                alignItems: "center",
                my: 0.5,
              }}
            >
              <Divider sx={{ flex: 1 }} />
              <Typography
                variant="caption"
                sx={(theme) => ({
                  px: 2,
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                })}
              >
                {formatDateDivider(item.date)}
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>
          );
        }

        // System message
        if (item.isSystem) {
          return (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                justifyContent: "center",
                my: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={(theme) => ({
                  px: 2,
                  py: 0.5,
                  bgcolor: theme.palette.action.hover,
                  borderRadius: 2,
                  color: theme.palette.text.secondary,
                })}
              >
                {item.text}
              </Typography>
            </Box>
          );
        }

        // Regular message
        const mine = !!item.fromMe;
        return (
          <Box
            key={item.id}
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
              <Typography variant="body2">{item.text}</Typography>
              {item.at && (
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.75,
                    display: "block",
                    mt: 0.25,
                    textAlign: "right",
                  }}
                >
                  {item.at}
                </Typography>
              )}
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
};
