import React, { useState } from "react";

import {
  TextField,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export const SearchLocationInput = ({
  onLocationSelect,
  placeholder = "Busca busca",
  mapTarget = null,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    console.log("Search query:", value);
  };

  const handleLocationSelect = (location) => {
    console.log("Selected location", location);
    onLocationSelect(location);

    // Reset component state
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <Box sx={{ pb: 2 }}>
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
            mt: 1,
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
