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
        <ArrowBackIosIcon
          aria-hidden
          sx={(theme) => ({
            color: theme.palette.text.primary,
          })}
        />
      </IconButton>
      {title ? (
        <Typography variant="h6" color="text.primary">
          {title}
        </Typography>
      ) : (
        <span />
      )}
      <Tooltip
        title={tooltipText}
        open={isCopied}
        disableInteractive
        arrow
        placement="bottom"
      >
        <IconButton onClick={onShare} aria-label="Share">
          <ShareOutlinedIcon
            aria-hidden
            sx={(theme) => ({
              color: theme.palette.text.primary,
            })}
          />
        </IconButton>
      </Tooltip>
    </Grid>
  );
};
