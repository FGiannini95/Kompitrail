import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  ListItemAvatar,
  ListItemButton,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

// Comportamento atteso
/**
 * Per l'avatar uso sempre import ExploreOutlinedIcon from '@material-ui/icons/ExploreOutlined';
 * Il titolo, quello che adesso sarebbe il nome, deve essere punto di partenza - punto di arrivo
 * Sotto più in piccolo si deve vedere data e ora tipo Martedì 22 Novembre allle 10.45
 * ultimo messaggio (sia che sia di un user si a che sia di sistema) e alla destra del tutto la data dell'iltimo msg o l'ora se è dello stesso giorno
 */

export const Chat = ({ avatarSrc = "", subtitle = "Last message…" }) => {
  const navigate = useNavigate();

  const rows = [
    { id: "1", name: "Matilde", date: "28/10/2024", avatarSrc },
    { id: "2", name: "Victoria", date: "22/07/1994", avatarSrc },
    { id: "3", name: "Federico", date: "01/11/1995", avatarSrc },
  ];

  return (
    <Box
      sx={{
        height: "100dvh",
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {rows.map((c) => (
        <ListItem
          key={c.id}
          sx={{ border: "2px solid #eeeeee", borderRadius: 2, p: 0 }}
          disableGutters
          secondaryAction={
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "nowrap", px: 1 }}
            >
              {c.date}
            </Typography>
          }
        >
          <ListItemButton
            sx={{ borderRadius: 2, py: 1 }}
            onClick={() => navigate(`/chat/${c.id}`)}
          >
            <ListItemAvatar>
              <Avatar src={c.avatarSrc} alt={c.name} />
            </ListItemAvatar>
            <ListItemText
              primary={c.name}
              secondary={subtitle}
              primaryTypographyProps={{ noWrap: true }}
              secondaryTypographyProps={{
                noWrap: true,
                color: "text.secondary",
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </Box>
  );
};
