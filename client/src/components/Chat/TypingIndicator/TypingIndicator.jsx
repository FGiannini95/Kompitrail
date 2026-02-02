import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Typography } from "@mui/material";

export const TypingIndicator = ({ typingUsers = [] }) => {
  const { t } = useTranslation(["general"]);

  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].displayName} sta scrivendo...`;
    }
    if (typingUsers.length === 2) {
      return `${typingUsers[0].displayName} e ${typingUsers[1].displayName} stanno scrivendo...`;
    }
    return `${typingUsers.length} persone stanno scrivendo...`;
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
