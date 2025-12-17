import React, { useMemo } from "react";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

export const RouteActionButton = ({
  isPastRoute,
  isEnrollmentClosed,
  isOwner,
  isCurrentUserEnrolled,
  isRouteFull,
  onDeleteRoute,
  onJoinRoute,
  onCancelEnrollment,
}) => {
  const { t } = useTranslation(["buttons"]);

  const buttonConfig = useMemo(() => {
    // Rute is finished
    if (isPastRoute) {
      return {
        text: t("buttons:pastRoute"),
        onClick: undefined,
        danger: false,
        disabled: true,
        show: true,
      };
    }

    // Enrollment closed but route still in progress
    if (isEnrollmentClosed) {
      return {
        text: t("buttons:enrollmentClosed"),
        onClick: undefined,
        danger: false,
        disabled: true,
        show: true,
      };
    }

    // Owner can delete the route
    if (isOwner) {
      return {
        text: t("buttons:deleteRoute"),
        onClick: onDeleteRoute,
        danger: true,
        disabled: false,
        show: true,
      };
    }

    // Participant can cancel enrollment
    if (isCurrentUserEnrolled) {
      return {
        text: t("buttons:cancelEnrollment"),
        onClick: onCancelEnrollment,
        danger: true,
        disabled: false,
        show: true,
      };
    }

    // Non-owner, not enrolled, route not full -> can join
    if (!isRouteFull && !isOwner && !isCurrentUserEnrolled) {
      return {
        text: t("buttons:joinRoute"),
        onClick: onJoinRoute,
        danger: false,
        disabled: false,
        show: true,
      };
    }

    // Route full and user not enrolled
    if (isRouteFull && !isOwner && !isCurrentUserEnrolled) {
      return {
        text: t("buttons:fullRoute"),
        danger: false,
        disabled: true,
        show: true,
      };
    }
  }, [
    isOwner,
    isCurrentUserEnrolled,
    isRouteFull,
    isPastRoute,
    isEnrollmentClosed,
    onDeleteRoute,
    onJoinRoute,
    onCancelEnrollment,
    t,
  ]);
  return (
    <Button
      type="button"
      variant="outlined"
      fullWidth
      disabled={buttonConfig.disabled}
      onClick={
        buttonConfig.disabled || !buttonConfig.onClick
          ? undefined
          : buttonConfig.onClick
      }
      sx={(theme) => ({
        color: buttonConfig.danger
          ? theme.palette.error.main
          : theme.palette.text.primary,
        borderColor: buttonConfig.danger
          ? theme.palette.error.main
          : theme.palette.kompitrail.card,
        borderWidth: buttonConfig.danger ? "1px" : "2px",
      })}
    >
      {buttonConfig.text}
    </Button>
  );
};
