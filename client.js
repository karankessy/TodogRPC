// Import required modules
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const googleProtoFiles = require("google-proto-files");
const readline = require('readline');

// Load the protobuf definition for the Todo service
// The includeDirs option is necessary to resolve the import of 'google/protobuf/empty.proto'
const packageDef = protoLoader.loadSync("todo.proto", {
        includeDirs: [googleProtoFiles.getProtoPath()]
});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

// Create a gRPC client for the TodoService
// This client connects to the gRPC server at 'localhost:50051'
// createInsecure() establishes a connection without encryption
const client = new todoPackage.TodoService(
        "localhost:50051",
        grpc.credentials.createInsecure()
);

// Create a readline interface for interactive CLI
const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
});

// Helper function to ask a question and return a promise with the answer
function ask(question) {
        return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

// Main function to display the menu and handle user input
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
                        // Option 1: Create a new Todo
                        const id = await ask('Enter ID: ');
                        const title = await ask('Enter Title: ');
                        const description = await ask('Enter Description: ');
                        const completedStr = await ask('Is Completed? (true/false): ');
                        const completed = completedStr.toLowerCase() === 'true';
                        // Call the CreateTodo RPC method
                        client.CreateTodo({ id, title, description, completed }, (err, response) => {
                                if (err) {
                                        console.error('Error creating todo:', err.details || err);
                                } else {
                                        console.log('Todo created:', response);
                                }
                        });
                } else if (choice === '2') {
                        // Option 2: List all Todos
                        // Call the ListTodos RPC method
                        client.ListTodos({}, (err, response) => {
                                if (err) {
                                        console.error('Error listing todos:', err.details || err);
                                } else {
                                        console.log('Todos:', response.todos);
                                }
                        });
                } else if (choice === '3') {
                        // Option 3: Get a Todo by its ID
                        const id = await ask('Enter ID: ');
                        // Call the GetTodo RPC method
                        client.GetTodo({ id }, (err, response) => {
                                if (err) {
                                        console.error('Error getting todo:', err.details || err);
                                } else {
                                        console.log('Fetched Todo:', response);
                                }
                        });
                } else if (choice === '4') {
                        // Option 4: Update an existing Todo
                        const id = await ask('Enter ID to update: ');
                        const title = await ask('Enter new Title: ');
                        const description = await ask('Enter new Description: ');
                        const completedStr = await ask('Is Completed? (true/false): ');
                        const completed = completedStr.toLowerCase() === 'true';
                        // Call the UpdateTodo RPC method
                        client.UpdateTodo({ id, title, description, completed }, (err, response) => {
                                if (err) {
                                        console.error('Error updating todo:', err.details || err);
                                } else {
                                        console.log('Updated Todo:', response);
                                }
                        });
                } else if (choice === '5') {
                        // Option 5: Delete a Todo by its ID
                        const id = await ask('Enter ID to delete: ');
                        // Call the DeleteTodo RPC method
                        client.DeleteTodo({ id }, (err, response) => {
                                if (err) {
                                        console.error('Error deleting todo:', err.details || err);
                                } else {
                                        console.log('Todo deleted.');
                                }
                        });
                } else if (choice === '6') {
                        // Option 6: Exit the client
                        rl.close();
                        break;
                } else {
                        console.log('Invalid choice. Please select 1-6.');
                }
                // Wait a moment for async gRPC responses to be printed before showing the next menu
                await new Promise(res => setTimeout(res, 500));
        }
}

// Start the main menu
mainMenu();