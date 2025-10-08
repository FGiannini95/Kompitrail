import React, { useContext, useMemo } from "react";
import { Stack, Typography, Avatar } from "@mui/material";
import { getInitials } from "../../helpers/utils";
import { KompitrailContext } from "../../context/KompitrailContext";

export const UserAvatar = () => {
  const { user } = useContext(KompitrailContext);
  const initials = useMemo(
    () => getInitials(user?.name ?? "", user?.lastname ?? ""),
    [user?.name, user?.lastname]
  );
  const fullName = `${user.name ?? ""} ${user.lastname ?? ""}`.trim();

  return (
    <Stack alignItems="center" spacing={1}>
      <Avatar
        // src={user?.photoUrl || undefined}
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
        {fullName}
      </Typography>
    </Stack>
  );
};
