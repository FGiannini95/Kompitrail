export const validateRouteForm = (routeData) => {
  const errors = {};
  if (routeData.route_name === "") {
    errors.route_name = "Nombre requerido";
  }
  if (routeData.starting_point === "") {
    errors.starting_point = "Punto de salida requerido";
  }
  if (routeData.ending_point === "") {
    errors.ending_point = "Punto de llegada requerido";
  }
  if (!routeData.date) {
    routeData.date = "Fecha requerida";
  }
  if (!routeData.distance) {
    errors.distance = "Distancia requerida";
  }
  if (!routeData.level) {
    errors.level = "Nivel requerido";
  }
  if (!routeData.estimated_time) {
    errors.estimated_time = "Duración requerida";
  }
  if (!routeData.participants) {
    errors.participants = "Nº de pilotos requerido";
  }

  if (!routeData.suitable_motorbike_type) {
    errors.suitable_motorbike_type = "Motos aptas requeridas";
  }
  if (routeData.route_description === "") {
    errors.route_description = "Descripción requerida";
  }
  return errors;
};
