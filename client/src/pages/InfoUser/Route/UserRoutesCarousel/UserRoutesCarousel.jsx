import React, { useContext, useMemo } from "react";

import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { RouteCard } from "../RouteCard/RouteCard";
import { KompitrailContext } from "../../../../context/KompitrailContext";

export const UserRoutesCarousel = ({ allRoutes = [] }) => {
  const { user: currentUser } = useContext(KompitrailContext);

  // Compute only user-related routes and sort by ascending date
  const userRoutes = useMemo(() => {
    if (!Array.isArray(allRoutes) || !currentUser?.user_id) return [];
    return allRoutes
      .filter(
        (route) =>
          route.user_id === currentUser?.user_id ||
          route.participants?.some((p) => p.user_id === currentUser?.user_id)
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [allRoutes, currentUser?.user_id]);

  return (
    <Box
      sx={{
        pb: 2,
        "& .swiper": {
          overflow: "visible",
          paddingBottom: 4, // ↑ more space between card and bullets
        },
        "& .swiper-pagination": {
          bottom: 0, // keep bullets at the bottom of that padding
        },
        "& .swiper-slide": { display: "flex", justifyContent: "center" },
        "& .swiper-pagination-bullet": {
          opacity: 1,
          backgroundColor: "rgba(0,0,0,0.25)",
        },
        "& .swiper-pagination-bullet-active": { backgroundColor: "#000" },
      }}
    >
      <Swiper
        modules={[Pagination, A11y]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoHeight
        spaceBetween={12}
      >
        {userRoutes.map((route) => (
          <SwiperSlide key={route?.route_id}>
            <Grid container justify-content="center">
              <RouteCard
                {...route}
                isOwner={route.user_id === currentUser.user_id}
                showActions={false}
              />
            </Grid>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};
