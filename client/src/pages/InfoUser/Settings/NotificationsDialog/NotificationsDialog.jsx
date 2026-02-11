import React from "react";
import { useTranslation } from "react-i18next";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";

import { usePushNotifications } from "../../../../hooks/usePushNotifications";

export const NotificationsDialog = ({ open, onClose }) => {
  const { t } = useTranslation(["dialogs", "buttons", "settings"]);
  const { isSubscribed, loading, subscribe } = usePushNotifications();

  const isActive = isSubscribed;
  const notificationTitle = isActive
    ? t("dialogs:notificationTitleDisabled")
    : t("dialogs:notificationTitleEnabled");
  const notificationText = isActive
    ? t("dialogs:notificationTextDisabled")
    : t("dialogs:notificactionTextEnabled");

  const handleToggleNotifications = async () => {
    if (isActive) {
      console.log("Unsubscribe non ancora implementato");
    } else {
      await subscribe();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      disableScrollLock
    >
      <DialogTitle>{notificationTitle}</DialogTitle>
      <DialogContent>
        <Stack
          direction="column"
          alignItems="center"
          spacing={1}
          sx={{ mt: 1 }}
        >
          <Typography variant="body2" color="text.primary">
            {notificationText}
          </Typography>
          <IconButton
            onClick={handleToggleNotifications}
            aria-label="Toggle Notifiche"
            sx={{
              backgroundColor: "action.hover",
              borderRadius: 2,
              padding: 2,
              "&:hover": {
                backgroundColor: "action.selected",
                transform: "scale(1.05)",
              },
            }}
          >
            {isActive ? (
              <NotificationsOffOutlinedIcon
                aria-hidden
                fontSize="large"
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                })}
              />
            ) : (
              <NotificationsActiveOutlinedIcon
                aria-hidden
                fontSize="large"
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                })}
              />
            )}
          </IconButton>
        </Stack>
      </DialogContent>
      <DialogActions>
        {loading ? (
          <CircularProgress sx={{ color: "inherit" }} size={20} />
        ) : (
          <Button onClick={onClose} color="text.primary">
            {t("buttons:close")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
