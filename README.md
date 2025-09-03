<<<<<<< HEAD
# TodogRPC
=======
# Todo gRPC Microservice (Production-Ready)

This project is a fully functional Todo microservice built with Node.js, Protocol Buffers, and gRPC. It demonstrates real-world usage of protobuf and gRPC for all CRUD operations, with persistent storage and a dynamic, interactive CLI client.

## Features
- **Protocol Buffers**: All data structures and service definitions are specified in `todo.proto`.
- **gRPC**: All communication between client and server uses gRPC and protobuf messages.
- **Interactive CLI Client**: The client prompts for user input and sends protobuf messages to the server using gRPC.
- **Persistent Storage**: The server stores todos in `todos.json` and updates this file for all CRUD operations.
- **No REST or direct file access from client**: All operations are performed via gRPC and protobuf, not HTTP or direct file manipulation.

## Technologies Used
- Node.js (v24+)
- @grpc/grpc-js (gRPC transport)
- @grpc/proto-loader (protobuf loader)
- google-proto-files (Google standard proto definitions)

## How It Works
### 1. Protobuf Definition
- `todo.proto` defines all messages (`TodoItem`, `TodoRequest`, `TodoList`) and the `TodoService` with RPCs for Create, Get, Update, Delete, and List todos.
- Uses `google.protobuf.Empty` for empty request/response types.

### 2. Server
- Implements all TodoService RPCs using gRPC and protobuf.
- Reads and writes todos to `todos.json` for persistence.
- All CRUD logic is exposed via gRPC methods, not direct file or REST.

### 3. Client
- Loads the protobuf schema and creates a gRPC client for `TodoService`.
- Presents an interactive CLI menu for CRUD operations.
- Prompts for user input, builds protobuf messages, and sends them to the server via gRPC.
- Displays responses from the server in the terminal.

## Usage
1. Install dependencies:
   ```sh
   npm install @grpc/grpc-js @grpc/proto-loader google-proto-files
   ```
2. Start the server:
   ```sh
   node server.js
   ```
3. Run the client:
   ```sh
   node client.js
   ```
4. Use the interactive menu to create, list, update, get, and delete todos. All changes are reflected in `todos.json`.

## Why gRPC & Protobuf?
- **Performance**: Binary serialization is faster and more efficient than JSON.
- **Strong Typing**: Protobuf enforces message structure and types.
- **Microservices**: gRPC is ideal for service-to-service communication in distributed systems.
- **Contract-Driven**: The `.proto` file is the single source of truth for all data and service contracts.

## Credits
- Inspired by Hussein Nasser's gRPC learning series.
- This project is production-ready and demonstrates real gRPC and protobuf usage.
>>>>>>> 7695d1b (Initial commit: gRPC Todo microservice with protobuf, CLI client, and binary export)
