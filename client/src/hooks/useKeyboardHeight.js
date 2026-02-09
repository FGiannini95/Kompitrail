import React, { useState, useEffect, useRef } from "react";

// Custom hook to detect mobile keyboard height and manage viewport changes
export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const messagesBoxRef = useRef(null);

  // Auto-scroll function to move to bottom when keyboard opens
  const scrollToBottom = () => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Handle viewport resize events to detect keyboard open/close
    const handleResize = () => {
      // Calculate height difference between visual viewport and window
      const visualHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.innerHeight;
      const heightDifference = windowHeight - visualHeight;

      // Consider keyboard open if difference > 150px
      const keyboardOpen = heightDifference > 150;

      if (keyboardOpen) {
        setKeyboardHeight(heightDifference);
        // Delay scroll to allow UI to adjust first
        setTimeout(() => scrollToBottom(), 100);
      } else {
        setKeyboardHeight(0);
      }
    };

    // Add event listeners for viewport changes
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    } else {
      // Fallback for browsers without visualViewport support
      window.addEventListener("resize", handleResize);
    }

    // Cleanup listeners on component unmount
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      } else {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return {
    keyboardHeight,
    messagesBoxRef,
    scrollToBottom,
  };
};
