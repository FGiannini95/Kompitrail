import React, { useState } from "react";

import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { FullScreenImg } from "../../../../components/FullScreenImg/FullScreenImg";

export const MotorbikeCard = ({
  brand,
  model,
  motorbike_id,
  img,
  onEdit,
  onDelete,
}) => {
  const [openImg, setOpenImg] = useState(false);
  const handleOpenImg = () => setOpenImg(true);
  const handleCloseImg = () => setOpenImg(false);

  return (
    <>
      <Card
        sx={(theme) => ({
          width: "100%",
          bgcolor: theme.palette.kompitrail.card,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
        })}
      >
        <CardMedia
          component="img"
          sx={{ height: 180, objectFit: "cover" }}
          image={img}
          title="motorbike"
          onClick={handleOpenImg}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {brand}
          </Typography>
          <Typography
            variant="body2"
            sx={(theme) => ({
              color: theme.palette.text.secondary,
            })}
          >
            {model}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton onClick={() => onEdit?.(motorbike_id)}>
            <EditOutlinedIcon
              fontSize="medium"
              aria-hidden
              sx={(theme) => ({
                color: theme.palette.text.primary,
              })}
            />
          </IconButton>
          <IconButton onClick={() => onDelete?.(motorbike_id)}>
            <DeleteOutlineIcon
              fontSize="medium"
              aria-hidden
              sx={(theme) => ({
                color: theme.palette.text.primary,
                ml: 0,
              })}
            />
          </IconButton>
        </CardActions>
      </Card>
      <FullScreenImg open={openImg} onClose={handleCloseImg} img={img} />
    </>
  );
};
