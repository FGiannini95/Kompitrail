import React, { useState } from "react";

// MUI
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

// MUI-ICONS
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { FullScreenImg } from "../../../../components/FullScreenImg/FullScreenImg";

export const MotorbikeCard = ({
  brand,
  model,
  img,
  handleOpenEditDialog,
  handleOpenDeleteDialog,
  motorbike_id,
}) => {
  const [openImg, setOpenImg] = useState(false);

  const handleOpenImg = () => {
    setOpenImg(true);
  };

  const handleCloseImg = () => {
    setOpenImg(false);
  };

  return (
    <>
      <Card
        sx={{ maxWidth: 345, backgroundColor: "#eeeeee", borderRadius: "20px" }}
      >
        <CardMedia
          sx={{ height: 140 }}
          image={img}
          title="motorbike"
          onClick={handleOpenImg}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {brand}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {model}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton onClick={() => handleOpenEditDialog(motorbike_id)}>
            <EditOutlinedIcon fontSize="medium" style={{ color: "black" }} />
          </IconButton>
          <IconButton onClick={() => handleOpenDeleteDialog(motorbike_id)}>
            <DeleteOutlineIcon
              fontSize="medium"
              style={{ color: "black", ml: 0 }}
            />
          </IconButton>
        </CardActions>
      </Card>
      <FullScreenImg open={openImg} onClose={handleCloseImg} img={img} />
    </>
  );
};
