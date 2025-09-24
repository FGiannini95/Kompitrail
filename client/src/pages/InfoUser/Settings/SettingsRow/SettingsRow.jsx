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
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

const ACTION_CONFIG = {
  changePassword: {
    label: "Modificar contraseña",
    icon: <LockOutlinedIcon fontSize="large" />,
  },
  deleteAccount: {
    label: "Eliminar cuenta",
    icon: <DeleteOutlineIcon fontSize="large" />,
  },
  editAccount: {
    label: "Modificar perfil",
    icon: <PersonOutlineOutlinedIcon fontSize="large" />,
  },
  addMotorbike: {
    label: "Mis motos",
    icon: <TwoWheelerOutlinedIcon fontSize="large" />,
  },
  addRoute: {
    label: "Mis rutas",
    icon: <RouteOutlinedIcon fontSize="large" />,
  },
  changeSetting: {
    label: "Ajustes",
    icon: <SettingsOutlinedIcon fontSize="large" />,
  },
  chatbot: {
    label: "Chat bot",
    icon: <TextsmsOutlinedIcon fontSize="large" />,
  },
  privacy: {
    label: "Política de privacidad",
    icon: <InfoOutlinedIcon fontSize="large" />,
  },
  logout: {
    label: "Log out",
    icon: <LogoutIcon fontSize="large" />,
  },
};

export const SettingsRow = ({ action, onClick }) => {
  const config = ACTION_CONFIG[action];
  if (!config) throw new Error(`Action desconocida: ${action}`);
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemIcon
          sx={{ color: action === "deleteAccount" && "error.main" }}
        >
          {config.icon}
        </ListItemIcon>
        <ListItemText
          primary={config.label}
          sx={{ color: action === "deleteAccount" && "error.main" }}
        />
        <ArrowForwardIosIcon
          sx={{ color: action === "deleteAccount" && "error.main" }}
        />
      </ListItemButton>
    </ListItem>
  );
};
