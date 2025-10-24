import React from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  tableCellClasses,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(() => ({
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

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "transparent",
    border: "2px solid #eeeeee",
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
              {loading ? <CircularProgress size={20} /> : motorbikes || 0}
            </StyledTableCell>
            <StyledTableCell align="center">
              {loading ? <CircularProgress size={20} /> : createdRoutes || 0}
            </StyledTableCell>
            <StyledTableCell align="center">
              {loading ? <CircularProgress size={20} /> : joinedRoutes || 0}
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
