import React, { useContext, useMemo } from "react";
import { Avatar, Badge, Typography, Stack } from "@mui/material";

import { KompitrailContext } from "../../context/KompitrailContext";
import { getInitials } from "../../helpers/utils";

export const BadgeAvatar = ({
  targetUserId,
  name = "",
  firstName,
  lastName,
  size = 40,
  showName = true,
  badgeContent = "x",
  onBadgeClick,
  showBadge = true,
}) => {
  const { user } = useContext(KompitrailContext);
  const isCurrentUser = user?.user_id !== null && user.user_id === targetUserId;

  const initials = useMemo(() => {
    // Call helper directly with provided props
    return getInitials(firstName, lastName);
  }, [firstName, lastName]);

  const shouldShowBadge = showBadge && isCurrentUser;

  return (
    <Stack alignItems="center" spacing={0.5} sx={{ width: size + 8 }}>
      <Badge
        overlap="circular"
        color="error"
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        badgeContent={
          shouldShowBadge ? (
            <span
              onClick={(e) => {
                if (!onBadgeClick) return;
                e.stopPropagation();
                onBadgeClick();
              }}
            >
              {badgeContent}
            </span>
          ) : null
        }
        sx={{
          "& .MuiBadge-badge": {
            width: 16,
            height: 16,
            minWidth: 16,
            borderRadius: "50%",
          },
        }}
      >
        <Avatar
          // src={user?.photoUrl || undefined}
          sx={{
            width: size,
            height: size,
            fontSize: Math.round(size * 0.35),
            border: "1px solid black",
            color: "black",
            backgroundColor: "transparent",
          }}
        >
          {initials}
        </Avatar>
      </Badge>
      {showName && (
        <Typography
          variant="caption"
          sx={{ lineHeight: 1, textAlign: "center" }}
          title={name}
        >
          {name}
        </Typography>
      )}
    </Stack>
  );
};
