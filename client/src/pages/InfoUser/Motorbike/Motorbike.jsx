import React, { useState, useEffect } from "react";

// MUI
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";

// MUI-ICONS
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import { MotorbikeCreateDialog } from "./MotorbikeCreateDialog/MotorbikeCreateDialog";
import { MotorbikeDeleteDialog } from "./MotorbikeDeleteDialog/MotorbikeDeleteDialog";
import { MotorbikeEditDialog } from "./MotorbikeEditDialog/MotorbikeEditDialog";
import { getLocalStorage } from "../../../helpers/localStorageUtils";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MotorbikeCard } from "./MotorbikeCard/MotorbikeCard";
import { FullScreenImg } from "../../../components/FullScreenImg/FullScreenImg";
import { SnackbarMessage } from "../../../components/SnackbarMessage/SnackbarMessage";
import { MOTORBIKES_URL } from "../../../../../server/config/serverConfig";
import { EmptyState } from "../../../components/EmptyState/EmptyState";

export const Motorbike = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [allMotorbikes, setAllMotorbikes] = useState([]);
  const [selectedMotorbikeId, setSelectedMotorbikeId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [openImg, setOpenImg] = useState(false);
  const [imgSelected, setImgSelected] = useState();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const tokenLocalStorage = getLocalStorage("token");
  const navigate = useNavigate();

  useEffect(() => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    axios
      .get(`${MOTORBIKES_URL}/showallmotorbikes/${user_id}`)
      .then((res) => {
        setAllMotorbikes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleOpenDeleteDialog = (motorbike_id) => {
    setSelectedMotorbikeId(motorbike_id);
    setOpenDeleteDialog(true);
  };

  const handleOpenEditDialog = (motorbike_id) => {
    setSelectedMotorbikeId(motorbike_id);
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenCreateDialog(false);
    setOpenDeleteDialog(false);
    setOpenEditDialog(false);
  };

  const handleCloseImg = () => {
    setImgSelected();
    setOpenImg(false);
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
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
        <Typography variant="h6">Mis motos</Typography>
      </Grid>
      <Grid item container direction="column" spacing={2}>
        {allMotorbikes.length > 0 ? (
          allMotorbikes.map((motorbike) => (
            <Grid
              key={motorbike?.motorbike_id}
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
                <MotorbikeCard
                  brand={motorbike.motorbike_brand}
                  model={motorbike.motorbike_model}
                  img={`http://localhost:3000/images/motorbikes/${motorbike.img}`}
                  handleOpenEditDialog={handleOpenEditDialog}
                  handleOpenDeleteDialog={handleOpenDeleteDialog}
                  motorbike_id={motorbike.motorbike_id}
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
          onClick={handleOpenCreateDialog}
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
          Añadir moto
          <AddOutlinedIcon style={{ paddingLeft: "5px", width: "20px" }} />
        </Button>
      </Grid>
      <MotorbikeCreateDialog
        openCreateDialog={openCreateDialog}
        handleCloseDialog={handleCloseDialog}
        setRefresh={setRefresh}
        handleOpenSnackbar={handleOpenSnackbar}
      />

      <MotorbikeDeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDialog={handleCloseDialog}
        motorbike_id={selectedMotorbikeId}
        handleOpenSnackbar={handleOpenSnackbar}
      />

      <MotorbikeEditDialog
        openEditDialog={openEditDialog}
        handleCloseDialog={handleCloseDialog}
        motorbike_id={selectedMotorbikeId}
        setRefresh={setRefresh}
        handleOpenSnackbar={handleOpenSnackbar}
      />

      <FullScreenImg
        openImg={openImg}
        handleCloseImg={handleCloseImg}
        imgSelected={imgSelected}
      />

      <SnackbarMessage
        open={showSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        handleClose={handleCloseSnackbar}
      />
    </Grid>
  );
};
