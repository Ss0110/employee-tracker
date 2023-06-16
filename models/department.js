const connection = require("../config/connections");
const mysql = require("mysql2");

class Department {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  static getAllDepartments() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM departments";
      connection.query(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const departments = rows.map(
            (row) => new Department(row.id, row.name)
          );
          resolve(departments);
        }
      });
    });
  }
  static addDepartment(departmentName) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO departments (name) VALUES (?)";
      connection.query(query, [departmentName], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.insertId);
        }
      });
    });
  }
  static getDepartmentById(departmentId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM departments WHERE id = ?";
      connection.query(query, [departmentId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          if (rows.length === 0) {
            resolve(null); // Department not found
          } else {
            const department = new Department(rows[0].id, rows[0].name);
            resolve(department);
          }
        }
      });
    });
  }

  updateDepartmentName(newName) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE departments SET name = ? WHERE id = ?";
      connection.query(query, [newName, this.id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      });
    });
  }

  deleteDepartment() {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM departments WHERE id = ?";
      connection.query(query, [this.id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      });
    });
  }
  static viewAllDepartments() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM departments";
      connection.query(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          console.log("All Departments:");
          rows.forEach((row) => {
            console.log(`ID: ${row.id} | Name: ${row.name}`);
          });
          resolve();
        }
      });
    });
  }
}

module.exports = Department;
