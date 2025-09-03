// export_bin.js
// This script reads todos.json, encodes the todos array using protobuf, and writes to todos.bin

const fs = require('fs');
const protobuf = require('protobufjs');

const TODOS_JSON_PATH = './todos.json';
const TODOS_BIN_PATH = './todos.bin';
const TODO_PROTO_PATH = './todo.proto';

async function main() {
  // Load the protobuf schema
  const root = await protobuf.load(TODO_PROTO_PATH);
  const TodoList = root.lookupType('todoPackage.TodoList');

  // Read todos from JSON
  const todos = JSON.parse(fs.readFileSync(TODOS_JSON_PATH, 'utf8'));

  // Prepare the message (protobuf expects { todos: [...] })
  const payload = { todos };
  const errMsg = TodoList.verify(payload);
  if (errMsg) throw Error(errMsg);

  // Encode to protobuf binary
  const message = TodoList.create(payload);
  const buffer = TodoList.encode(message).finish();

  // Write binary to file
  fs.writeFileSync(TODOS_BIN_PATH, buffer);
  console.log('Exported todos to protobuf binary:', TODOS_BIN_PATH);
}

main().catch(console.error);
