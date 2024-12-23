import React from "react";

// MUI
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

// MUI-ICONS
import CloseIcon from "@mui/icons-material/Close";

export const FullScreenImg = ({ open, onClose, img }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="motorbike-image-modal"
    >
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          boxShadow: 24,
          p: 2,
          maxWidth: "95%",
          maxHeight: "95%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "black",
          }}
        >
          <CloseIcon />
        </IconButton>
        <img
          src={img}
          alt="Motorbike"
          style={{
            maxWidth: "90vw",
            maxHeight: "90vh",
            width: "auto",
            height: "auto",
            borderRadius: "5px",
          }}
        />
      </Box>
    </Modal>
  );
};
