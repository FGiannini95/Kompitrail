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

  // To remove later
  if (!routeData.distance) {
    errors.distance = "route.distanceRequired";
  }

  if (!routeData.level) {
    errors.level = "route.levelRequired";
  }

  // To remove later
  if (!routeData.estimated_time) {
    errors.estimated_time = "route.estimatedTimeRequired";
  }

  if (!routeData.max_participants) {
    errors.max_participants = "route.maxParticipantsRequired";
  }

  if (
    !Array.isArray(routeData.suitable_motorbike_type) ||
    routeData.suitable_motorbike_type.length === 0
  ) {
    errors.suitable_motorbike_type = "route.motorbikeTypeRequired";
  }

  if (routeData.route_description === "") {
    errors.route_description = "route.descriptionRequired";
  }

  return errors;
};
