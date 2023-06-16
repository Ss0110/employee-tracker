const connection = require("../config/connection");

class Employee {
  constructor(id, firstName, lastName, roleId, managerId) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.roleId = roleId;
    this.managerId = managerId;
  }

  // function to retrieve all employees from database
  static getAllEmployees() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM employees";
      connection.query(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const employees = rows.map(
            (row) =>
              new Employee(
                row.id,
                row.firstName,
                rowlastName,
                row.roleId,
                row.managerId
              )
          );
          resolve(employees);
        }
      });
    });
  }

  static addEmployee(firstName, lastName, roleId, managerId) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO employees (firstName, lastName, roleId, managerId) VALUES (?, ?, ?, ?)";
      connection.query(
        query,
        [firstName, lastName, roleId, managerId],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.insertId);
          }
        }
      );
    });
  }

  static updateEmployeeRole(employeeId, newRoleId) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE employees SET roleId = ? WHERE id = ?";
      connection.query(query, [newRoleId, employeeId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows);
        }
      });
    });
  }
  static deleteEmployee(employeeId) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM employees WHERE id = ?";
      connection.query(query, [employeeId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows);
        }
      });
    });
  }

  // Function to retrieve an employee from the database by their ID
  static getEmployeeById(employeeId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM employees WHERE id = ?";
      connection.query(query, [employeeId], (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length === 0) {
          resolve(null); // Employee not found
        } else {
          const { id, firstName, lastName, roleId, managerId } = rows[0];
          const employee = new Employee(
            id,
            firstName,
            lastName,
            roleId,
            managerId
          );
          resolve(employee);
        }
      });
    });
  }
}

module.export = Employee;
