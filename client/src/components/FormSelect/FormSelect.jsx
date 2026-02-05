import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export const FormSelect = ({
  form,
  setForm,
  errors,
  setErrors,
  name,
  label,
  options = [],
  optionLabelKey = "name",
  optionValueKey = "id",
  getOptionLabel,
  disabled = false,
}) => {
  const { t } = useTranslation("errors");

  const value = form?.[name] ?? "";
  const errorKey = errors?.[name];
  const helperText = errorKey ? t(errorKey) : "";

  const handleChange = (e) => {
    const next = e.target.value;
    setForm((prev) => ({ ...prev, [name]: next }));

    if (setErrors && errors?.[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // This function resolves the option label using either getOptionLabel or a key.
  const resolveLabel = (opt) => {
    if (getOptionLabel) return getOptionLabel(opt);
    return opt?.[optionLabelKey] ?? "";
  };

  return (
    <FormControl fullWidth error={!!errorKey} disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={handleChange}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 200,
              // Hide scrollbar
              scrollbarWidth: "none", // Firefox
              "&::-webkit-scrollbar": {
                display: "none", // Chrome, Safari, Edge
              },
            },
          },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        }}
      >
        {options.map((opt) => {
          const optValue = opt?.[optionValueKey] ?? "";
          return (
            <MenuItem
              key={String(optValue)}
              value={optValue}
              sx={(theme) => ({
                "&.Mui-selected": {
                  bgcolor: theme.palette.kompitrail.card,
                  "&:hover": {
                    bgcolor: theme.palette.kompitrail.card,
                  },
                },
              })}
            >
              {resolveLabel(opt)}
            </MenuItem>
          );
        })}
      </Select>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};
