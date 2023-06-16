class Role {
  constructor(id, title, salary, departmentId) {
    this.id = id;
    this.title = title;
    this.salary = salary;
    this.departmentId = departmentId;
  }

  static getAllRoles() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM roles";
      _query(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const roles = rows.map((row) => {
            return new Role(row.id, row.title, row.salary, row.department_id);
          });
          resolve(roles);
        }
      });
    });
  }
  static addRole(title, salary, departmentId) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
      _query(query, [title, salary, departmentId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          const newRoleId = result.insertId;
          const newRole = new Role(newRoleId, title, salary, departmentId);
          resolve(newRole);
        }
      });
    });
  }

  static getRoleById(roleId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM roles WHERE id = ?";
      _query(query, [roleId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          if (rows.length === 0) {
            resolve(null); // Role not found
          } else {
            const role = new Role(
              rows[0].id,
              rows[0].title,
              rows[0].salary,
              rows[0].department_id
            );
            resolve(role);
          }
        }
      });
    });
  }

  updateRoleTitle(newTitle) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE roles SET title = ? WHERE id = ?";
      _query(query, [newTitle, this.id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      });
    });
  }

  deleteRole() {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM roles WHERE id = ?";
      _query(query, [this.id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      });
    });
  }
}
