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
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
// Components
import { MotorbikeCreateDialog } from "./MotorbikeCreateDialog/MotorbikeCreateDialog";
import { MotorbikeEditDialog } from "./MotorbikeEditDialog/MotorbikeEditDialog";
import { MotorbikeCard } from "./MotorbikeCard/MotorbikeCard";
import { FullScreenImg } from "../../../components/FullScreenImg/FullScreenImg";
import { EmptyState } from "../../../components/EmptyState/EmptyState";
// Utils
import { getLocalStorage } from "../../../helpers/localStorageUtils";
import { MOTORBIKES_URL } from "../../../../../server/config/serverConfig";
// Providers
import { useConfirmationDialog } from "../../../context/ConfirmationDialogContext/ConfirmationDialogContext";
import { useSnackbar } from "../../../context/SnackbarContext/SnackbarContext";

export const Motorbike = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [allMotorbikes, setAllMotorbikes] = useState([]);
  const [selectedMotorbikeId, setSelectedMotorbikeId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [openImg, setOpenImg] = useState(false);
  const [imgSelected, setImgSelected] = useState();

  const tokenLocalStorage = getLocalStorage("token");
  const navigate = useNavigate();
  const { openDialog } = useConfirmationDialog();
  const { showSnackbar } = useSnackbar();

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
      .put(`${MOTORBIKES_URL}/deletemotorbike/${motorbike_id}`)
      .then(() => {
        setRefresh((prev) => !prev);
        showSnackbar("Moto eliminada con éxito");
        setTimeout(() => {
          navigate(-1);
        }, 2000);
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

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleOpenEditDialog = (motorbike_id) => {
    setSelectedMotorbikeId(motorbike_id);
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenCreateDialog(false);
    setOpenEditDialog(false);
  };

  const handleCloseImg = () => {
    setImgSelected();
    setOpenImg(false);
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
      />

      <MotorbikeEditDialog
        openEditDialog={openEditDialog}
        handleCloseDialog={handleCloseDialog}
        motorbike_id={selectedMotorbikeId}
        setRefresh={setRefresh}
      />

      <FullScreenImg
        open={openImg}
        onClose={handleCloseImg}
        img={imgSelected}
      />
    </Grid>
  );
};
