const mysql = require("mysql2");
const inquirer = require("inquirer");

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_tracker",
});

// Connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the employee database.");
  // Start the application
  start();
});

// Prompt the user to select an action
function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "Exit":
          connection.end();
          console.log("Goodbye!");
          break;
      }
    });
}

// Query the database to view all departments
function viewDepartments() {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// Query the database to view all roles
function viewRoles() {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// Query the database to view all employees
function viewEmployees() {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// Prompt the user to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Enter the name of the department:",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.name,
        },
        (err) => {
          if (err) throw err;
          console.log("Department added successfully!");
          start();
        }
      );
    });
}

// Prompt the user to add a role
function addRole() {
  // Retrieve the list of departments from the database
  connection.query("SELECT * FROM department", (err, departments) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Enter the title of the role:",
        },
        {
          name: "salary",
          type: "input",
          message: "Enter the salary for the role:",
        },
        {
          name: "departmentId",
          type: "list",
          message: "Select the department for the role:",
          choices: departments.map((department) => ({
            name: department.name,
            value: department.id,
          })),
        },
      ])
      .then((answer) => {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.departmentId,
          },
          (err) => {
            if (err) throw err;
            console.log("Role added successfully!");
            start();
          }
        );
      });
  });
}

// Prompt the user to add an employee
function addEmployee() {
  // Retrieve the list of roles from the database
  connection.query("SELECT * FROM role", (err, roles) => {
    if (err) throw err;
    // Retrieve the list of employees from the database
    connection.query("SELECT * FROM employee", (err, employees) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "Enter the first name of the employee:",
          },
          {
            name: "lastName",
            type: "input",
            message: "Enter the last name of the employee:",
          },
          {
            name: "roleId",
            type: "list",
            message: "Select the role for the employee:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
          {
            name: "managerId",
            type: "list",
            message: "Select the manager for the employee:",
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
        ])
        .then((answer) => {
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.firstName,
              last_name: answer.lastName,
              role_id: answer.roleId,
              manager_id: answer.managerId,
            },
            (err) => {
              if (err) throw err;
              console.log("Employee added successfully!");
              start();
            }
          );
        });
    });
  });
}

// Prompt the user to update an employee's role
function updateEmployeeRole() {
  // Retrieve the list of employees from the database
  connection.query("SELECT * FROM employee", (err, employees) => {
    if (err) throw err;
    // Retrieve the list of roles from the database
    connection.query("SELECT * FROM role", (err, roles) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "employeeId",
            type: "list",
            message: "Select the employee to update:",
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
          {
            name: "roleId",
            type: "list",
            message: "Select the new role for the employee:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((answer) => {
          connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
              {
                role_id: answer.roleId,
              },
              {
                id: answer.employeeId,
              },
            ],
            (err) => {
              if (err) throw err;
              console.log("Employee role updated successfully!");
              start();
            }
          );
        });
    });
  });
}
