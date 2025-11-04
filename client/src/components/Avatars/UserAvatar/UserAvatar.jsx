import React, { useContext, useMemo, useState } from "react";
import { Stack, Typography, Avatar, Box } from "@mui/material";
import { getInitials } from "../../../helpers/utils";
import { KompitrailContext } from "../../../context/KompitrailContext";
import { FullScreenImg } from "../../FullScreenImg/FullScreenImg";
import { API_BASE } from "../../../../../server/config/serverConfig";

export const UserAvatar = () => {
  const { user } = useContext(KompitrailContext);
  const initials = useMemo(
    () => getInitials(user?.name ?? "", user?.lastname ?? ""),
    [user?.name, user?.lastname]
  );
  const fullName = `${user.name ?? ""} ${user.lastname ?? ""}`.trim();

  const photoUrl = user?.img ? `${API_BASE}/images/users/${user.img}` : null;

  const [openImg, setOpenImg] = useState(false);
  const handleOpenImg = () => setOpenImg(true);
  const handleCloseImg = () => setOpenImg(false);

  return (
    <>
      <Stack alignItems="center" spacing={1} sx={{ mx: "auto" }}>
        <Avatar
          src={photoUrl || undefined}
          sx={{
            width: 96,
            height: 96,
            fontSize: 32,
            border: "2px solid black",
            color: "black",
            backgroundColor: "transparent",
          }}
          onClick={handleOpenImg}
        >
          {!photoUrl && initials}
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
      {photoUrl && (
        <FullScreenImg open={openImg} onClose={handleCloseImg} img={photoUrl} />
      )}
    </>
  );
};
