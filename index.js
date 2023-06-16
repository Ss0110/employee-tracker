// Require dependencies
const inquirer = require("inquirer");
const Employee = require("./employee");
const Department = require("./department");
const Role = require("./role");

// Menu prompt
function promptMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menuChoice",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      // Handle user's choice
      switch (answers.menuChoice) {
        case "View All Departments":
          // Call function to view all departments
          Department.viewAllDepartments()
            .then((departments) => {
              // Display department data
              console.table(departments);
              promptMenu();
            })
            .catch((error) => {
              console.log("Error:", error);
              promptMenu();
            });
          break;

        case "View All Roles":
          // Call function to view all roles
          Role.viewAllRoles()
            .then((roles) => {
              // Display role data
              console.table(roles);
              promptMenu();
            })
            .catch((error) => {
              console.log("Error:", error);
              promptMenu();
            });
          break;

        case "View All Employees":
          // Call function to view all employees
          Employee.viewAllEmployees()
            .then((employees) => {
              // Display employee data
              console.table(employees);
              promptMenu();
            })
            .catch((error) => {
              console.log("Error:", error);
              promptMenu();
            });
          break;

        case "Add a Department":
          // Call function to add a department
          // Implement the necessary inquirer prompt and model function
          break;

        case "Add a Role":
          // Call function to add a role
          // Implement the necessary inquirer prompt and model function
          break;

        case "Add an Employee":
          // Call function to add an employee
          // Implement the necessary inquirer prompt and model function
          break;

        case "Update an Employee Role":
          // Call function to update an employee role
          // Implement the necessary inquirer prompt and model function
          break;

        case "Exit":
          console.log("Goodbye!");
          process.exit();

        default:
          console.log("Invalid choice. Please try again.");
          promptMenu();
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// Initialize the application
function startApp() {
  console.log("Welcome to the Employee Tracker!");
  promptMenu();
}

// Start the application
startApp();
