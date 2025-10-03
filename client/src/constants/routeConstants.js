export const ROUTE_INITIAL_VALUE = {
  route_name: "",
  starting_point: "",
  ending_point: "",
  date: "",
  level: "",
  distance: "",
  is_verified: false,
  suitable_motorbike_type: "",
  estimated_time: "",
  participants: "",
  route_description: "",
  user_id: "",
};

export const ROUTE_LEVELS = [
  { id: 1, name: "Principiante" },
  { id: 2, name: "Medio" },
  { id: 3, name: "Avanzado" },
  { id: 4, name: "Experto" },
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
