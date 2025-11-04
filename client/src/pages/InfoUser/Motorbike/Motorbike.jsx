import React, { useState, useEffect } from "react";

import { Typography, IconButton, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Utils
import { getLocalStorage } from "../../../helpers/localStorageUtils";
import { API_BASE, MOTORBIKES_URL } from "../../../api";
// Providers & Hooks
import { useConfirmationDialog } from "../../../context/ConfirmationDialogContext/ConfirmationDialogContext";
import { useSnackbar } from "../../../context/SnackbarContext/SnackbarContext";
import { useMotorbikes } from "../../../context/MotorbikesContext/MotorbikesContext";
// Components
import { MotorbikeCreateDialog } from "./MotorbikeCreateDialog/MotorbikeCreateDialog";
import { MotorbikeEditDialog } from "./MotorbikeEditDialog/MotorbikeEditDialog";
import { MotorbikeCard } from "./MotorbikeCard/MotorbikeCard";
import { FullScreenImg } from "../../../components/FullScreenImg/FullScreenImg";
import { EmptyState } from "../../../components/EmptyState/EmptyState";
import { Loading } from "../../../components/Loading/Loading";
import { OutlinedButton } from "../../../components/Buttons/OutlinedButton/OutlinedButton";

export const Motorbike = () => {
  const [openImg, setOpenImg] = useState(false);
  const [imgSelected, setImgSelected] = useState();

  const tokenLocalStorage = getLocalStorage("token");
  const navigate = useNavigate();

  const { openDialog } = useConfirmationDialog();
  const { showSnackbar } = useSnackbar();
  const {
    allMotorbikes,
    loadMotorbikes,
    deleteMotorbike,
    openDialog: openCreateEditDialog,
    loading,
  } = useMotorbikes();

  useEffect(() => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    loadMotorbikes(user_id);
  }, [tokenLocalStorage, loadMotorbikes]);

  const handleDeleteMotorbike = (motorbike_id) => {
    axios
      .put(`${MOTORBIKES_URL}/deletemotorbike/${motorbike_id}`)
      .then(() => {
        deleteMotorbike(motorbike_id);
        showSnackbar("Moto eliminada con éxito");
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Error al eliminar la moto", "error");
      });
  };

  const handleOpenDeleteDialog = (motorbike_id) => {
    openDialog({
      title: "Eliminar moto",
      message: "¿Quieres eliminar la moto de tu perfil?",
      onConfirm: () => handleDeleteMotorbike(motorbike_id),
    });
  };

  const openCreateDialog = () => {
    openCreateEditDialog({ mode: "create" });
  };

  const openEditMotorbike = (motorbike_id) =>
    openCreateEditDialog({ mode: "edit", motorbike_id });

  const handleCloseImg = () => {
    setImgSelected();
    setOpenImg(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Grid container direction="column" spacing={2}>
      <Grid container alignItems="center">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
        <Typography variant="h6">Mis motos</Typography>
      </Grid>
      <Box sx={{ maxWidth: 480, mx: "auto", px: 2, minWidth: 310 }}>
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
                img={`${API_BASE}/images/motorbikes/${motorbike.img}`}
                onEdit={openEditMotorbike}
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
        <OutlinedButton
          onClick={openCreateDialog}
          text={"Añadir moto"}
          icon={
            <AddOutlinedIcon
              style={{ paddingLeft: "5px", width: "20px" }}
              aria-hidden
            />
          }
        />
      </Grid>
      <MotorbikeCreateDialog />
      <MotorbikeEditDialog />
      <FullScreenImg
        open={openImg}
        onClose={handleCloseImg}
        img={imgSelected}
      />
    </Grid>
  );
};
