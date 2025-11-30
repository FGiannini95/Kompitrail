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
    icon: (
      <LockOutlinedIcon
        fontSize="large"
        aria-hidden
        sx={(theme) => ({
          color: theme.palette.text.primary,
        })}
      />
    ),
  },
  deleteAccount: {
    label: "Eliminar cuenta",
    icon: <DeleteOutlineIcon fontSize="large" />,
  },
  editAccount: {
    label: "Modificar perfil",
    icon: (
      <PersonOutlineOutlinedIcon
        fontSize="large"
        sx={(theme) => ({
          color: theme.palette.text.primary,
        })}
      />
    ),
  },
  addMotorbike: {
    label: "Mis motos",
    icon: (
      <TwoWheelerOutlinedIcon
        fontSize="large"
        sx={(theme) => ({
          color: theme.palette.text.primary,
        })}
      />
    ),
  },
  addRoute: {
    label: "Mis rutas",
    icon: (
      <RouteOutlinedIcon
        fontSize="large"
        sx={(theme) => ({
          color: theme.palette.text.primary,
        })}
      />
    ),
  },
  changeSettings: {
    label: "Ajustes",
    icon: (
      <SettingsOutlinedIcon
        fontSize="large"
        sx={(theme) => ({
          color: theme.palette.text.primary,
        })}
      />
    ),
  },
  chatbot: {
    label: "Chat bot",
    icon: (
      <TextsmsOutlinedIcon
        fontSize="large"
        sx={(theme) => ({
          color: theme.palette.text.primary,
        })}
      />
    ),
  },
  privacy: {
    label: "Política de privacidad",
    icon: (
      <InfoOutlinedIcon
        fontSize="large"
        sx={(theme) => ({
          color: theme.palette.text.primary,
        })}
      />
    ),
  },
  logout: {
    label: "Log out",
    icon: (
      <LogoutIcon
        fontSize="large"
        sx={(theme) => ({
          color: theme.palette.text.primary,
        })}
      />
    ),
  },
  language: {
    label: "Idioma",
    icon: (
      <LanguageOutlinedIcon
        fontSize="large"
        sx={(theme) => ({
          color: theme.palette.text.primary,
        })}
      />
    ),
  },
  theme: {
    label: "Tema",
    icon: (
      <ColorLensOutlinedIcon
        fontSize="large"
        sx={(theme) => ({
          color: theme.palette.text.primary,
        })}
      />
    ),
  },
};

export const SettingsRow = ({ action, onClick }) => {
  const config = ACTION_CONFIG[action];
  if (!config) throw new Error(`Action desconocida: ${action}`);
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemIcon
          sx={(theme) => ({
            color:
              action === "deleteAccount"
                ? theme.palette.error.main
                : theme.palette.text.primary,
          })}
        >
          {config.icon}
        </ListItemIcon>
        <ListItemText
          primary={config.label}
          sx={(theme) => ({
            color:
              action === "deleteAccount"
                ? theme.palette.error.main
                : theme.palette.text.primary,
          })}
        />
        <ArrowForwardIosIcon
          sx={(theme) => ({
            color:
              action === "deleteAccount"
                ? theme.palette.error.main
                : theme.palette.text.primary,
          })}
        />
      </ListItemButton>
    </ListItem>
  );
};
