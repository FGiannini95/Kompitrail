import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export const CardPlaceholder = ({ text }) => {
  return (
    <Card
      sx={{
        width: "100%",
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
        <Typography>{text}</Typography>
      </CardContent>
    </Card>
  );
};
