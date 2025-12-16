import React from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Box, Card, CardContent, Typography } from "@mui/material";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
// Utils
import { RoutesString } from "../../routes/routes";

export const EmptyState = () => {
  const location = useLocation();
  const { t } = useTranslation("emptyState");

  const message =
    location.pathname === RoutesString.motorbike
      ? t("emptyStateNoMotorbike")
      : location.pathname === RoutesString.route
        ? t("emptyStateNoRoute")
        : location.pathname === RoutesString.chat
          ? t("emptyStateNoChat")
          : t("emptyState");

  return (
    <Card
      sx={(theme) => ({
        width: "100%",
        backgroundColor: theme.palette.kompitrail.card,
        borderRadius: "20px",
        p: 3,
        textAlign: "center",
      })}
    >
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <ErrorOutlineIcon sx={{ fontSize: 100 }} />
          <Typography variant="body2">{message}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
