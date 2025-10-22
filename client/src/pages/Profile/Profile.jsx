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
  Typography,
  CardContent,
  Card,
  Avatar,
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
import { UserRoutesCarousel } from "../InfoUser/Route/UserRoutesCarousel/UserRoutesCarousel";
import { useRoutes } from "../../context/RoutesContext/RoutesContext";
import { RouteEditDialog } from "../InfoUser/Route/RouteEditDialog/RouteEditDialog";

export const Profile = () => {
  const [motorbikesAnalytics, setMotorbikesAnalytics] = useState();
  const [createdRouteAnalytics, setCreatedRouteAnalytics] = useState();
  const [joinedRouteAnalytics, setJoinedRouteAnalytics] = useState();
  const { allRoutes } = useRoutes();
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

  useEffect(() => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    axios
      .get(`${ROUTES_URL}/joinedroutes-analytics/${user_id}`)
      .then((res) => {
        setJoinedRouteAnalytics(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#eeeeee",
      color: "inherit",
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
      backgroundColor: "transparent",
      border: "2px solid #eeeeee",
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
                <StyledTableCell align="center">Nº de motos</StyledTableCell>
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
                <StyledTableCell align="center">
                  {joinedRouteAnalytics?.total_joinedroutes}
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid sx={{ width: "95%", marginLeft: "10px", marginTop: "10px" }}>
        <UserRoutesCarousel allRoutes={allRoutes} />
      </Grid>
      <Grid sx={{ width: "95%", marginLeft: "10px", marginTop: "10px" }}>
        <Typography>Personas con las que viajas más</Typography>
        <Card
          sx={{
            width: "50%",
            bgcolor: "#eeeeee",
            borderRadius: 2,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar />
            <Typography>{"Nome"}</Typography>
            <Typography>{"# rutas en común"}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <RouteEditDialog />
    </Box>
  );
};
