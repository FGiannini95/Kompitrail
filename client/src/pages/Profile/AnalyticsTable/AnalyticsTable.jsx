import React from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Loading } from "../../../components/Loading/Loading";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.kompitrail.card,
    color: theme.palette.text.primary,
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
    border: `2px solid ${theme.palette.kompitrail.card}`,
  },
}));

export const AnalyticsTable = ({
  motorbikes,
  createdRoutes,
  joinedRoutes,
  loading,
}) => {
  return (
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
            <StyledTableCell align="center">Rutas completadas</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow>
            <StyledTableCell align="center">
              {loading ? <Loading /> : motorbikes || 0}
            </StyledTableCell>
            <StyledTableCell align="center">
              {loading ? <Loading /> : createdRoutes || 0}
            </StyledTableCell>
            <StyledTableCell align="center">
              {loading ? <Loading /> : joinedRoutes || 0}
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
