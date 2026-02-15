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

  const getServiceWorkerRegistration = async () => {
    return await navigator.serviceWorker.ready;
  };

  const getCurrentSubscription = async () => {
    const registration = await getServiceWorkerRegistration();
    return await registration.pushManager.getSubscription();
  };

  const getAuthToken = () => {
    const token = getLocalStorage("token");
    if (!token) throw new Error("No auth token found");
    return token;
  };

  // Check browser support both api
  useEffect(() => {
    setIsSupported("serviceWorker" in navigator && "PushManager" in window);
  }, []);

  const checkSubscription = async () => {
    try {
      const subscription = await getCurrentSubscription();

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

      const registration = await getServiceWorkerRegistration();
      // Subscribe to push manager
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY,
        ),
      });

      const currentLanguage = getLocalStorage("kompitrailLanguage") || "es";

      // Send subscription data to our backend
      const response = await axios.post(
        `${NOTIFICATIONS_URL}/subscribe`,
        {
          subscription: pushSubscription,
          language: currentLanguage,
        },
        {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
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

  const unsubscribe = async () => {
    setLoading(true);
    try {
      const subscription = await getCurrentSubscription();

      // Unsubscribe from browser push manager
      if (subscription) {
        const unsubscribed = await subscription.unsubscribe();
        if (!unsubscribed) {
          throw new Error("Failed to unsubscribe from browser push manager");
        }
      }

      // Notify backend to remove subscription from json file
      const response = await axios.post(
        `${NOTIFICATIONS_URL}/unsubscribe`,
        {},
        {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        },
      );

      if (response.data.success) {
        setIsSubscribed(false);

        // Small delay to show the new state before removing loading
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Unsubscribe error", error);
      setLoading(false);
      return false;
    }
  };

  return { isSupported, isSubscribed, loading, subscribe, unsubscribe };
};
