const path = require("path");
const fs = require("fs");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const googleProtoFiles = require("google-proto-files");

const PROTO_PATH = path.resolve(__dirname, "todo.proto");
const TODOS_PATH = path.resolve(__dirname, "todos.json");

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  includeDirs: [googleProtoFiles.getProtoPath()]
});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

// Helper functions for file-based storage
function readTodos() {
    try {
        const data = fs.readFileSync(TODOS_PATH, "utf8");
        console.log(`[READ] todos.json:`, data);
        return JSON.parse(data);
    } catch (e) {
        console.error(`[ERROR] reading todos.json:`, e);
        return [];
    }
}

function writeTodos(todos) {
    try {
        fs.writeFileSync(TODOS_PATH, JSON.stringify(todos, null, 2));
        console.log(`[WRITE] todos.json:`, JSON.stringify(todos, null, 2));
    } catch (e) {
        console.error(`[ERROR] writing todos.json:`, e);
    }
}

const server = new grpc.Server();
server.addService(todoPackage.TodoService.service, {
    // Create a new todo and persist to file
    // Create a new todo only if ID is unique
    CreateTodo: (call, callback) => {
        const newTodo = call.request;
        const todos = readTodos();
        if (todos.some(t => t.id === newTodo.id)) {
            console.log(`[CREATE] Todo with ID ${newTodo.id} already exists.`);
            callback({ code: grpc.status.ALREADY_EXISTS, details: "Todo with this ID already exists" });
            return;
        }
        todos.push(newTodo);
        writeTodos(todos);
        console.log(`[CREATE] Added todo:`, newTodo);
        callback(null, newTodo);
    },
    // Get a todo by ID
    GetTodo: (call, callback) => {
        const todoId = call.request.id;
        const todos = readTodos();
        const todo = todos.find(t => t.id === todoId);
        if (todo) {
            console.log(`[GET] Found todo with ID ${todoId}:`, todo);
            callback(null, todo);
        } else {
            console.log(`[GET] Todo with ID ${todoId} not found.`);
            callback({ code: grpc.status.NOT_FOUND, details: "Todo not found" });
        }
    },
    // Update a todo by ID
    // Update an existing todo by ID
    UpdateTodo: (call, callback) => {
        const updatedTodo = call.request;
        const todos = readTodos();
        const idx = todos.findIndex(t => t.id === updatedTodo.id);
        if (idx !== -1) {
            todos[idx] = updatedTodo;
            writeTodos(todos);
            console.log(`[UPDATE] Updated todo with ID ${updatedTodo.id}:`, updatedTodo);
            callback(null, updatedTodo);
        } else {
            console.log(`[UPDATE] Todo with ID ${updatedTodo.id} not found.`);
            callback({ code: grpc.status.NOT_FOUND, details: "Todo not found" });
        }
    },
    // Delete a todo by ID
    // Delete all todos with the given ID
    DeleteTodo: (call, callback) => {
        const todoId = call.request.id;
        let todos = readTodos();
        const initialLength = todos.length;
        todos = todos.filter(t => t.id !== todoId);
        if (todos.length < initialLength) {
            writeTodos(todos);
            console.log(`[DELETE] Deleted todo(s) with ID ${todoId}.`);
            callback(null, {});
        } else {
            console.log(`[DELETE] Todo with ID ${todoId} not found.`);
            callback({ code: grpc.status.NOT_FOUND, details: "Todo not found" });
        }
    },
    // List all todos
    ListTodos: (call, callback) => {
        const todos = readTodos();
        console.log(`[LIST] Todos:`, todos);
        callback(null, { todos, requests: [] });
    }
});

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Server running at 0.0.0.0:${port}`);
    server.start();
});



