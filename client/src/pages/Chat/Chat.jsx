import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

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

export const Chat = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(KompitrailContext);
  const { t, i18n } = useTranslation("chat");

  const localeMap = {
    es: "es-ES",
    en: "en-GB",
    it: "it-IT",
  };

  const currentLang = i18n.language?.slice(0, 2) || "es";
  const locale = localeMap[currentLang] ?? "es-ES";

  useEffect(() => {
    let cancelled = false;

    const fetchRooms = async () => {
      try {
        setLoading(true);

        const uid = currentUser?.user_id;
        if (!uid) {
          if (!cancelled) {
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
          <ArrowBackIosIcon
            aria-hidden
            sx={(theme) => ({
              color: theme.palette.text.primary,
            })}
          />
        </IconButton>
        <Box sx={{ maxWidth: 480, mx: "auto", width: "100%", px: 2 }}>
          <EmptyState />
        </Box>
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

        // Return Tuesday 22/11/2024 at 10:45
        const { date_dd_mm_yyyy, time_hh_mm, weekday, isValid } =
          formatDateTime(row.route_date, { locale, timeZone: "Europe/Madrid" });

        const weekdayCap =
          isValid && weekday
            ? weekday.charAt(0).toUpperCase() + weekday.slice(1)
            : "";

        const subtitle = isValid
          ? t("subtitle", {
              weekday: weekdayCap,
              date: date_dd_mm_yyyy,
              time: time_hh_mm,
            })
          : "";

        const lastMessageText = row.lastMessage?.text || "";

        return (
          <ListItem
            key={row.route_id}
            sx={(theme) => ({
              backgroundColor: theme.palette.kompitrail.card,
              borderRadius: 2,
              p: 0,
              alignItems: "flex-start",
            })}
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
                  sx={(theme) => ({
                    border: `2px solid ${theme.palette.primary}`,
                    color: theme.palette.primary,
                    backgroundColor: "transparent",
                  })}
                >
                  <ExploreOutlinedIcon
                    aria-hidden
                    sx={(theme) => ({
                      color: theme.palette.text.primary,
                    })}
                  />
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
                    color: "text.primary",
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
