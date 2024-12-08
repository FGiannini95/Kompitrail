import React from "react";

// MUI
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";

// MUI-ICONS
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export const FullScreenImg = ({ openImg, handleCloseImg, imgSelected }) => {
  // If it isn't open, we don't display anything
  if (!openImg) return null;

  return (
    // We use Backdrop in order to generate the overlay, it is a MUI property
    <Backdrop
      open={open}
      onClick={handleCloseImg}
      sx={{
        zIndex: 1300,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
      }}
    >
      <Box
        // Prevent the closure of the img for any random click
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          maxWidth: "1200px",
          maxHeight: "95vh",
          borderRadius: "12px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
        }}
      >
        <IconButton
          onClick={handleCloseImg}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        {/* Full screen img */}
        <Box
          component="img"
          src={imgSelected}
          alt="Full Screen img"
          sx={{
            maxWidth: "100%",
            maxHeight: "100%",
            borderRadius: "20px",
            objectFit: "contain", // In order to mantain the proportions
          }}
        />
      </Box>
    </Backdrop>
  );
};
