import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Avatar,
  Box,
  IconButton,
  ListItemAvatar,
  ListItemButton,
  ListItem,
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

  const ordered = rooms;

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
        const lastMessageText = row.lastMessage?.text || "";

        return (
          <ListItem
            key={row.route_id}
            sx={{
              border: "2px solid #eeeeee",
              borderRadius: 2,
              p: 0,
              alignItems: "flex-start",
            }}
            disableGutters
          >
            <ListItemButton
              sx={{ borderRadius: 2, py: 1, width: "100%" }}
              onClick={() =>
                navigate(`/chat/${row.route_id}`, {
                  state: {
                    title: `${row.starting_point} - ${row.ending_point}`,
                  },
                })
              }
            >
              <ListItemAvatar sx={{ minWidth: 56 }}>
                <Avatar
                  sx={{
                    border: "2px solid black",
                    color: "black",
                    backgroundColor: "transparent",
                  }}
                >
                  <ExploreOutlinedIcon sx={{}} />
                </Avatar>
              </ListItemAvatar>

              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gridAutoRows: "auto",
                  columnGap: 1,
                  pr: 0,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    gridColumn: "1 / -1",
                    fontWeight: 500,
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {title}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    gridColumn: "1 / -1",
                    display: "block",
                    fontSize: "0.7rem",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    mt: 0.25,
                  }}
                >
                  {subtitle}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  sx={{
                    gridColumn: "1 / 2",
                    minHeight: "1.2em",
                  }}
                >
                  {lastMessageText}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    gridColumn: "2 / 3",
                    alignSelf: "center",
                    whiteSpace: "nowrap",
                    ml: 1,
                  }}
                >
                  {rightStamp}
                </Typography>
              </Box>
            </ListItemButton>
          </ListItem>
        );
      })}
    </Box>
  );
};
