export const ROUTE_INITIAL_VALUE = {
  // Create
  starting_point: {
    lat: null,
    lng: null,
    i18n: null,
  },
  ending_point: {
    lat: null,
    lng: null,
    i18n: null,
  },

  // Edit
  starting_point_i18n: null,
  starting_lat: null,
  starting_lng: null,
  ending_point_i18n: null,
  ending_lat: null,
  ending_lng: null,
  route_geometry: null,

  waypoints: [],
  date: "",
  level: "",
  distance: null,
  is_verified: 0,
  suitable_motorbike_type: [],
  estimated_time: null,
  max_participants: "",
  route_description: "",
  user_id: "",
};

export const ROUTE_LEVELS = [
  { id: 1, name: "beginner" },
  { id: 2, name: "intermediate" },
  { id: 3, name: "advanced" },
  { id: 4, name: "expert" },
];

export const MOTORBIKE_TYPES = [
  { id: 1, name: "Trail" },
  { id: 2, name: "Maxitrail" },
  { id: 3, name: "Enduro" },
  { id: 4, name: "Supermoto" },
  { id: 5, name: "Motocross" },
  { id: 6, name: "Dual sport" },
  { id: 7, name: "Cross country" },
  { id: 8, name: "Adventure" },
];

export const PARTICIPANTS = [
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5" },
  { id: 6, name: "6" },
  { id: 7, name: "7" },
  { id: 8, name: "8" },
  { id: 9, name: "9" },
  { id: 10, name: "10" },
];
