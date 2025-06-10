# Flow Prototype (Server)

The server module handles the connection to the redis and serves data to the Flow Prototype client.

1. **Redis (DALI Sys)**: The server connects to DALI Sys via redis. This connection is used to receive live state changes.
   - Port: `6379`
2. **WebSocket**: The server uses a WebSocket to communicate with the Flow Prototype client. This allows for real-time updates.
   - Port: `3002`