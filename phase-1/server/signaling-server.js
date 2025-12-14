const http = require('http');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;

const publicDir = path.join(__dirname, '..', 'client');

const server = http.createServer((req, res) => {
  const url = req.url === '/' ? '/caller' : req.url;

  let filePath;
  if (url === '/caller') {
    filePath = path.join(publicDir, 'caller.html');
  } else if (url === '/callee') {
    filePath = path.join(publicDir, 'callee.html');
  } else {
    // Fallback 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  });
});

const wss = new WebSocket.Server({ server });

// roomId -> Set of WebSocket clients
const rooms = new Map();

function joinRoom(socket, roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  const room = rooms.get(roomId);
  room.add(socket);
  socket.roomId = roomId;
}

function leaveRoom(socket) {
  const roomId = socket.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room) return;
  room.delete(socket);
  if (room.size === 0) {
    rooms.delete(roomId);
  }
}

function broadcastToRoom(roomId, data, sender) {
  const room = rooms.get(roomId);
  if (!room) return;
  for (const client of room) {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

wss.on('connection', socket => {
  socket.on('message', message => {
    let payload;
    try {
      payload = JSON.parse(message.toString());
    } catch (e) {
      return;
    }

    const { type, roomId } = payload;

    if (type === 'join') {
      joinRoom(socket, roomId);
      return;
    }

    if (!roomId) return;

    switch (type) {
      case 'offer':
      case 'answer':
      case 'ice-candidate':
        broadcastToRoom(roomId, JSON.stringify(payload), socket);
        break;
      default:
        break;
    }
  });

  socket.on('close', () => {
    leaveRoom(socket);
  });
});

server.listen(PORT, () => {
  console.log(`Phase 1 signaling server running at http://localhost:${PORT}`);
});
