import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Avatar,
  Box,
  IconButton,
  ListItemAvatar,
  ListItemButton,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

// Utils
import { CHAT_URL } from "../../api";
import { formatDateTime } from "../../helpers/utils";
// Providers & Hooks
import { KompitrailContext } from "../../context/KompitrailContext";
// Componets
import { Loading } from "../../components/Loading/Loading";
import { EmptyState } from "../../components/EmptyState/EmptyState";

//  If today, return HH:MM, otherwise DD/MM/YYYY
const formatChatTimestamp = (activityAt) => {
  if (!activityAt) return "";

  const { date_dd_mm_yyyy, time_hh_mm, isValid } = formatDateTime(activityAt, {
    locale: "es-ES",
    timeZone: "Europe/Madrid",
  });

  if (!isValid) return "";

  const today = new Date();
  const todayInfo = formatDateTime(today, {
    locale: "es-ES",
    timeZone: "Europe/Madrid",
  });

  if (todayInfo.date_dd_mm_yyyy === date_dd_mm_yyyy) {
    return time_hh_mm;
  }

  return date_dd_mm_yyyy;
};

// Return Tuesday 22/11/2024 at 10:45
const formatChatSubtitle = (activityAt) => {
  const { date_dd_mm_yyyy, time_hh_mm, weekday, isValid } = formatDateTime(
    activityAt,
    { locale: "es-ES", timeZone: "Europe/Madrid" }
  );

  if (!isValid) return "";

  const weekdayCap = weekday
    ? weekday.charAt(0).toUpperCase() + weekday.slice(1)
    : "";

  return `${weekdayCap} ${date_dd_mm_yyyy} a las ${time_hh_mm}`;
};

export const Chat = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(KompitrailContext);

  useEffect(() => {
    let cancelled = false;

    const fetchRooms = async () => {
      try {
        setLoading(true);

        const uid = currentUser?.user_id;
        if (!uid) {
          if (!cancelled) {
            console.warn("[Chat] No user_id yet — skipping fetch");
            setRooms([]);
            setLoading(false);
          }
          return;
        }

        // We get all chats for just one user
        const { data } = await axios.get(`${CHAT_URL}/rooms`, {
          params: { user_id: uid },
          withCredentials: true,
        });

        if (!cancelled) {
          setRooms(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load chat rooms:", err);
          setRooms([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRooms();
    return () => {
      cancelled = true;
    };
  }, [currentUser?.user_id]);
  const ordered = useMemo(() => rooms.slice(), [rooms]);

  console.log("[Chat] CHAT_URL =", CHAT_URL);

  if (loading) return <Loading />;
  if (!ordered.length)
    return (
      <Grid container alignItems="center">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
        <EmptyState />
      </Grid>
    );

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
      {ordered.map((row) => {
        const title = `${row.starting_point} - ${row.ending_point}`;
        const activityAt = row.lastActivity ?? row.route_date;
        const rightStamp = formatChatTimestamp(activityAt);
        const subtitle = formatChatSubtitle(activityAt);

        return (
          <ListItem
            key={row.route_id}
            sx={{ border: "2px solid #eeeeee", borderRadius: 2, p: 0 }}
            disableGutters
            secondaryAction={
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: "nowrap", px: 1 }}
              >
                {rightStamp}
              </Typography>
            }
          >
            <ListItemButton
              sx={{ borderRadius: 2, py: 1 }}
              onClick={() => navigate(`/chat/${row.route_id}`)}
            >
              <ListItemAvatar>
                <Avatar>
                  <ExploreOutlinedIcon />
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={title}
                secondary={subtitle}
                primaryTypographyProps={{ noWrap: true }}
                secondaryTypographyProps={{
                  noWrap: true,
                  color: "text.secondary",
                }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </Box>
  );
};
