import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
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

  useEffect(() => {
    loadAllRoutes();
  }, [loadAllRoutes]);

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
  const displayRoutes = isOtherProfile
    ? (otherUserData?.routes ?? [])
    : (allRoutes ?? []);
  const displayCompanions = isOtherProfile
    ? (otherUserData?.companions ?? [])
    : myCompanions;

  const isLoading = isOtherProfile ? otherUserLoading : loading;

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
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIosIcon style={{ color: "black" }} />
          </IconButton>
          <Typography variant="h6">Perfil</Typography>
          <IconButton>
            <ShareOutlinedIcon style={{ color: "black" }} />
          </IconButton>
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
            <ContainedButton text={"Ir a premium"} />
            <OutlinedButton
              onClick={() => navigate(RoutesString.editUser)}
              text={"Modificar Perfil"}
              icon={
                <EditOutlinedIcon
                  style={{ paddingLeft: "5px", width: "20px" }}
                  aria-hidden
                />
              }
            />
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
