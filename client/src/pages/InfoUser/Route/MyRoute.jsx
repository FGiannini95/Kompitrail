import React, { useEffect, useState } from "react";

// MUI
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

// MUI-ICONS
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import { useNavigate } from "react-router-dom";
import { RoutesString } from "../../../routes/routes";
import { RouteCard } from "./RouteCard/RouteCard";
import { getLocalStorage } from "../../../helpers/localStorageUtils";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ROUTES_URL } from "../../../../../server/config/serverConfig";

export const MyRoute = () => {
  const [allRoutesOneUser, setAllRoutesOneUser] = useState([]);
  const navigate = useNavigate();
  const tokenLocalStorage = getLocalStorage("token");

  useEffect(() => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    axios
      .get(`${ROUTES_URL}/showallroutesoneuser/${user_id}`)
      .then((res) => {
        setAllRoutesOneUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleOpenCreateRoute = () => {
    navigate(RoutesString.createTrip);
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container alignItems="center">
        <IconButton onClick={() => navigate(RoutesString.infouser)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
        <Typography variant="h6">Mis rutas</Typography>
      </Grid>
      {/* Map allRoute and display in a card, divide between active and old ones */}
      <Grid item container direction="column" spacing={2}>
        {allRoutesOneUser.map((route) => (
          <Grid
            key={route?.routes_id}
            container
            spacing={1}
            sx={{
              marginTop: "10px",
              marginLeft: "45px",
              width: "100%",
              textAlign: "center",
            }}
          >
            <Grid item xs={12}>
              {/* We pass down all the props */}
              <RouteCard {...route} />
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid item>
        <Button
          type="button"
          variant="outlined"
          fullWidth
          onClick={handleOpenCreateRoute}
          sx={{
            color: "black",
            borderColor: "#eeeeee",
            borderWidth: "2px",
            "&:hover": {
              borderColor: "#dddddd",
              borderWidth: "1px",
            },
          }}
        >
          Crar Ruta
          <AddOutlinedIcon style={{ paddingLeft: "5px", width: "20px" }} />
        </Button>
      </Grid>
    </Grid>
  );
};
