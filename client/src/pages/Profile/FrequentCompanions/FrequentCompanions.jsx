import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";

import { normalizeImg } from "../../../helpers/normalizeImg";
import { RoutesString } from "../../../routes/routes";

import { KompitrailContext } from "../../../context/KompitrailContext";
import { useFrequentCompanions } from "../../../hooks/useFrequentCompanions";

import { CardPlaceholder } from "../../../components/CardPlaceholder/CardPlaceholder";
import { Loading } from "../../../components/Loading/Loading";

export const FrequentCompanions = ({ companions: companionsProp }) => {
  const {
    companions: myCompanions = [],
    loading,
    error,
  } = useFrequentCompanions();
  const companions = companionsProp ?? myCompanions;
  const navigate = useNavigate();
  const { user } = useContext(KompitrailContext);
  const { t } = useTranslation("emptyState");

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Typography>Error al cargar la sección</Typography>;
  }

  if (!Array.isArray(companions) || companions.length === 0) {
    return <CardPlaceholder text={t("frequentCompanionPlaceholder")} />;
  }

  const isTwoOrLess = companions.length <= 2;

  const handleCardClick = (companion) => (e) => {
    e.stopPropagation();
    const isCurrentUser =
      user?.user_id !== null && user?.user_id === companion.user_id;
    navigate(
      isCurrentUser
        ? RoutesString.profile
        : RoutesString.otherProfile.replace(":id", companion.user_id)
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: isTwoOrLess ? "visible" : "auto",
        paddingBottom: 2,
        // Hide scrollbar
        scrollbarWidth: "none", // Firefox
        "&::-webkit-scrollbar": {
          display: "none", // Chrome, Safari, Edge
        },
      }}
    >
      {companions.map((companion) => {
        const photoUrl = normalizeImg(companion.img);

        return (
          <Card
            key={companion.user_id}
            sx={(theme) => ({
              minWidth: isTwoOrLess ? "calc(50% - 8px)" : "calc(45% - 8px)",
              maxWidth: isTwoOrLess ? "calc(50% - 8px)" : "calc(45% - 8px)",
              bgcolor: theme.palette.kompitrail.card,
              borderRadius: 2,
              flexShrink: 0,
            })}
            onClick={handleCardClick(companion)}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 1,
              }}
            >
              <Avatar
                src={photoUrl}
                alt={`${companion.name ?? ""}`}
                sx={(theme) => ({
                  width: 56,
                  height: 56,
                  border: `1px solid ${theme.palette.text.primary}`,
                  color: theme.palette.text.primary,
                  backgroundColor: "transparent",
                })}
              />
              <Typography fontWeight={600}>{companion.name}</Typography>
              <Typography>{companion.shared_routes} rutas en común</Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};
