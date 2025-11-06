import React from "react";

import { Box, IconButton, Modal, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

export const FullScreenImg = ({ open, onClose, img, initials }) => {
  const hasImage = Boolean(img);

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

        <Box
          role="img"
          sx={{
            width: "60vmin",
            height: "60vmin",
            maxWidth: 480,
            maxHeight: 480,
            minWidth: 240,
            minHeight: 240,
            borderRadius: "50%",
            border: "4px solid black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            userSelect: "none",
            overflow: "hidden",
            ...(hasImage && {
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }),
          }}
        >
          {!hasImage && (
            <Typography
              variant="h1"
              sx={{
                fontSize: "18vmin",
                lineHeight: 1,
                color: "black",
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {initials}
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};
