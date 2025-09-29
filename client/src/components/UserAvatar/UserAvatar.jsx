import React, { useContext } from "react";
import { Stack, Typography, Avatar } from "@mui/material";
import { capitalizeFullName, getInitials } from "../../helpers/utils";
import { KompitrailContext } from "../../context/KompitrailContext";

export const UserAvatar = () => {
  const { user } = useContext(KompitrailContext);
  const initials = getInitials(user.name, user.lastname);

  return (
    <Stack alignItems="center" spacing={1}>
      <Avatar
        sx={{
          width: 96,
          height: 96,
          fontSize: 32,
          border: "2px solid black",
          color: "black",
          backgroundColor: "transparent",
        }}
      >
        {initials}
      </Avatar>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        {capitalizeFullName(user.name, user.lastname)}
      </Typography>
    </Stack>
  );
};
