import React from "react";
import { TextField, InputAdornment } from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";

export const CreateRouteCostumeTextfield = ({
  label,
  name,
  value,
  onChange,
  onClear,
  error,
  helperText,
  type = "text",
}) => (
  <TextField
    label={label}
    name={name}
    fullWidth
    value={value}
    onChange={onChange}
    type={type}
    error={error}
    helperText={helperText}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <ClearIcon
            onClick={onClear}
            sx={{
              cursor: "pointer",
              visibility: value ? "visible" : "hidden",
            }}
          />
        </InputAdornment>
      ),
    }}
  />
);
