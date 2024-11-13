import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { MotorbikeDialog } from "./MotorbikeDialog/MotorbikeDialog";
import axios from "axios";
import { getLocalStorage } from "../../../helpers/localStorageUtils";
import { jwtDecode } from "jwt-decode";
import { MotorbikeDeleteDialog } from "./MotorbikeDeleteDialog/MotorbikeDeleteDialog";
import { MotorbikeEditDialog } from "./MotorbikeEditDialog/MotorbikeEditDialog";

export const Motorbike = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [allMotorbikes, setAllMotorbikes] = useState([]);
  const [selectedMotorbikeId, setSelectedMotorbikeId] = useState(null);

  const tokenLocalStorage = getLocalStorage("token");
  const navigate = useNavigate();

  useEffect(() => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    axios
      .get(`http://localhost:3000/motorbikes/showallmotorbikes/${user_id}`)
      .then((res) => {
        console.log("aaa", res.data);
        setAllMotorbikes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  //TODO: implement the dependency array in order to avoid the refresh to see the update
  // allmotorbikes generates an infinite loop in the back

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (motorbike_id) => {
    setSelectedMotorbikeId(motorbike_id);
    setOpenDeleteDialog(true);
  };

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenDeleteDialog(false);
    setOpenEditDialog(false);
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container alignItems="center">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Mis motos
        </Typography>
      </Grid>
      <Grid item container direction="column" spacing={2}>
        {allMotorbikes.map((motorbike) => (
          <Grid key={motorbike.id} container spacing={1} alignItems="center">
            <Grid item xs={3}>
              <img src={motorbike.img} alt={motorbike.brand} width="100%" />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                {motorbike.motorbike_brand}
              </Typography>
              <Typography variant="body2">
                {motorbike.motorbike_model}
              </Typography>
            </Grid>
            <Grid item xs={3} container justifyContent="flex-end">
              <IconButton fontSize="large">
                <EditOutlinedIcon onClick={handleOpenEditDialog} />
              </IconButton>
              <IconButton>
                <DeleteOutlineIcon
                  fontSize="large"
                  onClick={handleOpenDeleteDialog}
                />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid item>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={handleOpenDialog}
        >
          + Añadir moto
        </Button>
      </Grid>
      <MotorbikeDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
      />
      <MotorbikeDeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDialog={handleCloseDialog}
        motorbike_id={selectedMotorbikeId}
      />
      <MotorbikeEditDialog
        openEditDialog={openEditDialog}
        handleCloseDialog={handleCloseDialog}
      />
    </Grid>
  );
};
