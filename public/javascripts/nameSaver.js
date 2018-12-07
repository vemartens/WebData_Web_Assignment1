
var socket = new WebSocket(Setup.WEB_SOCKET_URL);

let outgoingMsg = Messages.NAME_IS_MADE;
outgoingMsg.data = gs.getTargetCombi();
socket.send(JSON.stringify(outgoingMsg));
