import React from "react";
import { useTranslation } from "react-i18next";

import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export const PrivacyDialog = ({ openIframe, handleCloseIframe, iframeUrl }) => {
  const { t } = useTranslation("settings");

  return (
    <Dialog open={openIframe} onClose={handleCloseIframe} fullWidth>
      <DialogTitle>
        {t("settings:actions.privacy")}
        <IconButton
          aria-label="close"
          onClick={handleCloseIframe}
          style={{
            position: "absolute",
            right: 8,
            top: 12,
          }}
        >
          <CloseOutlinedIcon
            aria-hidden
            sx={(theme) => ({
              color: theme.palette.text.primary,
            })}
          />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ padding: 0 }}>
        <iframe
          src={iframeUrl}
          style={{
            width: "100%",
            height: "70vh",
            border: "none",
            borderRadius: "20px",
          }}
          title={t("settings:actions.privacy")}
        />
      </DialogContent>
    </Dialog>
  );
};
