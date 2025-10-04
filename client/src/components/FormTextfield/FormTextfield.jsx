import React from "react";
import { InputAdornment, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

export const FormTextfield = ({
  form,
  setForm,
  errors,
  setErrors,
  name,
  label,
  type = "text",
  multiline = false,
  minRows,
  readOnly = false,
  clearable = true,
  preventInvalidkey = false,
  endAdornment,
}) => {
  const value = form?.[name] ?? "";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let next = value;
    if (type === "checkbox") next = checked;
    else if (type === "number") next = value;

    setForm((prev) => ({ ...prev, [name]: next }));

    // Remove errors
    if (setErrors && errors?.[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleClear = () => {
    setForm((prev) => ({ ...prev, [name]: "" }));
  };

  // We need this to avoid HTML default behavior
  // The letter "e" is used for scientific notation, such as 1e5 (equivalent to 100000)
  const handleKeyDown = preventInvalidkey
    ? (e) => {
        if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
          e.preventDefault(); // Block these buttons
        }
      }
    : undefined;

  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={handleChange}
      type={type}
      multiline={multiline}
      minRows={minRows}
      onKeyDown={handleKeyDown}
      error={!!errors?.[name]}
      helperText={errors?.[name] ?? ""}
      inputProps={{ readOnly }}
      InputProps={{
        endAdornment:
          endAdornment ||
          (clearable ? (
            <InputAdornment
              position="end"
              sx={{ minWidth: 36, display: "flex", justifyContent: "center" }}
            >
              <ClearIcon
                onClick={handleClear}
                sx={{
                  cursor: "pointer",
                  visibility: value ? "visible" : "hidden",
                }}
              />
            </InputAdornment>
          ) : undefined),
      }}
    />
  );
};
