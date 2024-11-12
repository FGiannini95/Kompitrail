import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
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

  const handleConfirm = () => {
    // We use this interface in order to pass data throught the HTTP protocol
    const newFormData = new FormData();
    // The append methid add a new field to the interface
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
    handleCloseDialog();
  };

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
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
            ? `Foto: ${createOneMotorbike.photo.name}`
            : "Foto"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handlePhotoChange}
          />
        </Button>
        {/* TODO: according to the database, the brand is mandatory while the model could be null */}
        <TextField
          label="Marca"
          fullWidth
          margin="normal"
          name="brand"
          value={createOneMotorbike.brand}
          onChange={handleChange}
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
        <Button onClick={handleCloseDialog} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="secondary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
