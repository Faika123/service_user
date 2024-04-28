const mysql = require('mysql');

module.exports = {
  db: mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pfe1'
  }),
  jwtSecret: 'your_jwt_secret'
};
