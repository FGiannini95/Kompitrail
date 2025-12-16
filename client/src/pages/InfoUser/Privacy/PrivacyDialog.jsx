import React from "react";

// MUI
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

// MUI-ICONS
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export const PrivacyDialog = ({ openIframe, handleCloseIframe, iframeUrl }) => {
  return (
    <Dialog open={openIframe} onClose={handleCloseIframe} fullWidth>
      <DialogTitle>
        Política de Privacidad
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
          title="Política de Privacidad"
        />
      </DialogContent>
    </Dialog>
  );
};
