import React, { useState, createContext, useContext } from "react";

export const FormDialogContext = createContext();

export const FormDialogProvider = ({ children }) => {
  // 1) Minimal session state to know what to show
  const [session, setSession] = useState({
    isOpen: false,
    type: null, // form - confirmation
    mode: null, // create - edit
    kind: null, // motorbike - route
    id: null,
    values: {},
    originalValues: {},
    onConfirm: null,
    onCancel: null,
    loading: false,
    submitting: false,
    closeOnBackdrop: true,
    // Specific for confirmation dialog
    title: null,
    message: null,
    confirmText: "Confirmar",
    cancelText: "Anular",
  });

  // 2) Open as CREATE
  const openCreate = (config) => {
    const initialValues = config.initialValues ?? {};

    setSession({
      isOpen: true,
      type: "form",
      mode: "create",
      kind: config.kind,
      id: null,
      values: { ...initialValues },
      originalValues: { ...initialValues },
      onConfirm: config.onConfirm ?? null,
      onCancel: config.onCancel ?? null,
      loading: false,
      submitting: false,
      closeOnBackdrop: true,
      title: config.title,
      confirmText: config.confirmText,
      cancelText: config.cancelText,
    });
  };

  // 3) Open as EDIT
  const openEdit = (config) => {
    const initialValues = config.initialValues ?? {};

    setSession({
      isOpen: true,
      type: "form",
      mode: "edit",
      kind: config.kind,
      id: config.id,
      values: { ...initialValues },
      originalValues: { ...initialValues },
      onConfirm: config.onConfirm ?? null,
      onCancel: config.onCancel ?? null,
      loading: false,
      submitting: false,
      closeOnBackdrop: true,
      title: config.title,
      confirmText: config.confirmText,
      cancelText: config.cancelText,
    });
  };

  // 4) Open confirmation dialog
  const openConfirm = (config) => {
    const initialValues = config.initialValues ?? {};

    setSession({
      isOpen: true,
      type: "confirm",
      mode: null,
      kind: config.kind ?? null,
      id: config.id ?? null,
      values: initialValues,
      originalValues: initialValues,
      onConfirm: config.onConfirm ?? null,
      onCancel: config.onCancel ?? null,
      loading: false,
      submitting: false,
      closeOnBackdrop: config.closeOnBackdrop ?? true,
      title: config.title,
      message: config.message,
      confirmText: config.confirmText,
      cancelText: config.cancelText,
    });
  };

  // 5) Close the dialog
  const close = () => {
    // Run the callback
    if (session.onCancel) {
      session.onCancel();
    }
    // Reset state
    setSession((prev) => ({
      ...prev,
      values: { ...prev.originalValues },
      isOpen: false,
    }));
  };

  // 6) Update form values?

  // 7) Set loading state
  const setLoading = (loading) => {
    setSession((prev) => ({ ...prev, loading }));
  };

  // 8) Set submitting state
  const setSubmitting = (submitting) => {
    setSession((prev) => ({ ...prev, submitting }));
  };

  // 8) Helper for Delete
  const openDelete = (config) => {};

  // 9) Expose API + state to consumers
  const value = {
    openCreate,
    openEdit,
    openConfirm,
    openDelete,
    close,
    session,
    setSession,
    setLoading,
    setSubmitting,
  };

  return (
    <FormDialogContext.Provider value={value}>
      {children}
    </FormDialogContext.Provider>
  );
};

export const useFormDialog = () => {
  const ctx = useContext(FormDialogContext);
  if (!ctx)
    throw new Error("useFormDialog must be used within FormDialogProvider");
  return ctx;
};
