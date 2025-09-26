import React, { useEffect, useState } from "react";

// MUI
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

// MUI-ICONS
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import { useNavigate } from "react-router-dom";
import { RoutesString } from "../../../routes/routes";
import { RouteCard } from "./RouteCard/RouteCard";
import { getLocalStorage } from "../../../helpers/localStorageUtils";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ROUTES_URL } from "../../../../../server/config/serverConfig";
import { EmptyState } from "../../../components/EmptyState/EmptyState";
import { RouteDeleteDialog } from "./RouteDeleteDialog/RouteDeleteDialog";
import { SnackbarMessage } from "../../../components/SnackbarMessage/SnackbarMessage";

export const MyRoute = () => {
  const [allRoutesOneUser, setAllRoutesOneUser] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();
  const tokenLocalStorage = getLocalStorage("token");

  useEffect(() => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    axios
      .get(`${ROUTES_URL}/showallroutesoneuser/${user_id}`)
      .then((res) => {
        setAllRoutesOneUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleOpenCreateRoute = () => {
    navigate(RoutesString.createTrip);
  };

  const handleOpenDeleteDialog = (route_id) => {
    setSelectedRouteId(route_id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container alignItems="center">
        <IconButton onClick={() => navigate(RoutesString.infouser)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
        <Typography variant="h6">Mis rutas</Typography>
      </Grid>
      {/* Map allRoute and display in a card, divide between active and old ones */}
      <Grid item container direction="column" spacing={2}>
        {allRoutesOneUser.length > 0 ? (
          allRoutesOneUser.map((route) => (
            <Grid
              key={route?.routes_id}
              container
              spacing={1}
              sx={{
                marginTop: "10px",
                marginLeft: "45px",
                width: "100%",
                textAlign: "center",
              }}
            >
              <Grid item xs={12}>
                {/* We pass down all the props */}
                <RouteCard
                  {...route}
                  handleOpenDeleteDialog={handleOpenDeleteDialog}
                />
              </Grid>
            </Grid>
          ))
        ) : (
          <Grid
            container
            spacing={1}
            sx={{
              marginTop: "10px",
              marginLeft: "75px",
              textAlign: "center",
            }}
          >
            <EmptyState />
          </Grid>
        )}
      </Grid>
      <Grid item>
        <Button
          type="button"
          variant="outlined"
          fullWidth
          onClick={handleOpenCreateRoute}
          sx={{
            color: "black",
            borderColor: "#eeeeee",
            borderWidth: "2px",
            "&:hover": {
              borderColor: "#dddddd",
              borderWidth: "1px",
            },
          }}
        >
          Crar Ruta
          <AddOutlinedIcon style={{ paddingLeft: "5px", width: "20px" }} />
        </Button>
      </Grid>
      <RouteDeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDialog={handleCloseDialog}
        route_id={selectedRouteId}
        handleOpenSnackbar={handleOpenSnackbar}
      />
      {/* <RouteEditDialog
        openEditDialog={openEditDialog}
        handleCloseDialog={handleCloseDialog}
        route_id={selectedRouteId}
        setRefresh={setRefresh}
        handleOpenSnackbar={handleOpenSnackbar}
      /> */}

      <SnackbarMessage
        open={showSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        handleClose={handleCloseSnackbar}
      />
    </Grid>
  );
};
