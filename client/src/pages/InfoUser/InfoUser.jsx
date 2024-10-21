import React, { useContext, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { KompitrailContext } from "../../../context/KompitrailContext";
// import axios from "axios";

// Importacion de iconos
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import WalletIcon from "@mui/icons-material/Wallet";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export const InfoUser = () => {
  const { user } = useContext(KompitrailContext);

  const getInitials = (name, lastname) => {
    const firstLetterName = name?.charAt(0).toUpperCase() || "";
    const firstLetterLastName = lastname?.charAt(0).toUpperCase() || "";

    return `${firstLetterName}${firstLetterLastName}`;
  };

  const iniciales = getInitials(user.name, user.lastname);

  return (
    <div style={{ paddingTop: "100px" }}>
      <Grid>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Info User
            </Typography>
            <Typography variant="h6">Lorem, ipsum.</Typography>
          </Grid>
          <Grid
            item
            xs={3}
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{
              border: "1px solid black",
              borderRadius: "50%",
            }}
            style={{ paddingTop: "0px", paddingLeft: "0px" }}
          >
            <Typography sx={{}} variant="h4">
              {iniciales}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          style={{ paddingTop: "25px", paddingLeft: "15px" }}
        >
          <Grid style={{ paddingRight: "10px" }}>
            <Button type="button" variant="contained" color="primary" fullWidth>
              Lorem, ipsum.
            </Button>
          </Grid>
          <Grid>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              fullWidth
            >
              Lorem, ipsum dolor.
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid style={{ paddingTop: "40px" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Lorem, ipsum dolor.
        </Typography>
        <Grid>
          <Grid container spacing={3}>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <AccountCircleIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Lorem, ipsum.
              </Typography>
              <Typography variant="h6">Lorem, ipsum dolor.</Typography>
            </Grid>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <ArrowForwardIosIcon />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <DirectionsBikeIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Lorem, ipsum.
              </Typography>
              <Typography variant="h6">Lorem, ipsum dolor.</Typography>
            </Grid>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <ArrowForwardIosIcon />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <WalletIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Lorem, ipsum.
              </Typography>
              <Typography variant="h6">Lorem, ipsum dolor.</Typography>
            </Grid>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <ArrowForwardIosIcon />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <SettingsSharpIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Lorem, ipsum.
              </Typography>
              <Typography variant="h6">Lorem, ipsum dolor.</Typography>
            </Grid>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <ArrowForwardIosIcon />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid style={{ paddingTop: "40px" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Lorem, ipsum dolor.
        </Typography>
        <Grid>
          <Grid container spacing={3}>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <TextsmsOutlinedIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Lorem, ipsum.
              </Typography>
              <Typography variant="h6">Lorem, ipsum dolor.</Typography>
            </Grid>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <ArrowForwardIosIcon />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <InfoOutlinedIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Lorem, ipsum.
              </Typography>
              <Typography variant="h6">Lorem, ipsum dolor.</Typography>
            </Grid>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <ArrowForwardIosIcon />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
