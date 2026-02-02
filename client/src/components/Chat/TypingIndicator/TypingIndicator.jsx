import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Typography } from "@mui/material";

export const TypingIndicator = ({ typingUsers = [] }) => {
  const { t } = useTranslation(["chat"]);

  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return t("oneUserTyping", { displayName: typingUsers[0].displayName });
    }
    if (typingUsers.length === 2) {
      return t("twoUserTyping", {
        user1: typingUsers[0].displayName,
        user2: typingUsers[1].displayName,
      });
    }
    return t("moreUserTyping", { count: typingUsers.length });
  };

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          fontStyle: "italic",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      >
        {getTypingText()}
      </Typography>
    </Box>
  );
};
