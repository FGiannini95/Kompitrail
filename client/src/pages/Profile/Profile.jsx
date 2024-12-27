import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getLocalStorage } from "../../helpers/localStorageUtils";
import { Box, Button, Grid, Typography } from "@mui/material";
import { KompitrailContext } from "../../context/KompitrailContext";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useNavigate } from "react-router-dom";
import { RoutesString } from "../../routes/routes";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { capitalizeFullName, getInitials } from "../../helpers/utils";

export const Profile = () => {
  const { user } = useContext(KompitrailContext);
  const [motorbikesAnalytics, setMotorbikesAnalytics] = useState();
  const tokenLocalStorage = getLocalStorage("token");
  const navigate = useNavigate();

  useEffect(() => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    axios
      .get(`http://localhost:3000/motorbikes/motorbikes-analytics/${user_id}`)
      .then((res) => {
        setMotorbikesAnalytics(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const iniciales = getInitials(user.name, user.lastname);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontSize: 16,
      padding: "8px",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
      padding: "8px",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    // "&:last-child td, &:last-child th": {
    //   border: 0,
    // },
  }));

  return (
    <Box
      style={{
        backgroundColor: "#fafafa",
        paddingTop: "25px",
      }}
    >
      <Grid>
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
              width: 1 / 3,
              border: "2px solid black",
              borderRadius: "50%",
              aspectRatio: 1 / 1,
            }}
            style={{ paddingTop: "0px", paddingLeft: "0px" }}
          >
            <Typography sx={{}} variant="h4">
              {iniciales}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {capitalizeFullName(user.name, user.lastname)}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          spacing={2}
          style={{
            paddingTop: "25px",
            paddingLeft: "20px",
            marginBottom: "30px",
          }}
        >
          <Grid style={{ paddingRight: "10px" }}>
            <Button
              type="button"
              variant="contained"
              sx={{
                color: "black",
                boxShadow: "none",
                backgroundColor: "#eeeeee",
                "&:hover": { backgroundColor: "#dddddd" },
              }}
              fullWidth
            >
              Ir a premium
            </Button>
          </Grid>
          <Grid>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={() => navigate(RoutesString.editUser)}
              sx={{
                color: "black",
                borderColor: "#eeeeee",
                borderWidth: "2px",
                "&:hover": {
                  borderColor: "#dddddd",
                  borderWidth: "2px",
                },
              }}
            >
              Modificar Perfil
              <EditOutlinedIcon style={{ paddingLeft: "5px", width: "20px" }} />
            </Button>
          </Grid>
        </Grid>

        <TableContainer
          style={{
            width: "95%",
            borderRadius: "10px",
            marginLeft: "10px",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">
                  Número de motos
                </StyledTableCell>
                <StyledTableCell align="center">Rutas creadas</StyledTableCell>
                <StyledTableCell align="center">
                  Rutas participantes
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell align="center">
                  {motorbikesAnalytics?.total_motorbikes}
                </StyledTableCell>
                <StyledTableCell align="center">0</StyledTableCell>
                <StyledTableCell align="center">0</StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <p>
        la opción de elegir entre rutas creadas y ruta participadas (habrá un
        pequeñoi resumen con la info más importante)
      </p>
      <p>el listado de las mismas. Si no hay ruta, icono más mensaje</p>
      {/* import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined'; */}
    </Box>
  );
};
