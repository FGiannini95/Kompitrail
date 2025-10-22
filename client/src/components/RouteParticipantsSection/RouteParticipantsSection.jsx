import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";

import { Box } from "@mui/material";

import { BadgeAvatar } from "../Avatars/BadgeAvatar/BadgeAvatar";
import { PlusAvatar } from "../Avatars/PlusAvatar/PlusAvatar";
// Providers
import { useRoutes } from "../../context/RoutesContext/RoutesContext";
import { useSnackbar } from "../../context/SnackbarContext/SnackbarContext";
import { useConfirmationDialog } from "../../context/ConfirmationDialogContext/ConfirmationDialogContext";
// Utils
import { RoutesString } from "../../routes/routes";
import { KompitrailContext } from "../../context/KompitrailContext";

export const RouteParticipantsSection = forwardRef(
  (
    {
      route_id,
      user_id,
      create_name,
      participants = [],
      max_participants,
      isOwner,
    },
    ref
  ) => {
    const {
      joinRoute,
      isJoiningRoute,
      leaveRoute,
      deleteRoute,
      closeDialog,
      openDialog: openCreateEditDialog,
    } = useRoutes();
    const { user: currentUser } = useContext(KompitrailContext);
    const { showSnackbar } = useSnackbar();
    const { openDialog } = useConfirmationDialog();
    const navigate = useNavigate();

    const enrollmentInfo = useMemo(() => {
      // Creator + enrolled user
      const currentParticipants = 1 + participants.length;

      // Check if current user is already enrolled
      const isCurrentUserEnrolled = participants.some(
        (p) => p.user_id === currentUser?.user_id
      );

      const slotsAvailable = max_participants - currentParticipants;
      const isRouteFull = slotsAvailable <= 0;

      // Number of empty slots  to display
      const emptySlotsCount = Math.max(
        0,
        max_participants - currentParticipants
      );

      return {
        currentParticipants,
        isCurrentUserEnrolled,
        slotsAvailable,
        isRouteFull,
        emptySlotsCount,
      };
    }, [max_participants, participants, currentUser?.user_id]);

    // - NOT clickable if: user is creator OR user is already enrolled OR route is full
    const canJoinRoute =
      !isOwner &&
      !enrollmentInfo.isCurrentUserEnrolled &&
      !enrollmentInfo.isRouteFull &&
      !isJoiningRoute(route_id);

    const handleDelete = () => {
      return deleteRoute(route_id)
        .then(() => {
          showSnackbar("Ruta eliminada con éxito");
          closeDialog();
          navigate(RoutesString.home);
        })
        .catch((err) => {
          console.log(err);
          showSnackbar("Error al eliminar la ruta", "error");
        });
    };

    const handleOpenDeleteDialog = () => {
      openDialog({
        title: "Eliminar ruta",
        message: "¿Quieres eliminar la ruta de la plataforma?",
        onConfirm: () => handleDelete(),
      });
    };

    const handleJoin = (e) => {
      e.stopPropagation();
      if (!canJoinRoute) return;

      joinRoute(route_id, currentUser.user_id)
        .then(() => {
          showSnackbar("Inscripción completada");
          navigate(RoutesString.home);
        })
        .catch((err) => {
          console.log(err);
          showSnackbar("Error al inscribirte", "error");
        });
    };

    const handleLeave = (e) => {
      e?.stopPropagation();
      leaveRoute(route_id, currentUser.user_id)
        .then(() => {
          showSnackbar("Inscripción cancelada");
          navigate(RoutesString.home);
        })
        .catch((err) => {
          console.log(err);
          showSnackbar("Error durante la cancelación", "error");
        });
    };

    const handleOpenLeaveRoute = () => {
      openDialog({
        title: "Cancelar inscripción",
        message: "¿Quieres cancelar la inscripción a esta ruta?",
        onConfirm: () => handleLeave(),
      });
    };

    const handleOpenEditDialog = (route_id) => {
      openCreateEditDialog({ mode: "edit", route_id });
    };

    // Expose functions via ref
    useImperativeHandle(ref, () => ({
      handleJoin,
      handleLeave,
      handleOpenLeaveRoute,
      handleOpenDeleteDialog,
      handleOpenEditDialog,
    }));

    return (
      <Box display="flex" flexWrap="wrap" gap={1} marginTop={1}>
        {/* 1. CREATOR AVATAR - Always first */}
        <BadgeAvatar
          targetUserId={user_id}
          name={create_name}
          size={40}
          showName
          onBadgeClick={() => handleOpenDeleteDialog(route_id)}
        />

        {/* 2. ENROLLED PARTICIPANTS */}
        {participants.map((participant) => {
          const isCurrentUser = participant.user_id === currentUser?.user_id;

          return (
            <BadgeAvatar
              key={participant.user_id}
              targetUserId={participant.user_id}
              name={participant.name}
              size={40}
              showName
              onBadgeClick={isCurrentUser ? handleOpenLeaveRoute : undefined}
            />
          );
        })}

        {/* 3. EMPTY SLOTS - "+" buttons (only if not owner and not enrolled) */}
        {Array.from({ length: enrollmentInfo.emptySlotsCount }).map((_, i) => (
          <PlusAvatar
            key={`empty-slot-${i}`}
            size={40}
            onClick={handleJoin}
            disabled={!canJoinRoute}
          />
        ))}
      </Box>
    );
  }
);

RouteParticipantsSection.displayName = "RouteParticipantsSection";
