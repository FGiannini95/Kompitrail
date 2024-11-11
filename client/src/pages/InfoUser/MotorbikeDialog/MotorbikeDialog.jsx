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
};

export const MotorbikeDialog = ({ openDialog, handleCloseDialog }) => {
  const [createOneMotorbike, setCreateOneMotorbike] = useState(initialValue);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [photo, setPhoto] = useState();
  const { user } = useContext(KompitrailContext);

  const handleConfirm = () => {
    console.log("Moto añadida:", { brand, model });

    const newFormData = new FormData();

    let data = { ...createOneMotorbike, uder_id: user.user_id };
    newFormData.append("createMotorbike", JSON.stringify(data));

    axios
      .post("http://localhost:3000/motorbikes/createmotorbike", newFormData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setBrand("");
    setModel("");
    handleCloseDialog();
  };

  //TODO: NOT SURE IT IS THE CORRECT WAY.
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
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
          {photo ? `Foto: ${photo.name}` : "Foto"}
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
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <TextField
          label="Modelo"
          fullWidth
          margin="normal"
          value={model}
          onChange={(e) => setModel(e.target.value)}
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
