import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";

import { KompitrailContext } from "../../../context/KompitrailContext";
import { usePwaPrompt } from "../../../hooks/usePwaPrompt";
import { usePwa } from "../../../context/PwaContext/PwaContext";

export const DialogPwa = ({ open, onClose }) => {
  const { t } = useTranslation(["dialogs", "buttons"]);
  const { user } = useContext(KompitrailContext);
  const { isInstallable } = usePwa();

  // We consider the user authenticated cause Home is only rendered when token && user are present
  const isAuthenticated = Boolean(user);
  const { IsPwaDialogOpen, handleAccept, handleDismiss } =
    usePwaPrompt(isAuthenticated);

  // Detect iOS device
  const isIos =
    typeof window != "undefined" &&
    /iphone|ipad|ipod/i.test(window.navigator.userAgent || "");

  // On iOS there is no beforeinstallprompt, so isInstallable will be false.
  // In that case we show instructions instead of trying to trigger the native prompt.
  const isIosInstructionFlow = isIos && !isInstallable;

  const isDialogOpen = open ?? IsPwaDialogOpen;
  const handleClose = onClose ?? handleDismiss;

  if (!isAuthenticated) {
    return null;
  }

  const handleConfirm = async () => {
    if (!isInstallable) {
      if (onClose) {
        onClose();
      } else {
        handleDismiss();
      }
      return;
    }

    const result = await handleAccept();

    if (onClose) {
      onClose();
    }

    return result;
  };

  return (
    <Dialog open={isDialogOpen} onClose={handleClose}>
      <DialogTitle>
        {isIosInstructionFlow
          ? t("dialogs:pwaTitleIos")
          : t("dialogs:pwaTitle")}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {isIosInstructionFlow ? (
            <Box component="span">
              {t("dialogs:pwaTextIosFirst")}
              <IosShareOutlinedIcon
                sx={{
                  verticalAlign: "top",
                  fontSize: "1.2em",
                  mx: 0.5,
                }}
              />
              {t("dialogs:pwaTextIosSecond")}
            </Box>
          ) : (
            t("dialogs:pwaText")
          )}
        </Typography>
      </DialogContent>

      <DialogActions>
        {isIosInstructionFlow ? (
          <Button onClick={handleClose} color="error">
            {t("buttons:close")}
          </Button>
        ) : (
          <>
            <Button onClick={handleClose} color="error">
              {t("buttons:cancel")}
            </Button>
            <Button onClick={handleConfirm} color="success">
              {t("buttons:confirmar")}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
