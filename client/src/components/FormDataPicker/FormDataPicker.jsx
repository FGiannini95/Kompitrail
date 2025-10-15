import React, { useState } from "react";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { IconButton, InputAdornment } from "@mui/material";

export const FormDataPicker = ({
  form,
  setForm,
  errors,
  setErrors,
  name,
  label,
}) => {
  const [open, setOpen] = useState(false);
  const value = form?.[name] ? dayjs(form[name]) : null;

  const handleChange = (newValue) => {
    if (newValue) {
      // Converts the format so that MySQL can read it: YYYY-MM-DD HH:MM:SS
      const formattedData = newValue.format("YYYY-MM-DD HH:mm:ss");
      setForm((prev) => ({ ...prev, [name]: formattedData }));
    }

    if (setErrors && errors?.[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDateTimePicker
        fullWidth
        label={label}
        name={name}
        value={value}
        onChange={handleChange}
        disablePast
        format="DD/MM/YYYY HH:mm"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        ampm={false}
        slotProps={{
          textField: {
            name,
            fullWidth: true,
            error: errors?.[name],
            helperText: errors?.[name] ?? "",
            InputProps: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Open calendar and time picker"
                    edge="end"
                    onClick={() => setOpen(true)}
                    size="small"
                  >
                    <CalendarMonthIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};
