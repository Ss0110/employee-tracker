const inquirer = require("inquirer");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_tracker",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the employee database.");
  start();
});

// Function to start the application and prompt the user for actions
function start() {
  // Prompt user for actions using inquirer
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
      // Call the corresponding function based on the user's choice
      switch (answer.action) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
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
          break;
      }
    });
}

// Function to view all departments
function viewAllDepartments() {
  connection.query("SELECT * FROM departments", (err, results) => {
    if (err) throw err;
    console.table(results);
    start();
  });
}

// Function to view all roles
function viewAllRoles() {
  connection.query(
    `SELECT roles.id, roles.title, roles.salary, departments.name AS department 
     FROM roles
     LEFT JOIN departments ON roles.department_id = departments.id`,
    (err, results) => {
      if (err) throw err;
      console.table(results);
      start();
    }
  );
}

// Function to view all employees
function viewAllEmployees() {
  const query = `
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary,
    CONCAT(managers.first_name, ' ', managers.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees managers ON employees.manager_id = managers.id`;
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    start();
  });
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Enter the name of the department:",
        validate: (value) => {
          if (value) {
            return true;
          } else {
            return "Please enter a department name.";
          }
        },
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO departments SET ?",
        { name: answer.name },
        (err, result) => {
          if (err) throw err;
          console.log(`Department '${answer.name}' added successfully.`);
          start();
        }
      );
    });
}

// Function to add a role
function addRole() {
  // Retrieve the list of departments from the database
  connection.query("SELECT * FROM departments", (err, departments) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Enter the title of the role:",
          validate: (value) => {
            if (value) {
              return true;
            } else {
              return "Please enter a role title.";
            }
          },
        },
        {
          name: "salary",
          type: "input",
          message: "Enter the salary for the role:",
          validate: (value) => {
            if (value && !isNaN(value)) {
              return true;
            } else {
              return "Please enter a valid salary.";
            }
          },
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
          "INSERT INTO roles SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.departmentId,
          },
          (err, result) => {
            if (err) throw err;
            console.log(`Role '${answer.title}' added successfully.`);
            start();
          }
        );
      });
  });
}

// Function to add an employee
function addEmployee() {
  // Retrieve the list of roles and employees from the database
  connection.query("SELECT * FROM roles", (err, roles) => {
    if (err) throw err;

    connection.query("SELECT * FROM employees", (err, employees) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "Enter the employee's first name:",
            validate: (value) => {
              if (value) {
                return true;
              } else {
                return "Please enter the employee's first name.";
              }
            },
          },
          {
            name: "lastName",
            type: "input",
            message: "Enter the employee's last name:",
            validate: (value) => {
              if (value) {
                return true;
              } else {
                return "Please enter the employee's last name.";
              }
            },
          },
          {
            name: "roleId",
            type: "list",
            message: "Select the employee's role:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
          {
            name: "managerId",
            type: "list",
            message: "Select the employee's manager:",
            choices: [
              { name: "None", value: null },
              ...employees.map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
              })),
            ],
          },
        ])
        .then((answer) => {
          connection.query(
            "INSERT INTO employees SET ?",
            {
              first_name: answer.firstName,
              last_name: answer.lastName,
              role_id: answer.roleId,
              manager_id: answer.managerId,
            },
            (err, result) => {
              if (err) throw err;
              console.log("Employee added successfully.");
              start();
            }
          );
        });
    });
  });
}

// Function to update an employee role
function updateEmployeeRole() {
  // Retrieve the list of employees and roles from the database
  connection.query("SELECT * FROM employees", (err, employees) => {
    if (err) throw err;

    connection.query("SELECT * FROM roles", (err, roles) => {
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
            message: "Select the employee's new role:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((answer) => {
          connection.query(
            "UPDATE employees SET ? WHERE ?",
            [{ role_id: answer.roleId }, { id: answer.employeeId }],
            (err, result) => {
              if (err) throw err;
              console.log("Employee role updated successfully.");
              start();
            }
          );
        });
    });
  });
}
