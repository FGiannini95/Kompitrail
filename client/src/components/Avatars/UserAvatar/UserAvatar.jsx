import React, { useContext, useMemo, useState } from "react";

import { Stack, Typography, Avatar, Box } from "@mui/material";

import { KompitrailContext } from "../../../context/KompitrailContext";
import { getInitials } from "../../../helpers/utils";
import { normalizeImg } from "../../../helpers/normalizeImg";
import { FullScreenImg } from "../../FullScreenImg/FullScreenImg";

export const UserAvatar = ({ user: userProp }) => {
  const { user: ctxUser } = useContext(KompitrailContext);
  // Choose the user coming from props if present; otherwise use context.
  const user = userProp ?? ctxUser;

  const initials = useMemo(
    () => getInitials(user?.name ?? "", user?.lastname ?? ""),
    [user?.name, user?.lastname]
  );
  const fullName = `${user?.name ?? ""} ${user?.lastname ?? ""}`.trim();

  const photoUrl = useMemo(() => normalizeImg(user?.img), [user?.img]);

  const [openImg, setOpenImg] = useState(false);
  const handleOpenImg = () => setOpenImg(true);
  const handleCloseImg = () => setOpenImg(false);

  return (
    <>
      <Stack alignItems="center" spacing={1} sx={{ mx: "auto" }}>
        <Avatar
          src={photoUrl || undefined}
          imgProps={{ referrerPolicy: "no-referrer" }}
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
      <FullScreenImg
        open={openImg}
        onClose={handleCloseImg}
        img={photoUrl}
        initials={initials}
      />
    </>
  );
};
