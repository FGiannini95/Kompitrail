import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { PhoneInput, defaultCountries } from "react-international-phone";
import "react-international-phone/style.css";

import { Button, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// Utils
import { getLocalStorage } from "../../../helpers/localStorageUtils";
import { RoutesString } from "../../../routes/routes";
import { KompitrailContext } from "../../../context/KompitrailContext";
import { getInitials } from "../../../helpers/utils";

const countries = defaultCountries;

const defaultValue = {
  name: "",
  lastname: "",
  phonenumber: null,
  photo: null,
};

export const EditUser = () => {
  const tokenLocalStorage = getLocalStorage("token");
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [save, setSave] = useState(false);
  const [editUser, setEditUser] = useState(defaultValue);
  const [initialValues, setInitialValues] = useState(defaultValue);
  const { setUser } = useContext(KompitrailContext);

  const { user_id } = jwtDecode(tokenLocalStorage).user;

  const initials = getInitials(editUser.name, editUser.lastname);

  useEffect(() => {
    if (user_id) {
      axios
        .get(`http://localhost:3000/users/oneuser/${user_id}`)
        .then((res) => {
          setEditUser(res.data);
          setInitialValues(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user_id]);

  const handleChange = (e) => {
    if (e && e.target) {
      // React event
      const { name, value } = e.target;

      const nextValue =
        typeof value === "string" && value.length > 0 && name !== "phonenumber"
          ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
          : value;
      setEditUser((prevState) => ({ ...prevState, [name]: nextValue }));
    } else {
      // Direct value - PhoneInput
      setEditUser((prevState) => ({ ...prevState, phonenumber: e }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setEditUser((prevState) => ({
      ...prevState,
      photo: file,
    }));
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    setUser((prev) =>
      prev
        ? { ...prev, name: editUser.name, lastname: editUser.lastname }
        : prev
    );

    const newFormData = new FormData();
    newFormData.append("editUser", JSON.stringify(editUser));

    if (editUser.photo) {
      newFormData.append("file", editUser.photo);
    }

    axios
      .put(`http://localhost:3000/users/edituser/${user_id}`, newFormData)
      .then((res) => {
        setEditUser(res.data);
        setInitialValues(res.data);
        setUser(res.data);
        // Hard refresh to display the proper data
        window.location.replace(RoutesString.profile);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancel = () => {
    setEditUser(initialValues);
    navigate(-1);
  };

  useEffect(() => {
    if (editUser !== defaultValue && initialValues !== defaultValue) {
      setSave(JSON.stringify(editUser) !== JSON.stringify(initialValues));
    }
  }, [editUser, initialValues]);

  return (
    <Grid
      container
      direction="column"
      spacing={2}
      sx={{ px: 2, overflow: "hidden" }}
    >
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
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        sx={{ width: "100%", maxWidth: "100%" }}
      >
        <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid
            sx={{
              width: 120,
              height: 120,
              border: "2px solid black",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onChange={handlePhotoChange}
          >
            <Typography variant="h4">{initials}</Typography>
          </Grid>
        </Grid>
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
        <Grid size={12} sx={{ width: "100%", maxWidth: 400 }}>
          <PhoneInput
            defaultCountry="es"
            value={editUser?.phonenumber || ""}
            onChange={(value) => {
              setPhone(value);
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
    </Grid>
  );
};
