import React, { useContext, useMemo } from "react";

import { Box, Typography } from "@mui/material";

import { KompitrailContext } from "../../../../context/KompitrailContext";

import { RouteCard } from "../RouteCard/RouteCard";
import { CardPlaceholder } from "../../../../components/CardPlaceholder/CardPlaceholder";

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

  const isOne = userRoutes.length === 1;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography>{title}</Typography>
      {userRoutes.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: isOne ? "visible" : "auto",
            paddingBottom: 2,
            // Hide scrollbar
            scrollbarWidth: "none", // Firefox
            "&::-webkit-scrollbar": {
              display: "none", // Chrome, Safari, Edge
            },
          }}
        >
          {userRoutes.map((route) => (
            <Box
              key={route.route_id}
              sx={{
                flexShrink: 0,
                width: isOne ? "100%" : "calc(92% - 8px)",
              }}
            >
              <RouteCard
                {...route}
                isOwner={route.user_id === currentUser.user_id}
              />
            </Box>
          ))}
        </Box>
      ) : (
        <CardPlaceholder
          text={"Aún no tienes rutas guardadas. Apúntate o crea una."}
        />
      )}
    </Box>
  );
};
