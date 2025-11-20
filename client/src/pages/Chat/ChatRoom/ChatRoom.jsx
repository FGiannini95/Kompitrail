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
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        backgroundColor: (t) => t.palette.background.default,
        overflow: "hidden",
        height: "100dvh",
      }}
    >
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

          <IconButton
            onClick={() => navigate(`/route/${id}`)}
            aria-label="info"
          >
            <InfoOutlinedIcon />
          </IconButton>
        </Grid>

        <Divider sx={{ "&::before, &::after": { borderTopWidth: 2 } }} />
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <MessageList items={[]} />
      </Box>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 2,
          backgroundColor: (t) => t.palette.background.default,
          borderTop: (t) => `1px solid ${t.palette.divider}`,
          py: 1,
          px: 1,
        }}
      >
        <MessageInput
          onSend={(msg) => console.log(`SEND to chat ${id}:`, msg)}
        />
      </Box>
    </Box>
  );
};
