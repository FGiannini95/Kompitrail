import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import axios from "axios";
import { KompitrailContext } from "../../../../context/KompitrailContext";

const initialValue = {
  brand: "",
  model: "",
  photo: null,
};

export const MotorbikeDialog = ({ openDialog, handleCloseDialog }) => {
  const [createOneMotorbike, setCreateOneMotorbike] = useState(initialValue);
  const [msgError, setMsgError] = useState("");
  const { user } = useContext(KompitrailContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateOneMotorbike((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setCreateOneMotorbike((prevState) => ({
      ...prevState,
      photo: file,
    }));
  };

  const cleanDialog = () => {
    handleCloseDialog();
    setCreateOneMotorbike(initialValue);
  };

  const handleConfirm = (e) => {
    e.preventDefault();

    if (!createOneMotorbike.brand) {
      setMsgError("Tienes que insertar una marca");
      return;
    }
    console.log(createOneMotorbike);
    // We use this interface in order to pass data throught the HTTP protocol
    const newFormData = new FormData();
    // The append method add a new field to the interface
    newFormData.append(
      "createMotorbike",
      JSON.stringify({
        brand: createOneMotorbike.brand,
        model: createOneMotorbike.model,
        user_id: user.user_id,
      })
    );

    if (createOneMotorbike.photo) {
      newFormData.append("file", createOneMotorbike.photo);
    }

    axios
      .post("http://localhost:3000/motorbikes/createmotorbike", newFormData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setCreateOneMotorbike(initialValue);
    cleanDialog();
  };

  return (
    <Dialog open={openDialog} onClose={cleanDialog}>
      <DialogTitle>Añadir moto</DialogTitle>
      <DialogContent>
        <Button
          variant="text"
          component="label"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          <FileUploadOutlinedIcon />
          {createOneMotorbike.photo
            ? `${createOneMotorbike.photo.name}`
            : "Foto"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handlePhotoChange}
          />
        </Button>
        <TextField
          label="Marca"
          fullWidth
          margin="normal"
          name="brand"
          value={createOneMotorbike.brand}
          onChange={handleChange}
          error={!!msgError}
          helperText={msgError}
        />
        <TextField
          label="Modelo"
          fullWidth
          margin="normal"
          name="model"
          value={createOneMotorbike.model}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={cleanDialog} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="secondary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
