import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
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

  return (
    <Dialog open={openEditDialog} onClose={handleCloseDialog}>
      <DialogTitle>Editar moto</DialogTitle>
      <DialogContent>
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
