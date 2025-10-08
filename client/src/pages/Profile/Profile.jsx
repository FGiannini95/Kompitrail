import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  TableCell,
  tableCellClasses,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { styled } from "@mui/material/styles";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// Utils
import { getLocalStorage } from "../../helpers/localStorageUtils";
import { RoutesString } from "../../routes/routes";
import {
  MOTORBIKES_URL,
  ROUTES_URL,
} from "../../../../server/config/serverConfig";
// Components
import { UserAvatar } from "../../components/UserAvatar/UserAvatar";

export const Profile = () => {
  const [motorbikesAnalytics, setMotorbikesAnalytics] = useState();
  const [createdRouteAnalytics, setCreatedRouteAnalytics] = useState();
  const tokenLocalStorage = getLocalStorage("token");
  const navigate = useNavigate();

  useEffect(() => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    axios
      .get(`${MOTORBIKES_URL}/motorbikes-analytics/${user_id}`)
      .then((res) => {
        setMotorbikesAnalytics(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    axios
      .get(`${ROUTES_URL}/createdroutes-analytics/${user_id}`)
      .then((res) => {
        setCreatedRouteAnalytics(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
        <UserAvatar />
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ p: "10px" }}
        >
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
        </Stack>
        <TableContainer
          style={{
            width: "95%",
            borderRadius: "10px",
            marginLeft: "10px",
            paddingTop: "10px",
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
                <StyledTableCell align="center">
                  {createdRouteAnalytics?.total_createdroutes}
                </StyledTableCell>
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
