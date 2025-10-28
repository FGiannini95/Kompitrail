import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Utils
import { getLocalStorage } from "../helpers/localStorageUtils";
import { USER_INITIAL_VALUE } from "../constants/userConstants";
import { RoutesString } from "../routes/routes";
// Hooks & Providers
import { KompitrailContext } from "../context/KompitrailContext";

export const useEditUserForm = () => {
  const [editUser, setEditUser] = useState(USER_INITIAL_VALUE);
  const [initialValue, setInitialValue] = useState(USER_INITIAL_VALUE);
  const [isLoading, setIsLoading] = useState(true);
  const [save, setSave] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const tokenLocalStorage = getLocalStorage("token");
  const { user_id } = jwtDecode(tokenLocalStorage).user;
  const { setUser } = useContext(KompitrailContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user_id) {
      axios
        .get(`http://localhost:3000/users/oneuser/${user_id}`)
        .then((res) => {
          setEditUser(res.data);
          setInitialValue(res.data);

          if (res.data.img) {
            setPhotoPreview(
              `http://localhost:3000/images/users/${res.data.img}`
            );
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user_id]);

  const handleChange = (e) => {
    if (e && e.target) {
      // React event
      const { name, value } = e.target;

      const nextValue =
        typeof value === "string" && value.length > 0 && name !== "phonenumber"
          ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
          : value;
      setEditUser((prevState) => ({ ...prevState, [name]: nextValue }));
    } else {
      // Direct value - PhoneInput
      setEditUser((prevState) => ({ ...prevState, phonenumber: e }));
    }
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    setUser((prev) =>
      prev
        ? { ...prev, name: editUser.name, lastname: editUser.lastname }
        : prev
    );

    const newFormData = new FormData();
    newFormData.append(
      "editUser",
      JSON.stringify({
        name: editUser.name,
        lastname: editUser.lastname,
        phonenumber: editUser.phonenumber,
        removePhoto: editUser.removePhoto,
      })
    );

    if (editUser.photo) {
      newFormData.append("file", editUser.photo);
    }

    axios
      .put(`http://localhost:3000/users/edituser/${user_id}`, newFormData)
      .then((res) => {
        setEditUser(res.data);
        setInitialValue(res.data);
        setUser(res.data);
        navigate(RoutesString.profile, { replace: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancel = () => {
    setEditUser(initialValue);
    navigate(-1);
  };

  useEffect(() => {
    // No comparison if still laoding
    if (isLoading) {
      setSave(false);
      return;
    }

    // Don't compare if data not loaded yet
    if (
      !editUser.name ||
      !initialValue.name ||
      editUser === USER_INITIAL_VALUE ||
      initialValue === USER_INITIAL_VALUE
    ) {
      setSave(false);
      return;
    }

    const hasChange =
      editUser.name !== initialValue.name ||
      editUser.lastname !== initialValue.lastname ||
      editUser.phonenumber !== initialValue.phonenumber ||
      editUser.removePhoto !== initialValue.removePhoto ||
      editUser.img !== initialValue.img;

    setSave(hasChange);
  }, [editUser, initialValue, isLoading]);

  return {
    editUser,
    setEditUser,
    isLoading,
    save,
    photoPreview,
    setPhotoPreview,
    handleChange,
    handleConfirm,
    handleCancel,
  };
};
