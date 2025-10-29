import React, { useContext, useMemo } from "react";
import { Avatar, Badge, Typography, Stack } from "@mui/material";

import { KompitrailContext } from "../../../context/KompitrailContext";
import { getInitials } from "../../../helpers/utils";
import { useNavigate } from "react-router-dom";
import { RoutesString } from "../../../routes/routes";

export const BadgeAvatar = ({
  targetUserId,
  targetUserImg,
  name = "",
  firstName,
  lastName,
  size = 40,
  showName = true,
  badgeContent = "x",
  onBadgeClick,
  showBadge = true,
  isPastRoute,
}) => {
  const { user } = useContext(KompitrailContext);
  const navigate = useNavigate();
  const isCurrentUser = user?.user_id !== null && user.user_id === targetUserId;

  const initials = useMemo(() => {
    return getInitials(firstName, lastName);
  }, [firstName, lastName]);

  const shouldShowBadge = showBadge && isCurrentUser && !isPastRoute;

  const photoUrl = targetUserImg
    ? `http://localhost:3000/images/users/${targetUserImg}`
    : undefined;

  const handleAvarClick = (e) => {
    e.stopPropagation();
    if (targetUserId) {
      navigate(
        isCurrentUser
          ? RoutesString.profile // Stay in the same page if currentUser = user_id
          : RoutesString.otherProfile.replace(":id", targetUserId)
      );
    }
  };

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
                e.stopPropagation();
                if (onBadgeClick) {
                  onBadgeClick(e);
                }
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
          src={photoUrl || undefined}
          sx={{
            width: size,
            height: size,
            fontSize: Math.round(size * 0.35),
            border: "1px solid black",
            color: "black",
            backgroundColor: "transparent",
          }}
          onClick={handleAvarClick}
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
