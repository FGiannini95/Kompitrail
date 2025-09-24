import React from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// MUI-ICONS
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
/**
 * Very small wrapper that renders ONE of two rows based on `type`.
 * type === "password" → "Modificar contraseña" with lock icon.
 * type !== "password" → "Eliminar cuenta" with delete icon.
 * The component also wires the correct onClick handler based on `type`.
 */

export const SettingsRow = ({ type, onPasswordClick, onDeleteClick }) => {
  const isChangePassword = type === "password";
  const label = isChangePassword ? "Modificar contraseña" : "Eliminar cuenta";
  const icon = isChangePassword ? (
    <LockOutlinedIcon fontSize="large" />
  ) : (
    <DeleteOutlineIcon fontSize="large" sx={{ color: "error.main" }} />
  );
  const onClick = isChangePassword ? onPasswordClick : onDeleteClick;

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            sx: { color: !isChangePassword && "error.main" },
          }}
        />
        <ArrowForwardIosIcon
          sx={{ color: !isChangePassword && "error.main" }}
        />
      </ListItemButton>
    </ListItem>
  );
};
