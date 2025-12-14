# webrtc-realtime-communication-lab

Hands-on WebRTC lab to learn, step by step:

- Core WebRTC concepts (media, `RTCPeerConnection`, SDP).
- ICE, STUN, and TURN in practice.
- JavaScript-based signaling and client logic.
- Integration with FreeSWITCH and Kamailio in later phases.

The goal is to **build a practical lab from scratch**, over multiple phases, so you can experiment and really understand how WebRTC works end to end.

---

## Project phases

This repo is organized into phases. Each phase has its own docs and code.

- **Phase 1 – P2P WebRTC + ICE (browser ↔ browser)**
	- Minimal Node.js signaling server.
	- Two simple browser clients (caller/callee).
	- Uses public STUN to discover candidates and establish a direct P2P connection.

> See `docs/phase-1-p2p-ice.md` for the detailed Phase 1 lab guide.

Future phases (planned):

- **Phase 2 – TURN and advanced ICE**: Add TURN (e.g., coturn) and explore relay candidates.
- **Phase 3 – Media features & DataChannel**: Mute/unmute, screen share, text chat, etc.
- **Phase 4 – Kamailio + FreeSWITCH**: Bridge WebRTC into a SIP world.
- **Phase 5 – Full integration**: Docker-based architecture combining all components.

---

## Tech stack

- **Node.js** – simple HTTP + WebSocket signaling server.
- **Browser JavaScript** – WebRTC client logic.
- **WebRTC APIs** – `getUserMedia`, `RTCPeerConnection`, ICE candidates.
- **STUN** – public STUN server (e.g., `stun:stun.l.google.com:19302`).
- **(Later)** Kamailio, FreeSWITCH, TURN server.

---

## Getting started (Phase 1)

### Prerequisites

- Node.js 18+ installed.
- Modern browser (Chrome, Edge, or Firefox).

### Install dependencies

From PowerShell:

```powershell
cd "c:\webrtc project\webrtc-realtime-communication-lab"
npm install
```

### Run the Phase 1 lab

Start the signaling server:

```powershell
cd "c:\webrtc project\webrtc-realtime-communication-lab"
npm run phase1:server
```

Then in your browser:

- Open `http://localhost:3000/caller` in one tab/window.
- Open `http://localhost:3000/callee` in another.
- Use the same Room ID on both pages (for example `room1`).
- Click **Connect** on both, then **Start Call** on the caller.

Check your browser DevTools console to watch ICE candidates and connection state as the peers connect.

For deeper explanations and exercises, read `docs/phase-1-p2p-ice.md`.

