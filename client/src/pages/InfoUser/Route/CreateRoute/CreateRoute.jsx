import React from "react";

// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { TextareaAutosize } from "@mui/material";

// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// MUI-ICONS
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import { useNavigate } from "react-router-dom";

export const CreateRoute = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    // <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box
      style={{
        backgroundColor: "#fafafa",
        paddingTop: "25px",
      }}
    >
      <Grid container spacing={2}>
        <Grid>
          <CloseOutlinedIcon
            style={{ paddingLeft: "20px" }}
            onClick={handleCancel}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Nombre ruta"
            name="email"
            fullWidth
            // onChange={handleChange}
            // error={!!msgError.email}
            // helperText={msgError.email}
          />
        </Grid>
        {/* TODO: tiene que ser a través de una api, se necesita la ubicación */}
        <Grid item xs={12}>
          <TextField label="Salida" name="email" fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField label="LLegada" name="email" fullWidth />
        </Grid>
        {/* <Grid item xs={12}>
            <DatePicker label="Basic date picker" />
          </Grid> */}
        <Grid item xs={4}>
          <TextField label="Km" name="email" fullWidth />
        </Grid>
        <Grid
          item
          xs={8}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>¿Primera vez en esta ruta?</Typography>
          <Checkbox
            // checked={checked}
            // onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
            color="default"
          />
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            disablePortal
            options={[]}
            renderInput={(params) => <TextField {...params} label="Nivel" />}
          />
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            disablePortal
            options={[]}
            renderInput={(params) => <TextField {...params} label="Pilotos" />}
          />
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            disablePortal
            options={[]}
            renderInput={(params) => <TextField {...params} label="Duración" />}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            options={[]}
            renderInput={(params) => (
              <TextField {...params} label="Motos aptas" />
            )}
          />
        </Grid>
        {/* TODO: Add a good and detailed placeholder */}
        <Grid item xs={12}>
          <TextField
            label="Descripción"
            name="description"
            fullWidth
            multiline
            minRows={6}
            InputProps={{
              inputComponent: TextareaAutosize,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              color: "black",
              boxShadow: "none",
              backgroundColor: "#eeeeee",
              "&:hover": { backgroundColor: "#dddddd" },
            }}
          >
            ACEPTAR
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="button"
            variant="outlined"
            sx={{
              color: "black",
              borderColor: "#eeeeee",
              borderWidth: "2px",
              "&:hover": {
                borderColor: "#dddddd",
                borderWidth: "2px",
              },
            }}
            fullWidth
            onClick={handleCancel}
          >
            CANCELAR
          </Button>
        </Grid>
      </Grid>
    </Box>
    // </LocalizationProvider>
  );
};
