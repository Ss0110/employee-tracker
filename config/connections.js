const mysql = require("mysql2");

const connection = mysql.createPool({
  host: "localhost",
  user: "your_username",
  password: "your_password",
  databse: "youre_database_name",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = connection.promise();
