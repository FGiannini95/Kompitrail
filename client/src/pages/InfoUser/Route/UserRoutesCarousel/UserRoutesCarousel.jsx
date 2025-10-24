import React, { useContext, useMemo } from "react";

import { Box, Card, CardContent, Typography } from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { RouteCard } from "../RouteCard/RouteCard";

import { KompitrailContext } from "../../../../context/KompitrailContext";

export const UserRoutesCarousel = ({
  allRoutes = [],
  title,
  showOnlyFuture,
  sortOrder,
}) => {
  const { user: currentUser } = useContext(KompitrailContext);

  // Compute only user-related routes and sort by ascending date
  const userRoutes = useMemo(() => {
    if (!Array.isArray(allRoutes) || !currentUser?.user_id) return [];

    const now = new Date();

    const filtered = allRoutes.filter((route) => {
      const isUserRoute =
        route.user_id === currentUser?.user_id ||
        route.participants?.some((p) => p.user_id === currentUser?.user_id);

      if (!isUserRoute) return false;

      if (showOnlyFuture) {
        return new Date(route.date) >= now;
      }

      return true;
    });

    // Sort based on sortOrder prop
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [allRoutes, currentUser?.user_id, showOnlyFuture]);

  return (
    <Box sx={{ mb: 2 }}>
      <Typography>{title}</Typography>
      {userRoutes.length > 0 ? (
        <Box
          sx={{
            overflow: "hidden", // Prevent horizontal scroll
            "& .routes-pagination-top .swiper-pagination-bullet": {
              width: 8,
              height: 8,
              opacity: 1,
              backgroundColor: "#d0d0d0", // Inactive dot color
              transition: "all 0.3s",
            },
            "& .routes-pagination-top .swiper-pagination-bullet-active": {
              backgroundColor: "#000", // Active dot color
              width: 10,
              height: 10,
            },
          }}
        >
          {/* TOP DOTS */}
          <Box
            className="routes-pagination-top"
            sx={{ display: "flex", justifyContent: "center", mb: 1 }}
          />

          <Swiper
            modules={[Pagination, A11y]}
            slidesPerView={1}
            spaceBetween={4}
            autoHeight
            pagination={{ el: ".routes-pagination-top", clickable: true }}
          >
            {userRoutes.map((route) => (
              <SwiperSlide key={route.route_id}>
                <RouteCard
                  {...route}
                  isOwner={route.user_id === currentUser.user_id}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      ) : (
        <Card
          sx={{
            width: "100%",
            bgcolor: "#eeeeee",
            borderRadius: 2,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography>
              {"Aún no tienes rutas guardadas. Apúntate o crea una."}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
