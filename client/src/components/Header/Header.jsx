import React from "react";
import { IconButton, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { useSafeBack } from "../../hooks/useSafeBack";

export const Header = ({
  title,
  onShare,
  isCopied,
  tooltipText = "URL copiada",
  fallbackPath = "/",
}) => {
  const handleBack = useSafeBack(fallbackPath);

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      sx={{ px: 1, mb: 1 }}
    >
      <IconButton onClick={handleBack} aria-label="Volver">
        <ArrowBackIosIcon style={{ color: "black" }} />
      </IconButton>
      {title ? <Typography variant="h6">{title}</Typography> : <span />}
      <Tooltip
        title={tooltipText}
        open={isCopied}
        disableInteractive
        arrow
        placement="bottom"
      >
        <IconButton onClick={onShare} aria-label="Share">
          <ShareOutlinedIcon style={{ color: "black" }} />
        </IconButton>
      </Tooltip>
    </Grid>
  );
};
