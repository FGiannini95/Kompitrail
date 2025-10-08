import * as React from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from "@mui/material";

/** Renders a single chat row: Avatar | Name (+optional subtitle) | Date (right aligned) */
export function Chat({ name, date, avatarSrc, subtitle }) {
  return (
    <>
      <ListItem
        sx={{ border: "2px solid #eeeeee", borderRadius: 2, padding: 1 }}
        disableGutters
        // MUI puts this at the far right and keeps the left content flexible
        secondaryAction={
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ whiteSpace: "nowrap", px: 1 }}
          >
            {"28/10/2024"}
          </Typography>
        }
      >
        {/* Avatar on the left */}
        <ListItemAvatar>
          <Avatar src={avatarSrc} alt={name} />
        </ListItemAvatar>

        {/* Name (primary) + optional subtitle (secondary). Both truncated to one line */}
        <ListItemText
          primary={"Matilde"}
          secondary={subtitle}
          primaryTypographyProps={{ noWrap: true }}
          secondaryTypographyProps={{ noWrap: true, color: "text.secondary" }}
        />
      </ListItem>

      <ListItem
        sx={{ border: "2px solid #eeeeee", borderRadius: 2, padding: 1 }}
        disableGutters
        // MUI puts this at the far right and keeps the left content flexible
        secondaryAction={
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ whiteSpace: "nowrap", px: 1 }}
          >
            {"22/07/1994"}
          </Typography>
        }
      >
        {/* Avatar on the left */}
        <ListItemAvatar>
          <Avatar src={avatarSrc} alt={name} />
        </ListItemAvatar>

        {/* Name (primary) + optional subtitle (secondary). Both truncated to one line */}
        <ListItemText
          primary={"Victoria"}
          secondary={subtitle}
          primaryTypographyProps={{ noWrap: true }}
          secondaryTypographyProps={{ noWrap: true, color: "text.secondary" }}
        />
      </ListItem>

      <ListItem
        sx={{ border: "2px solid #eeeeee", borderRadius: 2, padding: 1 }}
        disableGutters
        // MUI puts this at the far right and keeps the left content flexible
        secondaryAction={
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ whiteSpace: "nowrap", px: 1 }}
          >
            {"01/11/1995"}
          </Typography>
        }
      >
        {/* Avatar on the left */}
        <ListItemAvatar>
          <Avatar src={avatarSrc} alt={name} />
        </ListItemAvatar>

        {/* Name (primary) + optional subtitle (secondary). Both truncated to one line */}
        <ListItemText
          primary={"Federico"}
          secondary={subtitle}
          primaryTypographyProps={{ noWrap: true }}
          secondaryTypographyProps={{ noWrap: true, color: "text.secondary" }}
        />
      </ListItem>
    </>
  );
}
