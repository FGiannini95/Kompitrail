export const validateRouteForm = (routeData) => {
  const errors = {};
  if (routeData.route_name === "") {
    errors.route_name = "Tienes que definir un nombre para la ruta";
  }
  if (routeData.starting_point === "") {
    errors.starting_point = "Tienes que establecer un punto de salida";
  }
  if (routeData.ending_point === "") {
    errors.ending_point = "Tienes que establecer un punto de llegada";
  }
  //Default value
  if (!routeData.date) {
    routeData.date = new Date().toISOString().slice(0, 19).replace("T", " "); //ActualDate
  }
  if (!routeData.distance) {
    errors.distance = "Debes especificar la distancia en km";
  }
  if (!routeData.level) {
    errors.level = "Debes selecionar el nivel requerido";
  }
  if (!routeData.estimated_time) {
    errors.estimated_time = "Debes establecer una duración";
  }
  if (!routeData.participants) {
    errors.participants = "Debes definir el nº máximo de pilótos";
  }

  if (!routeData.suitable_motorbike_type) {
    errors.suitable_motorbike_type =
      "Debes definir las motos aptas para las rutas";
  }
  if (routeData.route_description === "") {
    errors.route_description =
      "Tienes que escribir una descripción más detallada";
  }
  return errors;
};
