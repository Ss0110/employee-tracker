-- sample departments
INSERT INTO departments (name)
VALUES ('Sales'), ('Engineering'), ('Marketing'), ('Finance');

-- sample roles
INSERT INTO roles (title, salary, department_id)
VALUES ('Sales Manager', 60000.00, 1),
       ('Sales Representative', 40000.00, 1),
       ('Software Engineer', 80000.00, 2),
       ('Marketing Coordinator', 45000.00, 3),
       ('Finance Manager', 70000.00, 4);

-- sample employees
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
       ('Jane', 'Smith', 2, 1),
       ('Michael', 'Johnson', 3, 1),
       ('Emily', 'Williams', 4, 1),
       ('David', 'Brown', 5, NULL);
