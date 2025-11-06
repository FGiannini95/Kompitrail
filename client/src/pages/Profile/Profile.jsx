import React, { useContext, useEffect, useMemo, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";

import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// Utils
import { RoutesString } from "../../routes/routes";
// Providers & Hooks
import { useUserAnalytics } from "../../hooks/useUserAnalytics";
import { useOtherUserProfile } from "../../hooks/useOtherUserProfile";
import { useFrequentCompanions } from "../../hooks/useFrequentCompanions";
import { useRoutes } from "../../context/RoutesContext/RoutesContext";
import { KompitrailContext } from "../../context/KompitrailContext";
// Components
import { UserRoutesCarousel } from "../InfoUser/Route/UserRoutesCarousel/UserRoutesCarousel";
import { RouteEditDialog } from "../InfoUser/Route/RouteEditDialog/RouteEditDialog";
import { AnalyticsTable } from "./AnalyticsTable/AnalyticsTable";
import { OutlinedButton } from "../../components/Buttons/OutlinedButton/OutlinedButton";
import { ContainedButton } from "../../components/Buttons/ContainedButton/ContainedButton";
import { UserAvatar } from "../../components/Avatars/UserAvatar/UserAvatar";
import { FrequentCompanions } from "./FrequentCompanions/FrequentCompanions";

export const Profile = () => {
  const { allRoutes, loadAllRoutes } = useRoutes();
  const { id: otherUserId } = useParams();
  const { user: currentUser } = useContext(KompitrailContext);
  const { data: otherUserData, loading: otherUserLoading } =
    useOtherUserProfile(otherUserId);
  const { motorbikes, createdRoutes, joinedRoutes, loading } =
    useUserAnalytics();
  const { companions: myCompanions = [] } = useFrequentCompanions();
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    loadAllRoutes();
  }, [loadAllRoutes]);

  // Safe back handler with fallback to home.
  const handleBack = () => {
    // Check if the tab has history to go back to
    const hasHistory =
      typeof window !== "undefined" &&
      window.history?.state &&
      typeof window.history.state.idx === "number" &&
      window.history.state.idx > 0;

    if (hasHistory) {
      navigate(-1);
    } else {
      navigate(RoutesString.home, { replace: true });
    }
  };

  // Determine which user profile we are watching
  const isOtherProfile =
    Boolean(otherUserId) &&
    String(otherUserId) !== String(currentUser?.user_id);
  const isOwnProfile = !isOtherProfile;

  const displayUser = isOtherProfile ? otherUserData?.user : currentUser;

  const displayMotorbikes = isOtherProfile
    ? otherUserData?.motorbikes
    : motorbikes;

  const displayCreatedRoutes = isOtherProfile
    ? otherUserData?.createdRoutes
    : createdRoutes;

  const displayJoinedRoutes = isOtherProfile
    ? otherUserData?.joinedRoutes
    : joinedRoutes;

  const displayCompanions = isOtherProfile
    ? (otherUserData?.companions ?? [])
    : myCompanions;

  /* Decide which routes to render in the carousel.
  Own profile  -> use allRoutes.
  Other profile -> combine what the API returns for that user with what we can infer from the global list, then de-duplicate by id.*/
  const displayRoutes = isOtherProfile
    ? (() => {
        // Routes returned by the "other user" API may be empty or only future/created)
        const apiUserRoutes = Array.isArray(otherUserData?.routes)
          ? otherUserData.routes
          : [];

        // Routes from the global cache that belong to (or include) the viewed profile user
        const globalRoutesForViewedUser = Array.isArray(allRoutes)
          ? allRoutes.filter((route) => {
              // Owner match: route.user_id equals the viewed user's id
              const ownerIsViewedUser =
                Number(route?.user_id) === Number(otherUserId);
              // Participant match: viewed user appears in participants
              const viewedUserIsParticipant = Array.isArray(route?.participants)
                ? route.participants.some(
                    (p) => Number(p?.user_id) === Number(otherUserId)
                  )
                : false;
              return ownerIsViewedUser || viewedUserIsParticipant;
            })
          : [];

        // Merge, preferring API items first, then remove duplicates by id
        const seenRouteIds = new Set(); // tracks which route ids we have kept
        const combinedRoutesForViewedUser = [
          ...apiUserRoutes,
          ...globalRoutesForViewedUser,
        ].filter((route) => {
          const routeKey = route?.route_id ?? route?.id; // robust id extraction
          if (!routeKey) return false; // drop items without a stable id
          if (seenRouteIds.has(routeKey)) return false; // duplicate -> skip
          seenRouteIds.add(routeKey); // first time -> keep
          return true;
        });

        return combinedRoutesForViewedUser;
      })()
    : (allRoutes ?? []);

  const isLoading = isOtherProfile ? otherUserLoading : loading;

  const profileUserId = isOtherProfile
    ? Number(otherUserId)
    : currentUser?.user_id;

  // Build a canonical share URL that ALWAYS contains the user id.
  // If we're viewing someone else: use that id.
  // If we're viewing our own profile at /profile: use currentUser.user_id.
  const shareUrl = useMemo(() => {
    const viewedId = otherUserId ? otherUserId : currentUser?.user_id;
    if (!viewedId) return window.location.href;

    const pathWithId = generatePath(RoutesString.otherProfile, {
      id: String(viewedId),
    });
    return `${window.location.origin}${pathWithId}`;
  }, [otherUserId, currentUser?.user_id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Error al copiar la URL:", error);
    }
  };

  if (isOtherProfile && (otherUserLoading || !otherUserData)) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  return (
    <Box
      style={{
        backgroundColor: "#fafafa",
        paddingTop: "25px",
      }}
    >
      {isOtherProfile && (
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, mb: 2 }}
        >
          <IconButton onClick={handleBack}>
            <ArrowBackIosIcon style={{ color: "black" }} />
          </IconButton>
          <Typography variant="h6">Perfil</Typography>
          <Tooltip
            title="URL copiada"
            open={isCopied}
            disableInteractive
            arrow
            placement="bottom"
          >
            <IconButton onClick={handleShare}>
              <ShareOutlinedIcon style={{ color: "black" }} />
            </IconButton>
          </Tooltip>
        </Grid>
      )}

      <Grid>
        <UserAvatar user={displayUser} />

        {isOwnProfile && (
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ p: "10px" }}
          >
            <OutlinedButton
              onClick={() => navigate(RoutesString.editUser)}
              text={"Modificar"}
              icon={
                <EditOutlinedIcon
                  style={{ paddingLeft: "5px", width: "20px" }}
                  aria-hidden
                />
              }
            />
            <Tooltip
              title="URL copiada"
              open={isCopied} // Display the tooltip only if isCopied is true
              disableInteractive // It doesn't appear with the interaction of the mouse
              arrow // Display the arrow
            >
              <ContainedButton
                onClick={handleShare}
                text={"Compartir"}
                icon={
                  <ShareOutlinedIcon
                    style={{ paddingLeft: "5px", width: "20px" }}
                    aria-hidden
                  />
                }
              />
            </Tooltip>
          </Stack>
        )}

        <AnalyticsTable
          motorbikes={displayMotorbikes?.total_motorbikes}
          createdRoutes={displayCreatedRoutes?.total_createdroutes}
          joinedRoutes={displayJoinedRoutes?.total_joinedroutes}
          loading={isLoading}
        />
      </Grid>

      <Grid sx={{ width: "95%", marginLeft: "10px", marginTop: "10px" }}>
        <UserRoutesCarousel
          allRoutes={displayRoutes}
          profileUserId={profileUserId}
          title={"Rutas"}
          showOnlyFuture={false}
          sortOrder="desc"
        />
      </Grid>

      <Grid sx={{ width: "95%", marginLeft: "10px", marginTop: "10px" }}>
        <Typography>Personas con las que viajas más</Typography>
        <FrequentCompanions companions={displayCompanions} />
      </Grid>
      <RouteEditDialog />
    </Box>
  );
};
