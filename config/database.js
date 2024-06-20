const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'mysql-service', // Utilisez l'adresse IP de votre serveur MySQL
  // host: process.env.MYSQL_HOST || '127.0.0.1', // Utilisez l'adresse IP de votre serveur MySQL
  port: process.env.MYSQL_PORT || 33060, // Changez 33060 à 3308
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'pfe1'
});

db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données : ', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

module.exports = db;
