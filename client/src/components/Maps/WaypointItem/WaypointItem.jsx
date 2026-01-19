import React from "react";
import { useTranslation } from "react-i18next";

import { Box, IconButton, Stack } from "@mui/material";

import { getPointLabel } from "../../../helpers/pointMetrics";
import { getCurrentLang } from "../../../helpers/oneRouteUtils";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { FormTextfield } from "../../FormTextfield/FormTextfield";

export const WaypointItem = ({
  waypoint,
  index,
  allWaypoints,
  setWaypoints,
  totalCount,
}) => {
  const { t, i18n } = useTranslation();

  const handleMoveUp = () => {
    if (index === 0) return; // Can't move first item up

    const newWaypoints = [...allWaypoints];

    // Swap positions
    [newWaypoints[index], newWaypoints[index - 1]] = [
      newWaypoints[index - 1],
      newWaypoints[index],
    ];

    // Update position values to match array indices and respect db structure
    newWaypoints[index].position = index;
    newWaypoints[index - 1].position = index - 1;

    setWaypoints(newWaypoints);
  };

  const handleMoveDown = () => {
    if (index === totalCount - 1) return; // Can't move last item down

    const newWaypoints = [...allWaypoints];

    // Swap positions
    [newWaypoints[index], newWaypoints[index + 1]] = [
      newWaypoints[index + 1],
      newWaypoints[index],
    ];

    // Update position values to match array indices and respect db structure
    newWaypoints[index].position = index;
    newWaypoints[index + 1].position = index + 1;

    setWaypoints(newWaypoints);
  };

  const handleDelete = () => {
    const newWaypoints = allWaypoints
      .filter((_, i) => i !== index) // Remove current waypoint
      .map((wp, newIndex) => ({
        // Reorder positions
        ...wp,
        position: newIndex,
      }));

    setWaypoints(newWaypoints);
  };
  const currentLang = getCurrentLang(i18n);

  const getDisplayLabel = (waypoint) => {
    const pointForLabel = {
      lat: waypoint.lat || waypoint.waypoint_lat,
      lng: waypoint.lng || waypoint.waypoint_lng,
      i18n: waypoint.label_i18n,
    };

    return getPointLabel(pointForLabel, currentLang, "full");
  };

  const canMoveUp = index > 0;
  const canMoveDown = index < totalCount - 1;

  return (
    <FormTextfield
      label={`${t("forms:waypoint")} ${index + 1}`}
      name="waypoint_display"
      value={getDisplayLabel(waypoint)}
      readOnly={true}
      clearable={false}
      endAdornment={
        <Stack direction="row">
          <IconButton
            size="small"
            onClick={handleMoveUp}
            disabled={!canMoveUp}
            sx={{
              color: !canMoveUp === "action.disabled",
              minWidth: "auto",
              p: 0.5,
            }}
          >
            <KeyboardArrowUpIcon fontSize="small" aria-hidden />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleMoveDown}
            disabled={!canMoveDown}
            sx={{
              color: !canMoveDown === "action.disabled",
              p: 0.5,
            }}
          >
            <KeyboardArrowDownIcon fontSize="small" aria-hidden />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleDelete}
            sx={{
              minWidth: "auto",
              p: 0.5,
            }}
          >
            <DeleteOutlineIcon fontSize="small" aria-hidden />
          </IconButton>
        </Stack>
      }
    />
  );
};
