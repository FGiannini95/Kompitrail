import React, { useContext, useMemo } from "react";
import { Stack, Typography, Avatar, Box } from "@mui/material";
import { getInitials } from "../../../helpers/utils";
import { KompitrailContext } from "../../../context/KompitrailContext";

export const UserAvatar = () => {
  const { user } = useContext(KompitrailContext);
  const initials = useMemo(
    () => getInitials(user?.name ?? "", user?.lastname ?? ""),
    [user?.name, user?.lastname]
  );
  const fullName = `${user.name ?? ""} ${user.lastname ?? ""}`.trim();

  return (
    <Stack alignItems="center" spacing={1} sx={{ mx: "auto" }}>
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
      <Box
        sx={{ width: "100%", maxWidth: 360, mx: "auto", textAlign: "center" }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {fullName}
        </Typography>
      </Box>
    </Stack>
  );
};
