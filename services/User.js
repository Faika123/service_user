const { db } = require('../database');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY || 'votreclésecrete'; 

const ERROR_MESSAGE = 'L\'authentification a échoué';
const SUCCESS_MESSAGE = 'L\'authentification a réussi';

exports.loginUser = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;
        // Validation des champs requis
        if (!email || !mot_de_passe) {
            throw new Error('Les champs "email" et "mot_de_passe" sont requis.');
        }

        // Vérification si l'utilisateur existe dans la base de données
        db.query('SELECT * FROM utilisateur WHERE email = ? AND mot_de_passe = ?', [email, mot_de_passe], async (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erreur interne du serveur' });
            }

            if (result.length === 0) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            }

            // Génération du token JWT si l'utilisateur existe et que le mot de passe est correct
            const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
            res.json({ token, message: 'Connexion réussie' });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};



exports.signupUser = async (req, res) => {
    try {
        const { nom, prenom, email, mot_de_passe, tel, photo_url } = req.body;

        // Vérification si l'utilisateur existe déjà
        const existingUser = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM utilisateur WHERE email = ?', [email], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Création d'un nouvel utilisateur
        db.query('INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, tel, photo_url) VALUES (?, ?, ?, ?, ?, ?)', 
            [nom, prenom, email, mot_de_passe, tel, photo_url], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Server error' });
            }

            res.status(201).json({ message: 'User created successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.loginAdmin =  (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;
       
        if (!email || !mot_de_passe) {
            throw new Error('Les champs "email" et "mot_de_passe" sont requis.');
        }
       
        if (email === 'admin' && email === 'admin') {
            const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
            res.json({ token, message: SUCCESS_MESSAGE });
        } else {
            res.status(401).json({ message: ERROR_MESSAGE });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};