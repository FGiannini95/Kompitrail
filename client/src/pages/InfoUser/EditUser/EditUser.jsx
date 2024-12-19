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

//TODO: @julia El input de nombre y apellido tiene que tener el mismo tamaño con en las demás vistas (creo que le sobra un container), el código de teléfono tiene que tener todas las opciones, a ver si existe una manera para hacerlo), hay que usar axios para traer los datos del usuario, que rellenen los campo, refactorizar el código como en infouser(gridStyles). El button guardar se habilita sólo si cambia algún valor si vuelvo atrás reseteos los campos con el valor inicial. El button guardar ejecuta una sql de tipo update

const countries = defaultCountries;

const initialValue = {
  name: "",
  lastname: "",
  phonenumber: null,
  photo: null,
};

export const EditUser = () => {
  const tokenLocalStorage = getLocalStorage("token");
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [editUser, setEditUser] = useState(initialValue);

  useEffect(() => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;

    if (user_id) {
      axios
        .get(`http://localhost:3000/users/oneuser/${user_id}`)
        .then((res) => {
          setEditUser(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container alignItems="center" justifyContent="space-between">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
        <Typography variant="h6">Modificar perfil</Typography>
        <Button variant="text" color="black" disabled>
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
        >
          <Typography sx={{}} variant="h4">
            Pic here
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Nombre"
            variant="outlined"
            fullWidth
            value={editUser?.name || ""}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Apellidos"
            variant="outlined"
            fullWidth
            value={editUser?.lastname || ""}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={0} item xs={12} alignItems="center">
            {/* Select para el código de país */}
            <PhoneInput
              defaultCountry="es"
              phone={phone}
              onChange={setPhone}
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
