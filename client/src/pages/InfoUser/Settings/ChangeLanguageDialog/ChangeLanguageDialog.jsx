import React from "react";
import ReactCountryFlag from "react-country-flag";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { OutlinedButton } from "../../../../components/Buttons/OutlinedButton/OutlinedButton";
import { ContainedButton } from "../../../../components/Buttons/ContainedButton/ContainedButton";

// Helper to render the flag with fixed size
export const Flag = React.memo(function Flag({ countryCode }) {
  return (
    <Box
      sx={{
        width: "2rem",
        height: "1.5rem",
        borderRadius: "4px",
        overflow: "hidden",
        mr: 1.5,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ReactCountryFlag
        countryCode={countryCode}
        svg
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </Box>
  );
});

export const ChangeLanguageDialog = ({
  open,
  onClose,
  language,
  changeLanguage,
}) => {
  // Handle language selection
  const handleSelectLanguage = (lang) => {
    if (!["es", "en", "it"].includes(lang)) return;

    // If user selects the same language, just close
    if (lang !== language) {
      changeLanguage(lang);
    }
  };

  // Render a single language option using your custom buttons
  const renderLanguageOption = (label, code, countryCode) => {
    const isSelected = language === code;

    // Shared content: flag + label
    const content = (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 1.5,
          width: "100%",
        }}
      >
        <Flag countryCode={countryCode} />
        <Typography>{label}</Typography>
      </Box>
    );

    if (isSelected) {
      // Selected language -> ContainedButton
      return (
        <ContainedButton key={code} onClick={() => handleSelectLanguage(code)}>
          {content}
        </ContainedButton>
      );
    }

    // Non-selected language -> OutlinedButton
    return (
      <OutlinedButton key={code} onClick={() => handleSelectLanguage(code)}>
        {content}
      </OutlinedButton>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      disableScrollLock
      keepMounted
    >
      <DialogTitle>Cambiar idioma</DialogTitle>

      <DialogContent>
        <Stack sx={{ mt: 1 }} spacing={1}>
          {renderLanguageOption("Español", "es", "ES")}
          {renderLanguageOption("Inglés", "en", "GB")}
          {renderLanguageOption("Italiano", "it", "IT")}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};
