import React from "react";

import { Paper, Typography, Stack, Box } from "@mui/material";
import {
  TurnLeftOutlined,
  TurnRightOutlined,
  ArrowUpwardOutlined,
  UTurnLeftOutlined,
} from "@mui/icons-material";

import { useTranslation } from "react-i18next";

import { Loading } from "../../Loading/Loading";

export const TopBannerNavigation = ({ currentInstruction }) => {
  const { t } = useTranslation(["oneRoute"]);

  // Get navigation icon based on instruction text
  const getNavigationIcon = (instruction) => {
    if (!instruction)
      return <ArrowUpwardOutlined sx={{ fontSize: 28, color: "white" }} />;

    const text = instruction.toLowerCase();

    if (text.includes("turn left") || text.includes("left")) {
      return <TurnLeftOutlined sx={{ fontSize: 28, color: "white" }} />;
    }

    if (text.includes("turn right")) {
      return <TurnRightOutlined sx={{ fontSize: 28, color: "white" }} />;
    }

    if (text.includes("u-turn") || text.includes("inversione")) {
      return <UTurnLeftOutlined sx={{ fontSize: 28, color: "white" }} />;
    }

    if (text.includes("straight")) {
      return <ArrowUpwardOutlined sx={{ fontSize: 28, color: "white" }} />;
    }

    return null;
  };

  // Extract street name from instruction
  const extractStreetName = (instruction) => {
    if (!instruction) return "";

    // Pattern: "Turn right onto Street Name"
    const ontoMatch = instruction.match(/onto (.+?)$/i);
    if (ontoMatch) return ontoMatch[1];

    // Pattern: "Continue on Street Name"
    const onMatch = instruction.match(/on (.+?)$/i);
    if (onMatch) return onMatch[1];

    return instruction;
  };

  // Truncate street name if too long
  const truncateStreet = (streetName, maxLength = 30) => {
    if (!streetName || streetName.length <= maxLength) return streetName;
    return streetName.substring(0, maxLength) + "...";
  };

  return (
    <Paper
      sx={{
        position: "absolute",
        top: 16,
        left: 16,
        right: 16,
        zIndex: 1000,
        bgcolor: "rgba(0, 128, 0, 0.9)",
        color: "white",
        borderRadius: 2,
        p: 2,
        boxShadow: 3,
      }}
    >
      {/* Loading State */}
      {currentInstruction.type === "loading" && (
        <Box sx={{ textAlign: "center" }}>
          <Loading />
        </Box>
      )}

      {/* Navigation Instruction */}
      {currentInstruction.type === "instruction" && (
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Left - Navigation Icon */}
          <Box
            sx={{
              width: 48,
              height: 48,
              bgcolor: "rgba(255, 255, 255, 0.2)",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            {getNavigationIcon(currentInstruction.text)}
          </Box>

          {/* Right - Distance + Street Info + Street Name */}
          <Stack sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: "12px",
                opacity: 0.9,
                lineHeight: 1,
                marginBottom: 0.5,
              }}
            >
              {currentInstruction.distance} {currentInstruction.unit}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontSize: "18px",
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                marginBottom: 0.5,
              }}
            >
              {truncateStreet(extractStreetName(currentInstruction.text))}
            </Typography>
          </Stack>
        </Stack>
      )}

      {/* Destination Reached */}
      {currentInstruction.type === "completed" && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ justifyContent: "center" }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            🏁
          </Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "18px" }}
          >
            {t("oneRoute:navigation.destinationReached")}
          </Typography>
        </Stack>
      )}
    </Paper>
  );
};
