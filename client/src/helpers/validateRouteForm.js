export const validateRouteForm = (routeData) => {
  const errors = {};

  if (routeData.starting_point === "") {
    errors.starting_point = "route.startingPointRequired";
  }

  if (
    !routeData.ending_point ||
    !routeData.ending_point.lat ||
    !routeData.ending_point.lng
  ) {
    errors["ending_point.label"] = "route.endingPointRequired";
  }

  if (!routeData.date) {
    errors.date = "route.dateRequired";
  } else {
    const now = new Date();
    const routeStart = new Date(routeData.date);
    const ONE_HOUR_MS = 30 * 60 * 1000;
    const enrollmentDeadline = new Date(routeStart.getTime() - ONE_HOUR_MS);

    // If current time is past enrollment deadline, route is too soon
    if (now >= enrollmentDeadline) {
      errors.date = "route.dateTooSoon";
    }
  }

  if (!routeData.level) {
    errors.level = "route.levelRequired";
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
