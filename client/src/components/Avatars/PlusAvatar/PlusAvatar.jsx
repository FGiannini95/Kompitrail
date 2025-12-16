import React from "react";
import { useTranslation } from "react-i18next";

import { Avatar, IconButton, Stack, Typography } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

export const PlusAvatar = ({ size = 40, onClick, disabled = false }) => {
  const { t } = useTranslation("general");

  return (
    <Stack alignItems="center" spacing={0.5} sx={{ width: size + 8 }}>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled && onClick) {
            onClick(e);
          }
        }}
        disabled={disabled}
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <Avatar
          sx={(theme) => ({
            width: size,
            height: size,
            fontSize: 32,
            border: `1px dashed ${theme.palette.text.primary}`,
            color: disabled
              ? theme.palette.text.disabled
              : theme.palette.text.primary,
            backgroundColor: "transparent",
          })}
        >
          <AddOutlinedIcon fontSize="medium" aria-hidden />
        </Avatar>
        <Typography
          variant="caption"
          sx={(theme) => ({
            lineHeight: 1,
            textAlign: "center",
            color: disabled
              ? theme.palette.text.disabled
              : theme.palette.text.primary,
          })}
        >
          {t("general:plusAvatarText")}
        </Typography>
      </IconButton>
    </Stack>
  );
};
