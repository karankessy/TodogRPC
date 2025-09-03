# Todo gRPC Microservice

This project is a fully functional Todo microservice built with Node.js, Protocol Buffers, and gRPC. It was created for learning and demonstration purposes.

## Learning Journey
This project was developed as a learning exercise in building gRPC services. The primary resources used for learning were:
- **Hussein Nasser's** tutorials on gRPC.
- **Stephane Maarek's** courses on microservices and gRPC.
- **Google's team videos** and official **gRPC documentation**.

## gRPC and the Client Library Management Problem

In many communication protocols like REST over HTTP or WebSockets, managing client libraries can be a significant challenge. Developers often need to manually write client code that handles HTTP requests, serialization/deserialization of JSON, and endpoint management. This can lead to inconsistencies between the client and server, and a lot of boilerplate code.

gRPC solves this problem by using Protocol Buffers (`.proto` files) to define the service contract. From this single `.proto` file, gRPC can automatically generate client and server code in many different languages. This has several advantages:
- **Single Source of Truth**: The `.proto` file is the canonical definition of the service's API.
- **Code Generation**: Client and server stubs are generated automatically, which reduces boilerplate code and eliminates manual implementation of communication logic.
- **Strongly Typed**: The generated code is strongly typed, which means that many errors can be caught at compile time rather than at runtime.
- **Cross-Language Compatibility**: gRPC's code generation tools work for many popular programming languages, making it easy to create clients in different languages that are guaranteed to be compatible with the server.

## gRPC and the CNCF
gRPC was accepted by the **Cloud Native Computing Foundation (CNCF)** on February 16, 2017, and is currently at the **Incubating** maturity level. This signifies its importance in the cloud-native ecosystem.

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
