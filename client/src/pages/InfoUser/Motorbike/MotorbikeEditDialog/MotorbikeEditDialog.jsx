import React, { useEffect, useState } from "react";
import axios from "axios";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
// Utils
import { MOTORBIKES_URL } from "../../../../../../server/config/serverConfig";
// Providers
import { useSnackbar } from "../../../../context/SnackbarContext/SnackbarContext";
import { useMotorbikes } from "../../../../context/MotorbikesContext/MotorbikesContext";

const initialValue = {
  brand: "",
  model: "",
  photo: null,
};

export const MotorbikeEditDialog = () => {
  const [editMotorbike, setEditMotorbike] = useState(initialValue);
  const { showSnackbar } = useSnackbar();
  const {
    editMotorbike: updateMotorbike,
    dialog,
    closeDialog,
  } = useMotorbikes();

  const isOpen = dialog.isOpen && dialog.mode === "edit";
  const motorbike_id = dialog.selectedId;

  useEffect(() => {
    // We call the useEffect only if we open the dialog
    if (isOpen && motorbike_id) {
      axios
        .get(`${MOTORBIKES_URL}/onemotorbike/${motorbike_id}`)
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
  }, [isOpen, motorbike_id]);

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
    closeDialog();
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
      .put(`${MOTORBIKES_URL}/editmotorbike/${motorbike_id}`, newFormData)
      .then(() => axios.get(`${MOTORBIKES_URL}/onemotorbike/${motorbike_id}`))
      .then(({ data }) => {
        const update = Array.isArray(data) ? data[0] : data;
        updateMotorbike(update);
        showSnackbar("Moto actualizada con éxito");
        closeDialog();
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Error al actualizar la moto", "error");
      });
  };

  return (
    <Dialog open={isOpen} onClose={cleanDialog}>
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
        <Button onClick={cleanDialog} color="error">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="success">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
