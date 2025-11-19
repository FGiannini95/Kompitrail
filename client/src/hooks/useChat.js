/*
Join/leave the room for a given routeId.
Emit/send:
chat:message { routeId, body }
chat:typing { routeId, isTyping } (debounced in the hook)
chat:read { routeId, lastSeenMessageId }
Listen/handle:
chat:message (append to UI)
system:message (join/leave/delete notices)
chat:typing (drive TypingIndicator)
chat:read (update double checks)
chat:locked (disable MessageInput)
Cleanup listeners on unmount.
*/
