import React from "react";
import { Marker } from "react-map-gl/mapbox";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import { WaypointNumberBadge } from "../WaypointNumberBadge/WaypointNumberBadge";

export const MarkerWithIcon = ({
  longitude,
  latitude,
  type,
  number = null,
  color = "#000000",
}) => (
  <Marker longitude={longitude} latitude={latitude} anchor="bottom">
    {type === "start" && (
      <LocationOnOutlinedIcon sx={{ fontSize: 30, color }} />
    )}
    {type === "end" && <FlagOutlinedIcon sx={{ fontSize: 30, color }} />}
    {type === "waypoint" && <WaypointNumberBadge number={number} />}
  </Marker>
);
