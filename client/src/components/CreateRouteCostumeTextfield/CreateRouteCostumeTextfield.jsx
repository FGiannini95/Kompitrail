import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
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
      endAdornment: value ? (
        <InputAdornment position="end">
          <ClearIcon onClick={onClear} sx={{ cursor: "pointer" }} />
        </InputAdornment>
      ) : null,
    }}
  />
);
