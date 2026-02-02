const EVENTS = {
  // Client ==> Server
  C2S: {
    ROOM_JOIN: "room:join",
    ROOM_LEAVE: "room:leave",
    MESSAGE_SEND: "message:send",
    TYPING_START: "typing:start",
    TYPING_STOP: "typing:stop",
    MESSAGE_READ: "message:read",
    PING: "ping",
  },
  // Server ==> Client
  S2C: {
    ROOM_JOINED: "room:joined",
    MESSAGE_NEW: "message:new",
    MESSAGE_ACK: "message:ack",
    TYPING_UPDATE: "typing:update",
    MESSAGE_READ_UPDATE: "message:read:update",
    PONG: "pong",
  },
};

module.exports = { EVENTS };
