const readline = require('readline');

let employees = [
    { name: 'Alice', id: 'E101' },
    { name: 'Bob', id: 'E102' },
    { name: 'Charlie', id: 'E103' }
];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function displayMenu() {
    console.log('\nEmployee Management System');
    console.log('1. Add Employee');
    console.log('2. List Employees');
    console.log('3. Remove Employee');
    console.log('4. Exit');
}

function addEmployee() {
    rl.question('Enter employee name: ', (name) => {
        rl.question('Enter employee ID: ', (id) => {
            const exists = employees.some(emp => emp.id === id);
            if (exists) {
                console.log(`Error: Employee with ID ${id} already exists.`);
            } else {
                employees.push({ name: name, id: id });
                console.log(`Employee ${name} (ID: ${id}) added successfully.`);
            }
            promptUser();
        });
    });
}

function listEmployees() {
    console.log('\nEmployee List:');
    if (employees.length === 0) {
        console.log('No employees in the system.');
    } else {
        employees.forEach((employee, index) => {
            console.log(`${index + 1}. Name: ${employee.name}, ID: ${employee.id}`);
        });
    }
    promptUser();
}

function removeEmployee() {
    rl.question('Enter employee ID to remove: ', (idToRemove) => {
        const initialLength = employees.length;
        const employeeToRemove = employees.find(emp => emp.id === idToRemove);

        employees = employees.filter(employee => employee.id !== idToRemove);

        if (employees.length < initialLength) {
            console.log(`Employee ${employeeToRemove.name} (ID: ${idToRemove}) removed successfully.`);
        } else {
            console.log(`Error: Employee with ID ${idToRemove} not found.`);
        }
        
        promptUser();
    });
}

function promptUser() {
    displayMenu();
    rl.question('Enter your choice: ', (choice) => {
        switch (choice.trim()) {
            case '1':
                addEmployee();
                break;
            case '2':
                listEmployees();
                break;
            case '3':
                removeEmployee();
                break;
            case '4':
                console.log('Exiting Employee Management System. Goodbye! 👋');
                rl.close();
                break;
            default:
                console.log('Invalid choice. Please enter a number between 1 and 4.');
                promptUser();
                break;
        }
    });
}

promptUser();