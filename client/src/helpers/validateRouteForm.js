export const validateRouteForm = (routeData) => {
  const errors = {};

  if (routeData.starting_point === "") {
    errors.starting_point = "route.startingPointRequired";
  }

  if (routeData.ending_point === "") {
    errors.ending_point = "route.endingPointRequired";
  }

  if (!routeData.date) {
    errors.date = "route.dateRequired";
  }

  if (!routeData.distance) {
    errors.distance = "route.distanceRequired";
  }

  if (!routeData.level) {
    errors.level = "route.levelRequired";
  }

  if (!routeData.estimated_time) {
    errors.estimated_time = "route.estimatedTimeRequired";
  }

  if (!routeData.max_participants) {
    errors.max_participants = "route.maxParticipantsRequired";
  }

  if (!routeData.suitable_motorbike_type) {
    errors.suitable_motorbike_type = "route.motorbikeTypeRequired";
  }

  if (routeData.route_description === "") {
    errors.route_description = "route.descriptionRequired";
  }

  return errors;
};
