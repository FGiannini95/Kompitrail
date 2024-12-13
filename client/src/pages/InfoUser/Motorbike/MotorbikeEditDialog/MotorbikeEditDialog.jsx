import React, { useEffect, useState } from "react";

// MUI
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

// MUI-ICONS
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

import axios from "axios";

const initialValue = {
  brand: "",
  model: "",
  photo: null,
};

export const MotorbikeEditDialog = ({
  openEditDialog,
  handleCloseDialog,
  motorbike_id,
  setRefresh,
}) => {
  const [editMotorbike, setEditMotorbike] = useState(initialValue);

  useEffect(() => {
    // We call the useEffect only if we open the dialog
    if (openEditDialog && motorbike_id) {
      axios
        .get(`http://localhost:3000/motorbikes/onemotorbike/${motorbike_id}`)
        .then((res) => {
          const {
            motorbike_brand: brand,
            motorbike_model: model,
            img: photo,
          } = res.data;
          setEditMotorbike({ brand, model, photo });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [openEditDialog, motorbike_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditMotorbike((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]; // This is a File object
    setEditMotorbike((prevState) => ({
      ...prevState,
      photo: file, // Photo now holds a File object
    }));
  };

  const cleanDialog = () => {
    handleCloseDialog();
    setEditMotorbike(initialValue);
  };

  const handleConfirm = (e) => {
    e.preventDefault();

    // ALl fields must be filled
    if (!editMotorbike.brand.trim() || !editMotorbike.model.trim()) {
      return;
    }

    const newFormData = new FormData();
    newFormData.append(
      "editMotorbike",
      JSON.stringify({
        brand: editMotorbike.brand,
        model: editMotorbike.model,
      })
    );

    if (editMotorbike.photo) {
      newFormData.append("file", editMotorbike.photo);
    }

    axios
      .put(
        `http://localhost:3000/motorbikes/editmotorbike/${motorbike_id}`,
        newFormData
      )
      .then((res) => {
        console.log("res.data in editmotorbike", res.data);
        setRefresh((prev) => !prev);
        handleCloseDialog();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log("editMotorbike", editMotorbike);

  return (
    <Dialog open={openEditDialog} onClose={handleCloseDialog}>
      <DialogTitle>Editar moto</DialogTitle>
      <DialogContent>
        <Button
          variant="text"
          component="label"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          <FileUploadOutlinedIcon />
          {/* The photo property of editMotorbike can either be a string or a file */}
          {
            editMotorbike?.photo instanceof File
              ? editMotorbike.photo.name // If it's a File, display the full file name
              : editMotorbike.photo // If it's a string (like the default image)
                ? editMotorbike.photo.includes("-")
                  ? editMotorbike.photo.split("-").slice(2).join("-") // If it has an ID, extract the name from the second '-'
                  : editMotorbike.photo // If it has no ID, display the full string
                : "Photo" // Placeholder text if no photo exists
          }
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
          value={editMotorbike?.brand || ""}
          onChange={handleChange}
        />
        <TextField
          label="Modelo"
          fullWidth
          margin="normal"
          name="model"
          value={editMotorbike?.model || ""}
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
