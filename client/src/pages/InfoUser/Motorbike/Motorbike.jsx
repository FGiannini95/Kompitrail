import React, { useState, useEffect } from "react";

import {
  Typography,
  Grid2 as Grid,
  Button,
  IconButton,
  Box,
} from "@mui/material";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import axios from "axios";
import { MotorbikeCreateDialog } from "./MotorbikeCreateDialog/MotorbikeCreateDialog";
import { MotorbikeDeleteDialog } from "./MotorbikeDeleteDialog/MotorbikeDeleteDialog";
import { MotorbikeEditDialog } from "./MotorbikeEditDialog/MotorbikeEditDialog";
import { getLocalStorage } from "../../../helpers/localStorageUtils";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { MotorbikeCard } from "./MotorbikeCard/MotorbikeCard";
import { FullScreenImg } from "../../../components/FullScreenImg/FullScreenImg";
import { SnackbarMessage } from "../../../components/SnackbarMessage/SnackbarMessage";
import { MOTORBIKES_URL } from "../../../../../server/config/serverConfig";
import { EmptyState } from "../../../components/EmptyState/EmptyState";
import { useConfirmationDialog } from "../../../context/ConfirmationDialogContext/ConfirmationDialogContext";

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
  const { openDialog } = useConfirmationDialog();

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

  const handleDeleteMotorbike = (motorbike_id) => {
    axios
      // BE connection
      .put(`${MOTORBIKES_URL}/deletemotorbike/${motorbike_id}`)
      // Display result + navigation
      .then(() => {
        //showSnackbar("Moto eliminada con éxito");
        //triggerRefresh();
        setTimeout(() => {
          navigate(-1);
        }, 2000)
          // Errors
          .catch((err) => {
            console.log(err);
            //showSnackbar("Error al eliminar la moto", error);
          });
      });
  };

  const handleOpenDeleteDialog = (motorbike_id) => {
    openDialog({
      title: "Eliminar moto",
      message: "¿Quieres eliminar la moto de tu perfil?",
      onConfirm: () => handleDeleteMotorbike(motorbike_id),
    });
  };

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  // const handleOpenDeleteDialog = (motorbike_id) => {
  //   setSelectedMotorbikeId(motorbike_id);
  //   setOpenDeleteDialog(true);
  // };

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
      <Grid container alignItems="center">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
        <Typography variant="h6">Mis motos</Typography>
      </Grid>
      <Box sx={{ maxWidth: 480, mx: "auto", px: 2, pb: 2, minWidth: 330 }}>
        {allMotorbikes.length > 0 ? (
          allMotorbikes.map((motorbike) => (
            <Grid
              key={motorbike?.motorbike_id}
              container
              justifyContent="center"
              mb={2}
            >
              <MotorbikeCard
                brand={motorbike.motorbike_brand}
                model={motorbike.motorbike_model}
                motorbike_id={motorbike.motorbike_id}
                img={`http://localhost:3000/images/motorbikes/${motorbike.img}`}
                onEdit={handleOpenEditDialog}
                onDelete={handleOpenDeleteDialog}
              />
            </Grid>
          ))
        ) : (
          <Grid container justifyContent="center" mb={2}>
            <EmptyState />
          </Grid>
        )}
      </Box>

      <Grid>
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

      <MotorbikeEditDialog
        openEditDialog={openEditDialog}
        handleCloseDialog={handleCloseDialog}
        motorbike_id={selectedMotorbikeId}
        setRefresh={setRefresh}
        handleOpenSnackbar={handleOpenSnackbar}
      />

      <FullScreenImg
        open={openImg}
        onClose={handleCloseImg}
        img={imgSelected}
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
