import React from "react";
import { Avatar, IconButton, Stack, Typography } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

export const PlusAvatar = ({ size = 40, onClick }) => {
  return (
    <Stack alignItems="center" spacing={0.5} sx={{ width: size + 8 }}>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <Avatar
          // src={user?.photoUrl || undefined}
          sx={{
            width: size,
            height: size,
            fontSize: 32,
            border: "1px dashed black",
            color: "black",
            backgroundColor: "transparent",
          }}
        >
          <AddOutlinedIcon fontSize="medium" aria-hidden />
        </Avatar>
        <Typography
          variant="caption"
          sx={{ lineHeight: 1, textAlign: "center" }}
        >
          Únete
        </Typography>
      </IconButton>
    </Stack>
  );
};
