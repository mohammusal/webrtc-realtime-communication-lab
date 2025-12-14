## Phase 1 – Browser-to-Browser WebRTC with ICE

### 1. Learning goals

- Understand what WebRTC is and where it is used.
- Learn the roles of STUN, TURN, and ICE in establishing P2P connections.
- Build a minimal browser-to-browser audio/video call using WebRTC.
- See how signaling works using a simple Node.js WebSocket server.
- Inspect and reason about ICE candidates (host, srflx, relay).

### 2. High-level architecture

In this phase we focus on a **simple P2P connection** between two browsers on the same network or Internet, using a lightweight signaling server and a public STUN server.

Components:

- **Browser A (Caller)**: Creates an offer, gathers ICE candidates, sends them via signaling.
- **Browser B (Callee)**: Receives offer, creates an answer, gathers ICE candidates, sends them back.
- **Signaling Server (Node.js + WebSocket)**: Forwards signaling messages (SDP, ICE) between peers.
- **STUN Server**: Helps discover public-facing addresses when behind NAT (e.g. `stun:stun.l.google.com:19302`).

Text sequence (simplified):

1. Caller connects to signaling server and joins a **room**.
2. Callee connects to signaling server and joins the **same room**.
3. Caller gets local media (`getUserMedia`) and creates an SDP offer.
4. Caller sends the offer (plus ICE candidates) to the room via signaling.
5. Callee receives the offer, sets it as remote description, gets media, and creates an SDP answer.
6. Callee sends the answer (plus ICE candidates) back to the room.
7. Each peer adds the other side’s ICE candidates.
8. ICE selects the best candidate pair → media flows directly between browsers.

### 3. Project structure for Phase 1

For this phase, we will use the following folders (relative to repo root):

```text
webrtc-realtime-communication-lab/
  package.json
  phase-1/
	 server/
		signaling-server.js
	 client/
		caller.html
		callee.html
  docs/
	 phase-1-p2p-ice.md  (this file)
```

### 4. Prerequisites

- Node.js 18+ installed (`node -v`).
- A modern browser (Chrome, Edge, or Firefox) that supports WebRTC.
- Basic understanding of JavaScript and the terminal.

On Windows (PowerShell), you can verify Node.js with:

```powershell
node -v
npm -v
```

### 5. Setup and install

From the repository root (folder `webrtc-realtime-communication-lab`):

```powershell
cd "c:\webrtc project\webrtc-realtime-communication-lab"
npm install
```

This installs dependencies defined in `package.json` (WebSocket library, etc.).

### 6. Running the Phase 1 lab

Start the signaling + static file server:

```powershell
cd "c:\webrtc project\webrtc-realtime-communication-lab"
npm run phase1:server
```

By default, the server will:

- Listen on `http://localhost:3000`.
- Serve the WebRTC demo pages from `phase-1/client/`.

Open two browser windows/tabs:

- **Caller:** `http://localhost:3000/caller`
- **Callee:** `http://localhost:3000/callee`

### 7. Walkthrough: establishing a P2P connection

Once both pages are open:

1. **Join the same room**
	- On both Caller and Callee pages, enter the same text in the **Room ID** field (for example `room1`) and click **Connect**.
	- You should see a status message like `Connected to room room1`.

2. **Caller starts the call**
	- On the Caller page, click **Start Call**.
	- The browser will ask for permission to use camera/mic. Allow it.
	- Caller creates a WebRTC offer and starts gathering ICE candidates.
	- The offer and candidates are sent via the signaling server to the Callee.

3. **Callee answers**
	- On the Callee page, the UI will indicate that an incoming offer was received.
	- Callee automatically creates an answer and sends it (with its ICE candidates) back.

4. **ICE connectivity**
	- Both peers add each other’s ICE candidates.
	- When a working candidate pair is found, the `oniceconnectionstatechange` event will move to `connected`/`completed`.
	- You should see **local** and **remote** video elements showing the streams.

### 8. Inspecting ICE candidates

Both pages log ICE events to the browser console.

1. Open DevTools (F12) in the browser.
2. Go to the **Console** tab.
3. Watch for lines like:

```text
New ICE candidate: candidate:12345 1 udp 2122252543 192.168.1.10 50052 typ host
New ICE candidate: candidate:67890 1 udp 1686052607 203.0.113.5 60000 typ srflx
```

Key candidate types:

- `host`: Local IP on your machine.
- `srflx` (server-reflexive): Public IP discovered via STUN.
- `relay`: When we introduce TURN in a later phase.

Exercises:

- Compare candidates when both peers are on the same LAN vs different networks.
- Disable Wi-Fi and reconnect using a mobile hotspot to see different addresses.

### 9. Key code concepts to study

In the Phase 1 client and server files, focus on:

- `RTCPeerConnection` construction with `iceServers` configuration (STUN).
- `navigator.mediaDevices.getUserMedia` for capturing audio/video.
- Signaling message types: `join`, `offer`, `answer`, `ice-candidate`.
- Room-based message routing on the server.
- Handling `onicecandidate` and `ontrack` events.

### 10. Next steps (for later phases)

Once you are comfortable with this Phase 1 lab:

- Add a TURN server (Phase 2) and compare behavior when direct paths fail.
- Extend the UI (Phase 3) with mute/unmute, screen share, and data channels.
- Integrate with Kamailio and FreeSWITCH (later phases) to bridge into SIP.

Use this phase primarily to **build intuition** about how browsers actually set up P2P media paths and how ICE candidates evolve as network conditions change.

