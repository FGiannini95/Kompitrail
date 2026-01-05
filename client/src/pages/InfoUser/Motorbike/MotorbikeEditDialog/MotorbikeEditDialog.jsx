import React, { useEffect, useState } from "react";
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
// Providers & Hooks
import { useSnackbar } from "../../../../context/SnackbarContext/SnackbarContext";
import { useMotorbikes } from "../../../../context/MotorbikesContext/MotorbikesContext";
import { normalizeMotorbikeName } from "../../../../helpers/motorbikeName";

const initialValue = {
  brand: "",
  model: "",
  photo: null,
};

const MOTORBIKE_NAME_REGEX = /^[\p{L}\p{N}]+([ -][\p{L}\p{N}]+)*$/u;

export const MotorbikeEditDialog = () => {
  const [editMotorbike, setEditMotorbike] = useState(initialValue);
  const [errors, setErrors] = useState({
    brand: "",
    model: "",
  });
  const { showSnackbar } = useSnackbar();
  const {
    editMotorbike: updateMotorbike,
    dialog,
    closeDialog,
  } = useMotorbikes();
  const { t } = useTranslation(["forms", "buttons", "dialogs", "snackbars"]);

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

    const newErrors = {
      brand: "",
      model: "",
    };

    // ALl fields must be filled
    const normalizedBrand = normalizeMotorbikeName(editMotorbike.brand);
    const normalizedModel = normalizeMotorbikeName(editMotorbike.model);

    if (!normalizedBrand) {
      newErrors.brand = t("errors:motorbike.brandRequired");
    } else if (!MOTORBIKE_NAME_REGEX.test(normalizedBrand)) {
      newErrors.brand = t("errors:motorbike.invalidChars");
    }

    if (!normalizedModel) {
      newErrors.model = t("errors:motorbike.modelRequired");
    } else if (!MOTORBIKE_NAME_REGEX.test(normalizedModel)) {
      newErrors.model = t("errors:motorbike.invalidChars");
    }

    // If there are errors, set them and stop
    if (newErrors.brand || newErrors.model) {
      setErrors(newErrors);
      return;
    }

    const newFormData = new FormData();
    newFormData.append(
      "editMotorbike",
      JSON.stringify({
        brand: normalizedBrand,
        model: normalizedModel,
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
        showSnackbar(t("snackbars:motorbikeUpdatedSuccess"));
        closeDialog();
      })
      .catch((err) => {
        console.log(err);
        showSnackbar(t("snackbars:motorbikeUpdatedError"), "error");
      });
  };

  return (
    <Dialog open={isOpen} onClose={cleanDialog}>
      <DialogTitle>{t("dialogs:motorbikeEditTitle")}</DialogTitle>
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
          label={t("forms:brandLabel")}
          fullWidth
          margin="normal"
          name="brand"
          value={editMotorbike?.brand || ""}
          onChange={handleChange}
          error={!!errors.brand}
          helperText={errors.brand}
        />
        <TextField
          label={t("forms:modelLabel")}
          fullWidth
          margin="normal"
          name="model"
          value={editMotorbike?.model || ""}
          onChange={handleChange}
          error={!!errors.model}
          helperText={errors.model}
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
