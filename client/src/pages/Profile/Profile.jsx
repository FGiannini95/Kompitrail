import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Stack,
  Typography,
  CardContent,
  Card,
  Avatar,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// Utils
import { RoutesString } from "../../routes/routes";
// Providers & Hooks
import { useUserAnalytics } from "../../hooks/useUserAnalytics";
import { useRoutes } from "../../context/RoutesContext/RoutesContext";
// Components
import { UserRoutesCarousel } from "../InfoUser/Route/UserRoutesCarousel/UserRoutesCarousel";
import { RouteEditDialog } from "../InfoUser/Route/RouteEditDialog/RouteEditDialog";
import { AnalyticsTable } from "./AnalyticsTable/AnalyticsTable";
import { OutlinedButton } from "../../components/Buttons/OutlinedButton/OutlinedButton";
import { ContainedButton } from "../../components/Buttons/ContainedButton/ContainedButton";
import { UserAvatar } from "../../components/Avatars/UserAvatar/UserAvatar";

export const Profile = () => {
  const { allRoutes, loadAllRoutes } = useRoutes();
  const navigate = useNavigate();

  const { motorbikes, createdRoutes, joinedRoutes, loading } =
    useUserAnalytics();

  useEffect(() => {
    loadAllRoutes();
  }, [loadAllRoutes]);

  return (
    <Box
      style={{
        backgroundColor: "#fafafa",
        paddingTop: "25px",
      }}
    >
      <Grid>
        <UserAvatar />

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

        <AnalyticsTable
          motorbikes={motorbikes?.total_motorbikes}
          createdRoutes={createdRoutes?.total_createdroutes}
          joinedRoutes={joinedRoutes?.total_joinedroutes}
          loading={loading}
        />
      </Grid>

      <Grid sx={{ width: "95%", marginLeft: "10px", marginTop: "10px" }}>
        <UserRoutesCarousel
          allRoutes={allRoutes}
          title={"Rutas"}
          showOnlyFuture={false}
          sortOrder="desc"
        />
      </Grid>

      <Grid sx={{ width: "95%", marginLeft: "10px", marginTop: "10px" }}>
        <Typography>Personas con las que viajas más</Typography>
        <Card
          sx={{
            width: "50%",
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
            <Avatar />
            <Typography>{"Nome"}</Typography>
            <Typography>{"# rutas en común"}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <RouteEditDialog />
    </Box>
  );
};
