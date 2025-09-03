// Import required modules
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const googleProtoFiles = require("google-proto-files");

// Load the protobuf definition for the Todo service
const packageDef = protoLoader.loadSync("todo.proto", {
        includeDirs: [googleProtoFiles.getProtoPath()]
});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

// Create a gRPC client for the TodoService
const client = new todoPackage.TodoService(
        "localhost:50051",
        grpc.credentials.createInsecure()
);

const readline = require('readline');

const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
});

function ask(question) {
        return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

async function mainMenu() {
        while (true) {
                console.log('\nTodo gRPC Client Menu:');
                console.log('1. Create Todo');
                console.log('2. List Todos');
                console.log('3. Get Todo by ID');
                console.log('4. Update Todo');
                console.log('5. Delete Todo');
                console.log('6. Exit');
                const choice = await ask('Choose an option (1-6): ');

                if (choice === '1') {
                        // Create Todo
                        const id = await ask('Enter ID: ');
                        const title = await ask('Enter Title: ');
                        const description = await ask('Enter Description: ');
                        const completedStr = await ask('Is Completed? (true/false): ');
                        const completed = completedStr.toLowerCase() === 'true';
                        client.CreateTodo({ id, title, description, completed }, (err, response) => {
                                if (err) {
                                        console.error('Error creating todo:', err.details || err);
                                } else {
                                        console.log('Todo created:', response);
                                }
                        });
                } else if (choice === '2') {
                        // List Todos
                        client.ListTodos({}, (err, response) => {
                                if (err) {
                                        console.error('Error listing todos:', err.details || err);
                                } else {
                                        console.log('Todos:', response.todos);
                                }
                        });
                } else if (choice === '3') {
                        // Get Todo by ID
                        const id = await ask('Enter ID: ');
                        client.GetTodo({ id }, (err, response) => {
                                if (err) {
                                        console.error('Error getting todo:', err.details || err);
                                } else {
                                        console.log('Fetched Todo:', response);
                                }
                        });
                } else if (choice === '4') {
                        // Update Todo
                        const id = await ask('Enter ID to update: ');
                        const title = await ask('Enter new Title: ');
                        const description = await ask('Enter new Description: ');
                        const completedStr = await ask('Is Completed? (true/false): ');
                        const completed = completedStr.toLowerCase() === 'true';
                        client.UpdateTodo({ id, title, description, completed }, (err, response) => {
                                if (err) {
                                        console.error('Error updating todo:', err.details || err);
                                } else {
                                        console.log('Updated Todo:', response);
                                }
                        });
                } else if (choice === '5') {
                        // Delete Todo
                        const id = await ask('Enter ID to delete: ');
                        client.DeleteTodo({ id }, (err, response) => {
                                if (err) {
                                        console.error('Error deleting todo:', err.details || err);
                                } else {
                                        console.log('Todo deleted.');
                                }
                        });
                } else if (choice === '6') {
                        rl.close();
                        break;
                } else {
                        console.log('Invalid choice. Please select 1-6.');
                }
                // Wait a moment for async gRPC responses to print before next menu
                await new Promise(res => setTimeout(res, 500));
        }
}

mainMenu();