import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

import { useChat } from "../../../hooks/useChat";

import { getRouteStatus } from "../../../helpers/oneRouteUtils";
import { ROUTES_URL } from "../../../api";

import { ChatRoom } from "../../../components/Chat/ChatRoom/ChatRoom";

export const ChatRoomGroupPage = () => {
  const [routeData, setRouteData] = useState(null);

  const { id } = useParams();
  const location = useLocation();

  // Fetch route data to check status
  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const response = await axios.get(`${ROUTES_URL}/oneroute/${id}`);
        setRouteData(response.data);
      } catch (error) {
        console.error("Error fetching route data:", error);
      }
    };

    if (id) fetchRouteData();
  }, [id]);

  // Use your existing helper to determine if route is past
  const { isPastRoute } = routeData
    ? getRouteStatus(routeData.date, routeData.estimated_time)
    : { isPastRoute: false };

  const {
    messages,
    sendMessage,
    isLoading,
    typingUsers,
    handleTypingStart,
    handleTypingStop,
  } = useChat(id);

  return (
    <ChatRoom
      mode="group"
      chatId={id}
      title={location.state?.title || "Chat"}
      messages={messages}
      sendMessage={sendMessage}
      isLoading={isLoading}
      isSending={false}
      typingUsers={typingUsers}
      onTypingStart={handleTypingStart}
      onTypingStop={handleTypingStop}
      isPastRoute={isPastRoute}
    />
  );
};
