import React, { useState, useEffect } from "react";

// MUI
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

// MUI-ICONS
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import { MotorbikeCreateDialog } from "./MotorbikeCreateDialog/MotorbikeCreateDialog";
import { MotorbikeDeleteDialog } from "./MotorbikeDeleteDialog/MotorbikeDeleteDialog";
import { MotorbikeEditDialog } from "./MotorbikeEditDialog/MotorbikeEditDialog";
import { getLocalStorage } from "../../../helpers/localStorageUtils";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FullScreenImg } from "../../../components/FullScreenImg/FullScreenImg";

export const Motorbike = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [allMotorbikes, setAllMotorbikes] = useState([]);
  const [selectedMotorbikeId, setSelectedMotorbikeId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [openImg, setOpenImg] = useState(false);
  const [imgSelected, setImgSelected] = useState();

  const tokenLocalStorage = getLocalStorage("token");
  const navigate = useNavigate();

  useEffect(() => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    axios
      .get(`http://localhost:3000/motorbikes/showallmotorbikes/${user_id}`)
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

  const handleOpenImg = (imgUrl) => {
    setImgSelected(imgUrl);
    setOpenImg(true);
  };

  const handleCloseImg = () => {
    setImgSelected();
    setOpenImg(false);
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container alignItems="center">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Mis motos
        </Typography>
      </Grid>
      <Grid item container direction="column" spacing={2}>
        {allMotorbikes.map((motorbike) => (
          <Grid
            key={motorbike?.motorbike_id}
            container
            spacing={1}
            marginTop="10px"
            marginLeft="20px"
            alignItems="center"
            direction="column"
            textAlign="center"
            borderRadius="20px"
            backgroundColor="#eeeeee"
            // Need to use it in a temporary way to align with the style
            style={{
              width: "calc(100% - 22px)",
            }}
          >
            <Grid item xs={3}>
              <img
                src={`http://localhost:3000/images/motorbikes/${motorbike.img}`}
                alt={motorbike.brand}
                style={{
                  maxWidth: "65%",
                  borderRadius: "20px",
                  objectFit: "cover",
                }}
                width="100%"
                onClick={() =>
                  handleOpenImg(
                    `http://localhost:3000/images/motorbikes/${motorbike.img}`
                  )
                }
              />
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
              <IconButton
                onClick={() => handleOpenEditDialog(motorbike.motorbike_id)}
              >
                <EditOutlinedIcon fontSize="large" style={{ color: "black" }} />
              </IconButton>
              <IconButton
                onClick={() => handleOpenDeleteDialog(motorbike.motorbike_id)}
              >
                <DeleteOutlineIcon
                  fontSize="large"
                  style={{ color: "black" }}
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
          onClick={handleOpenCreateDialog}
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
      <MotorbikeDeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDialog={handleCloseDialog}
        motorbike_id={selectedMotorbikeId}
      />
      <MotorbikeEditDialog
        openEditDialog={openEditDialog}
        handleCloseDialog={handleCloseDialog}
        motorbike_id={selectedMotorbikeId}
        setRefresh={setRefresh}
      />

      <FullScreenImg
        openImg={openImg}
        handleCloseImg={handleCloseImg}
        imgSelected={imgSelected}
      />
    </Grid>
  );
};
