import React, { useEffect, useState } from "react";

import { PhoneInput, defaultCountries } from "react-international-phone";
import "react-international-phone/style.css";

//MUI
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

//MUI-ICONS
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getLocalStorage } from "../../../helpers/localStorageUtils";
import axios from "axios";
import { getInitials } from "../../../helpers/Utils";

//TODO: @julia El input de nombre y apellido tiene que tener el mismo tamaño con en las demás vistas (creo que le sobra un container), el código de teléfono tiene que tener todas las opciones, a ver si existe una manera para hacerlo), hay que usar axios para traer los datos del usuario, que rellenen los campo, refactorizar el código como en infouser(gridStyles). El button guardar se habilita sólo si cambia algún valor si vuelvo atrás reseteos los campos con el valor inicial. El button guardar ejecuta una sql de tipo update

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

  const { user_id } = jwtDecode(tokenLocalStorage).user;

  //Lógica en Utils.js
  const initials = getInitials(editUser.name, editUser.lastname);

  //Cargar información del usuario
  useEffect(() => {
    if (user_id) {
      axios
        .get(`http://localhost:3000/users/oneuser/${user_id}`)
        .then((res) => {
          setEditUser(res.data);
          setInitialValues(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user_id]);

  const handleChange = (e) => {
    // Diferenciar si es un evento o un valor directo
    if (e && e.target) {
      // Caso de un evento estándar de React
      const { name, value } = e.target;
      setEditUser((prevState) => ({ ...prevState, [name]: value }));
    } else {
      // Caso de un valor directo (PhoneInput)
      setEditUser((prevState) => ({ ...prevState, phonenumber: e }));
    }
  };

  //Cambiar imagen
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setEditUser((prevState) => ({
      ...prevState,
      photo: file,
    }));
  };

  //Confirmar cambios
  const handleConfirm = (e) => {
    e.preventDefault();
    console.log("cambios", editUser);

    const newFormData = new FormData();
    newFormData.append("editUser", JSON.stringify(editUser));

    console.log(JSON.stringify(editUser));

    if (editUser.photo) {
      newFormData.append("file", editUser.photo);
    }

    axios
      .put(`http://localhost:3000/users/edituser/${user_id}`, newFormData)
      .then((res) => {
        console.log("edituser", res.data);
        setEditUser(res.data);
        setInitialValues(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Comprobar si ha habido cambios
  useEffect(() => {
    if (editUser !== defaultValue && initialValues !== defaultValue) {
      setSave(JSON.stringify(editUser) !== JSON.stringify(initialValues));
    }
  }, [editUser, initialValues]);

  useEffect(() => {
    console.log("save:", save);
  }, [save]);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container alignItems="center" justifyContent="space-between">
        <IconButton onClick={() => navigate(-1)}>
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
        spacing={1}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid
          item
          xs={1}
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            marginTop: 2,
            width: 1 / 3,
            border: "1px solid black",
            borderRadius: "50%",
            aspectRatio: 1 / 1,
            backgroundColor: "green",
          }}
          onChange={handlePhotoChange}
        >
          <Typography sx={{}} variant="h4">
            {initials}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Nombre"
            name="name"
            variant="outlined"
            fullWidth
            value={editUser?.name || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Apellidos"
            name="lastname"
            variant="outlined"
            fullWidth
            value={editUser?.lastname || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={0} item xs={12} alignItems="center">
            {/* Select para el código de país */}
            <PhoneInput
              defaultCountry="es"
              phone={phone}
              onChange={(value) => {
                setPhone(value); // Actualiza el estado
                handleChange(value); // Ejecuta el valor
              }}
              countries={countries}
              value={editUser?.phonenumber || ""}
              style={{
                backgroundColor: "#f5f4f4",
                border: "1px solid rgba(0, 0, 0, 0.3)",
                borderRadius: "5px",
                fontFamily: "Arial, sans-serif",
                fontSize: "18px",
              }}
              inputStyle={{
                width: "178px",
                fontSize: "16px",
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
