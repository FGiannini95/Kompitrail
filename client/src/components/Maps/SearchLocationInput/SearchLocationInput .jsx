import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  TextField,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// Utils
import { ROUTES_URL } from "../../../api";
import { getCurrentLang } from "../../../helpers/oneRouteUtils";
// Hooks & Providers
import { useGeocodingSearch } from "../../../hooks/useGeocodingSearch";

export const SearchLocationInput = ({ onLocationSelect, placeholder }) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const { i18n } = useTranslation();
  const currentLang = getCurrentLang(i18n);

  const geocodingEndpoint = `${ROUTES_URL}/geocoding`;

  const { results, loading, error } = useGeocodingSearch(
    query,
    geocodingEndpoint,
    currentLang
  );

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    setShowDropdown(value.length >= 2);
  };

  const handleLocationSelect = (location) => {
    onLocationSelect(location);

    // Reset component state
    setQuery("");
    setShowDropdown(false);
  };

  return (
    <Box sx={{ pb: 2, position: "relative" }}>
      {/* Search input */}
      <TextField
        fullWidth
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        InputProps={{
          endAdornment: loading ? (
            <CircularProgress size={20} />
          ) : (
            <SearchOutlinedIcon />
          ),
        }}
        error={!!error}
        helperText={error && "Error en la búsqueda"}
      />

      {/* Results dropdown */}
      {showDropdown && results.length > 0 && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: 300,
            overflow: "auto",
            mt: -2,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
          }}
        >
          <List>
            {results.map((result, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleLocationSelect(result)}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <LocationOnIcon sx={{ mr: 1, color: "text.secondary" }} />
                <ListItemText
                  primary={result.name}
                  secondary={result.displayName}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};
