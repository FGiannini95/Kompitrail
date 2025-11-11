import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Utils
import { getLocalStorage } from "../helpers/localStorageUtils";
import { USER_INITIAL_VALUE } from "../constants/userConstants";
import { RoutesString } from "../routes/routes";
import { API_BASE } from "../api";
import { normalizeImg } from "../helpers/normalizeImg";
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
        .get(`${API_BASE}/users/oneuser/${user_id}`)
        .then((res) => {
          setEditUser(res.data);
          setInitialValue(res.data);

          if (res.data.img) {
            setPhotoPreview(normalizeImg(res.data.img));
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

    // Create FormData object to send both JSON data and file
    const newFormData = new FormData();

    // Clean phonenumber: if it's only "+" or empty or null, save NULL in DB. This prevents duplicate entry errors.
    // let cleanPhoneNumber = editUser.phonenumber.trim();
    // if (cleanPhoneNumber === "+" || cleanPhoneNumber === "") {
    //   cleanPhoneNumber = "";
    // }

    // Prepare the user data object
    const editUserData = {
      name: editUser.name.trim(),
      lastname: editUser.lastname.trim(),
      //phonenumber: cleanPhoneNumber,
      removePhoto: editUser.removePhoto || false,
    };

    console.log("Sending data:", editUserData); // Debug log

    // Add the JSON data as a string to FormData
    newFormData.append("editUser", JSON.stringify(editUserData));

    // Add the file only if user selected a new photo
    if (editUser.photo) {
      newFormData.append("file", editUser.photo);
    }

    axios
      .put(`${API_BASE}/users/edituser/${user_id}`, newFormData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      })
      .then((res) => {
        // Normalize the received data to ensure consistent state
        const normalizedData = {
          user_id: res.data.user_id,
          name: res.data.name || "",
          lastname: res.data.lastname || "",
          //phonenumber: res.data.phonenumber || "",
          email: res.data.email || "",
          img: res.data.img || null,
          removePhoto: false, // Reset to false after successful save
          photo: null, // Reset to null after successful save
        };

        setEditUser(normalizedData);
        setInitialValue(normalizedData);
        setUser(res.data);

        // Update photo preview based on server response
        if (res.data.img) {
          setPhotoPreview(normalizeImg(res.data.img));
        } else {
          setPhotoPreview(null);
        }

        // Navigate back to profile page
        navigate(RoutesString.profile, { replace: true });
      })
      .catch((err) => {
        console.error("Error al actualizar el usuario:", err);
        console.error("Error:", err.response?.data);
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
