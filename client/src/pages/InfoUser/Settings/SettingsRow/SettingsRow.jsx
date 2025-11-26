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
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";

const ACTION_CONFIG = {
  changePassword: {
    label: "Modificar contraseña",
    icon: <LockOutlinedIcon fontSize="large" sx={{ color: "black" }} />,
  },
  deleteAccount: {
    label: "Eliminar cuenta",
    icon: <DeleteOutlineIcon fontSize="large" />,
  },
  editAccount: {
    label: "Modificar perfil",
    icon: (
      <PersonOutlineOutlinedIcon fontSize="large" sx={{ color: "black" }} />
    ),
  },
  addMotorbike: {
    label: "Mis motos",
    icon: <TwoWheelerOutlinedIcon fontSize="large" sx={{ color: "black" }} />,
  },
  addRoute: {
    label: "Mis rutas",
    icon: <RouteOutlinedIcon fontSize="large" sx={{ color: "black" }} />,
  },
  changeSettings: {
    label: "Ajustes",
    icon: <SettingsOutlinedIcon fontSize="large" sx={{ color: "black" }} />,
  },
  chatbot: {
    label: "Chat bot",
    icon: <TextsmsOutlinedIcon fontSize="large" sx={{ color: "black" }} />,
  },
  privacy: {
    label: "Política de privacidad",
    icon: <InfoOutlinedIcon fontSize="large" sx={{ color: "black" }} />,
  },
  logout: {
    label: "Log out",
    icon: <LogoutIcon fontSize="large" sx={{ color: "black" }} />,
  },
  language: {
    label: "Idioma",
    icon: <LanguageOutlinedIcon fontSize="large" sx={{ color: "black" }} />,
  },
  theme: {
    label: "Tema",
    icon: <ColorLensOutlinedIcon fontSize="large" sx={{ color: "black" }} />,
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
