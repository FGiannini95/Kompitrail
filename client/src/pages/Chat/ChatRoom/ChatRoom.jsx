import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box, Divider, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { MessageList } from "../MessageList/MessageList";
import { MessageInput } from "../MessageInput/MessageInput";

export const ChatRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100svh",
        display: "flex",
        flexDirection: "column",
        // Prevent the page itself from scrolling on mobile
        overflow: "hidden",
        backgroundColor: (t) => t.palette.background.default,
      }}
    >
      {/* HEADER — sticky top */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          backgroundColor: (t) => t.palette.background.default,
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          wrap="nowrap"
          sx={{ px: 1, py: 1 }}
        >
          <IconButton onClick={() => navigate(-1)} aria-label="back">
            <ArrowBackIosIcon style={{ color: "black" }} />
          </IconButton>

          <Typography variant="h6" sx={{ flex: 1, textAlign: "center" }} noWrap>
            Mi chat + nombre ruta
          </Typography>

          {/* Tip: usa navigate(`/route/${id}`) se vuoi aprire la routeDetail di questa chat */}
          <IconButton
            onClick={() => navigate(`/route/${id}`)}
            aria-label="info"
          >
            <InfoOutlinedIcon />
          </IconButton>
        </Grid>

        <Divider sx={{ "&::before, &::after": { borderTopWidth: 2 } }} />
      </Box>

      {/* MESSAGES — the only scrollable area */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0, // IMPORTANT: lets this box actually shrink and scroll
          overflowY: "auto",
          overscrollBehavior: "contain", // prevent body scroll chaining
        }}
      >
        <MessageList items={[]} />
      </Box>

      {/* INPUT — sticky bottom */}
      <MessageInput onSend={(msg) => console.log(`SEND to chat ${id}:`, msg)} />
    </Box>
  );
};
