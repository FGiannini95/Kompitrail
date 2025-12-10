import React from "react";
import { useTranslation } from "react-i18next";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export const ModeToggleDialog = ({ open, onClose, onToggle, currentMode }) => {
  const isDark = currentMode === "dark";
  const themeLabel = isDark ? "Modo oscuro" : "Modo claro";
  const { t } = useTranslation(["dialogs", "buttons"]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      disableScrollLock
    >
      <DialogTitle>{t("dialogs:modeChangeTitle")}</DialogTitle>
      <DialogContent>
        <Stack
          direction="column"
          alignItems="center"
          spacing={1}
          sx={{ mt: 1 }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={isDark}
                onChange={onToggle}
                color="text.primary"
                icon={
                  <LightModeIcon
                    sx={{
                      color: "#FFC400",
                    }}
                  />
                }
                checkedIcon={<DarkModeIcon />}
                sx={{
                  // Make the switch visually bigger
                  transform: "scale(1.3)",
                }}
              />
            }
            label=""
          />
          <Typography variant="body2" color="text.primary">
            {themeLabel}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="text.primary">
          {t("buttons:close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
