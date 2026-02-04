import React from "react";
import { useTranslation } from "react-i18next";

import { Autocomplete, TextField } from "@mui/material";

// To understand better how it works
/* const options = [{ id: 1, name: "Principiante" }, { id: 2, name: "Medio" }];
    optionLabelKey = "name";     // displayed value
    optionValueKey = "id";       // saved value
 */

export const FormAutocomplete = ({
  form,
  setForm,
  errors,
  setErrors,
  name,
  label,
  options = [],
  multiple = false,
  optionLabelKey = "name",
  optionValueKey = "id",
  clearable = true,
  readOnly = false,
  disablePortal = true,
  ...autocompleteProps
}) => {
  const { t } = useTranslation("errors");

  const current = form?.[name] ?? (multiple ? [] : "");
  const { getOptionLabel: customGetOptionLabel, ...restAutocompleteProps } =
    autocompleteProps;

  const getLabel = customGetOptionLabel
    ? customGetOptionLabel
    : (opt) => opt?.[optionLabelKey] ?? "";
  const isEqual = (a, b) => a?.[optionValueKey] === b?.[optionValueKey];

  // In Autocomplete, the value is not a string or boolean (except when freeSolo)
  // If multiple = false => {}
  // If multiple = true => [{}, {}]
  const value = multiple
    ? options.filter((o) => (current || []).includes(o?.[optionValueKey]))
    : (options.find((o) => o?.[optionValueKey] === current) ?? null);

  const handleChange = (_, selected, reason) => {
    if (reason === "clear") {
      setForm((prev) => ({ ...prev, [name]: multiple ? [] : "" }));
      return;
    }

    const next = multiple
      ? Array.isArray(selected)
        ? selected.map((o) => o?.[optionValueKey])
        : []
      : selected
        ? selected?.[optionValueKey]
        : "";
    setForm((prev) => ({ ...prev, [name]: next }));

    if (setErrors && errors?.[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const errorKey = errors?.[name];
  const helperText = errorKey ? t(errorKey) : "";

  return (
    <Autocomplete
      options={options}
      multiple={multiple}
      value={value}
      onChange={handleChange}
      disablePortal={disablePortal}
      disableClearable={!clearable}
      filterSelectedOptions
      isOptionEqualToValue={isEqual}
      getOptionLabel={getLabel}
      openOnFocus
      onClick={
        readOnly
          ? (e) => {
              // Make whole autocomplete clickable when readOnly
              if (e.target.tagName !== "BUTTON") {
                const button = e.currentTarget.querySelector("[title='Open']");
                if (button) button.click();
              }
            }
          : undefined
      }
      {...restAutocompleteProps}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!errorKey}
          helperText={helperText}
          inputProps={{
            ...params.inputProps,
            readOnly: readOnly,
            inputMode: readOnly ? "none" : "text",
            onFocus: readOnly
              ? (e) => {
                  e.target.blur();
                  e.preventDefault();
                }
              : undefined,
            onTouchStart: readOnly ? (e) => e.preventDefault() : undefined,
          }}
        />
      )}
    />
  );
};
