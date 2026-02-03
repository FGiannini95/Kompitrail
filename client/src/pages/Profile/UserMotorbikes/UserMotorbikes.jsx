import React, { useState } from "react";

import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

import { useMotorbikes } from "../../../context/MotorbikesContext/MotorbikesContext";

import { FullScreenImg } from "../../../components/FullScreenImg/FullScreenImg";
import { API_BASE } from "../../../api";

import { Loading } from "../../../components/Loading/Loading";

export const UserMotorbikes = () => {
  const [openImg, setOpenImg] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  const { allMotorbikes, loading } = useMotorbikes();

  if (loading) {
    return <Loading />;
  }

  const isTwoOrLess = allMotorbikes.length <= 2;

  const handleOpenImg = (img) => {
    setSelectedImg(img);
    setOpenImg(true);
  };

  const handleCloseImg = () => {
    setSelectedImg(null);
    setOpenImg(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: isTwoOrLess ? "visible" : "auto",
          // Hide scrollbar
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari, Edge
          },
        }}
      >
        {allMotorbikes.map((motorbike) => {
          const imgUrl = `${API_BASE}/images/motorbikes/${motorbike.img}`;

          return (
            <Card
              key={motorbike.motorbike_id}
              sx={(theme) => ({
                minWidth: isTwoOrLess ? "calc(50% - 8px)" : "calc(45% - 8px)",
                maxWidth: isTwoOrLess ? "calc(50% - 8px)" : "calc(45% - 8px)",
                bgcolor: theme.palette.kompitrail.card,
                borderRadius: 2,
                flexShrink: 0,
              })}
              onClick={() => handleOpenImg(imgUrl)}
            >
              <CardMedia
                component="img"
                sx={{ height: 120, objectFit: "cover" }}
                image={imgUrl}
                title="motorbike"
              />
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 1,
                  p: 1,
                  "&:last-child": { pb: 1 },
                }}
              >
                <Typography variant="body2" sx={{ wordWrap: "break-word" }}>
                  {motorbike.motorbike_brand} - {motorbike.motorbike_model}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
      <FullScreenImg
        open={openImg}
        onClose={handleCloseImg}
        img={selectedImg}
      />
    </>
  );
};
