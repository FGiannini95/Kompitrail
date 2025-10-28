import React from "react";
import { PhoneInput, defaultCountries } from "react-international-phone";
import "react-international-phone/style.css";

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// Utils
import { getInitials } from "../../../helpers/utils";

import { useEditUserForm } from "../../../hooks/useEditUserForm";

const countries = defaultCountries;

export const EditUser = () => {
  const {
    editUser,
    setEditUser,
    isLoading,
    save,
    photoPreview,
    setPhotoPreview,
    handleChange,
    handleConfirm,
    handleCancel,
  } = useEditUserForm();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  const initials = getInitials(editUser.name, editUser.lastname);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Update state with new file
      setEditUser((prevState) => ({
        ...prevState,
        photo: file,
        removePhoto: false,
      }));

      // Create visual preview of file
      const reader = new FileReader();

      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };

      // Start reading file as Data URL
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setEditUser((prevState) => ({
      ...prevState,
      photo: null,
      removePhoto: true,
    }));

    setPhotoPreview(null);
  };

  return (
    <Grid
      container
      direction="column"
      spacing={2}
      sx={{ px: 2, overflow: "hidden" }}
    >
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between">
        <IconButton onClick={handleCancel}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
        <Typography variant="h6">Modificar perfil</Typography>
        <Button
          variant="text"
          color="black"
          onClick={handleConfirm}
          disabled={!save}
        >
          Guardar
        </Button>
      </Grid>
      {/* Body */}
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        sx={{ width: "100%", maxWidth: "100%" }}
      >
        {/* Photo Section */}
        <Box sx={{ position: "relative" }}>
          <Grid
            sx={{
              width: 120,
              height: 120,
              border: "2px solid black",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Typography variant="h4">{initials}</Typography>
            )}
          </Grid>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              display: "flex",
              gap: 0.5,
            }}
          >
            <IconButton
              component="label"
              size="small"
              sx={{
                backgroundColor: "white",
                border: "1px solid black",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <EditOutlinedIcon fontSize="small" aria-hidden />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </IconButton>
            {(photoPreview || editUser.img) && (
              <IconButton
                size="small"
                onClick={handleRemovePhoto}
                sx={{
                  backgroundColor: "white",
                  border: "1px solid black",
                  "&:hover": {
                    backgroundColor: "#ffebee",
                  },
                }}
              >
                <DeleteOutlineIcon fontSize="small" aria-hidden color="error" />
              </IconButton>
            )}
          </Box>
        </Box>
      </Grid>

      {/* Name & lastname section */}
      <Grid size={12} sx={{ width: "100%", maxWidth: 400 }}>
        <TextField
          label="Nombre"
          name="name"
          variant="outlined"
          fullWidth
          value={editUser?.name || ""}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={12} sx={{ width: "100%", maxWidth: 400 }}>
        <TextField
          label="Apellidos"
          name="lastname"
          variant="outlined"
          fullWidth
          value={editUser?.lastname || ""}
          onChange={handleChange}
        />
      </Grid>
      {/* Phone section */}
      <Grid size={12} sx={{ width: "100%", maxWidth: 400 }}>
        <PhoneInput
          defaultCountry="es"
          value={editUser?.phonenumber || ""}
          onChange={(value) => {
            handleChange(value);
          }}
          countries={countries}
          style={{
            width: "100%",
            backgroundColor: "#f5f4f4",
            border: "1px solid rgba(0, 0, 0, 0.3)",
            borderRadius: "5px",
            fontFamily: "Arial, sans-serif",
            fontSize: "18px",
          }}
          inputStyle={{
            height: "56px",
            flex: "1",
          }}
          countrySelectorStyleProps={{
            buttonStyle: {
              height: "56px",
            },
          }}
        />
      </Grid>
    </Grid>
  );
};
