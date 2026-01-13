import React from "react";
import { useTranslation } from "react-i18next";

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
  readOnly = false,
  clearable = true,
  preventInvalidkey = false,
  endAdornment,
  maxLength,
  onClick,
  value: valueProp,
}) => {
  const formValue =
    name.split(".").reduce((acc, key) => acc?.[key], form) ?? "";
  // If valueProp is provided, use it. Otherwise, use the value from the form.
  const value = valueProp !== undefined ? valueProp : formValue;

  const { t } = useTranslation("errors");
  const errorKey = errors?.[name];
  const helperText = errorKey ? t(errorKey) : "";

  // Calculate the remaining worlds in the textarea
  const remaining = maxLength ? maxLength - value.length : null;
  // Add costum style
  const counterColor =
    remaining !== null && remaining <= 10 ? "red" : "inherit";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let next = value;
    if (type === "checkbox") next = checked;
    else if (type === "number") next = value;
    else if (value) {
      next = value.charAt(0).toUpperCase() + value.slice(1);
    }

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
    <>
      <TextField
        fullWidth
        label={label}
        name={name}
        value={value}
        onChange={handleChange}
        type={type}
        multiline={multiline}
        onKeyDown={handleKeyDown}
        error={!!errorKey}
        helperText={helperText}
        onClick={onClick}
        inputProps={{ readOnly, maxLength }}
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
      {maxLength && (
        <div
          style={{
            textAlign: "right",
            fontSize: "12px",
            color: counterColor,
            marginTop: "4px",
          }}
        >
          {remaining} / {maxLength}
        </div>
      )}
    </>
  );
};
