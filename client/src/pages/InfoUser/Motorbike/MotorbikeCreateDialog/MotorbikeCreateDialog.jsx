import React, { useContext, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
// Utils
import { MOTORBIKES_URL } from "../../../../api";
//Providers
import { KompitrailContext } from "../../../../context/KompitrailContext";
import { useSnackbar } from "../../../../context/SnackbarContext/SnackbarContext";
import { useMotorbikes } from "../../../../context/MotorbikesContext/MotorbikesContext";

const initialValue = {
  brand: "",
  model: "",
  photo: null,
};

export const MotorbikeCreateDialog = () => {
  const [createOneMotorbike, setCreateOneMotorbike] = useState(initialValue);
  const [msgError, setMsgError] = useState("");
  const { user } = useContext(KompitrailContext);
  const { showSnackbar } = useSnackbar();
  const { createMotorbike, dialog, closeDialog } = useMotorbikes();
  const { t } = useTranslation(["dialogs", "forms", "buttons"]);

  const isOpen = dialog.isOpen && dialog.mode === "create";

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
    closeDialog();
    setCreateOneMotorbike(initialValue);
    setMsgError("");
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    // According to the ddbb, the brand is mandatory
    if (!createOneMotorbike.brand) {
      setMsgError("Tienes que insertar una marca");
      return;
    }
    if (!createOneMotorbike.model) {
      setMsgError("Tienes que insertar un modelo");
      return;
    }
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
      .post(`${MOTORBIKES_URL}/createmotorbike`, newFormData)
      .then(({ data }) => {
        createMotorbike(data);
        showSnackbar("Moto añadida con éxito");
        cleanDialog();
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Error al añadir la moto", "error");
      });
  };

  return (
    <Dialog open={isOpen} onClose={cleanDialog}>
      <DialogTitle>{t("dialogs:motorbikeCreateTitle")}</DialogTitle>
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
          label={t("forms:brandLabel")}
          fullWidth
          margin="normal"
          name="brand"
          value={createOneMotorbike.brand}
          onChange={handleChange}
          error={!!msgError}
          helperText={msgError}
        />
        <TextField
          label={t("forms:modelLabel")}
          fullWidth
          margin="normal"
          name="model"
          value={createOneMotorbike.model}
          onChange={handleChange}
          error={!!msgError}
          helperText={msgError}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={cleanDialog} color="error">
          {t("buttons:cancel")}
        </Button>
        <Button onClick={handleConfirm} color="success">
          {t("buttons:confirmar")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
