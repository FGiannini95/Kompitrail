import React, { useState, useEffect } from "react";
import axios from "axios";
import { NOTIFICATIONS_URL } from "../api";
import { getLocalStorage } from "../helpers/localStorageUtils";

// Convert VAPID public key from base64 string to Uint8Array for browser API
const urlBase64ToUint8Array = (base64String) => {
  const base64 = base64String.replace(/-/g, "+").replace(/_/g, "/");
  const binary = window.atob(base64);
  return new Uint8Array([...binary].map((char) => char.charCodeAt(0)));
};

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check browser support both api
  useEffect(() => {
    setIsSupported("serviceWorker" in navigator && "PushManager" in window);
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error("Error checking subscription", error);
    }
  };

  // Check current subscription
  useEffect(() => {
    if (isSupported) checkSubscription();
  }, [isSupported]);

  const subscribe = async () => {
    setLoading(true);
    try {
      // Request browser permission for notifications
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setLoading(false);
        return false;
      }

      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push manager
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY,
        ),
      });

      // Send subscription data to our backend
      const token = getLocalStorage("token");
      const response = await axios.post(
        `${NOTIFICATIONS_URL}/subscribe`,
        {
          subscription: pushSubscription,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setIsSubscribed(true);
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Subscribe error", error);
    }
    setLoading(false);
    return false;
  };

  // const unsubscribe = async () => {
  //   setLoading(true);
  //   try {
  //   } catch (error) {
  //     console.error("Unsubscribe error", error);
  //     setLoading(false);
  //     return false;
  //   }
  // };

  return { isSupported, isSubscribed, loading, subscribe };
};
