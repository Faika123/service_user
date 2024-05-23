const db = require('../config/database');
const UserService = require('../services/User');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, ".\assets\img");
		cb(null, "C:\Users\ASUS\faika\src\assets\img");
	},
	filename: function (req, file, cb) {
		return cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
	}
});

exports.ajouterUser =  (req, res) => {
    const { nom, prenom, email, mot_de_passe, tel, photo_url} = req.body;
    if (!nom || !prenom || !email || !mot_de_passe || !tel || !photo_url) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    db.query('INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, tel, photo_url) VALUES (?, ?, ?, ?, ?, ?)', 
        [nom, prenom, email, mot_de_passe, tel, type_utilisateur, photo_url], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erreur interne du serveur.' });
        }

        return res.status(201).json({ message: 'Utilisateur ajouté avec succès.' });
    });
};

exports.listerUser = (req, res) => {
    db.query('SELECT * FROM utilisateur', (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        return res.status(200).json(result);
    });
};

exports.getUserById = (req, res) => {
    const id = req.params.id;

    db.query('SELECT * FROM utilisateur WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erreur interne du serveur.' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Aucun utilisateur trouvé avec cet ID.' });
        }

        return res.status(200).json(result[0]);
    });
};

exports.modifierUser = (req, res) => {
    const { nom, prenom, email, mot_de_passe, tel, photo_url} = req.body;
    const id = req.params.id;

    if (!nom || !prenom || !email || !mot_de_passe || !tel || !photo_url ) {
        return res.status(400).json({ message: 'Tous les champs sont requis pour la modification.' });
    }

    db.query('UPDATE utilisateur SET nom = ?, prenom = ?, email = ?, mot_de_passe = ?, tel = ?, photo_url = ? WHERE id = ?', 
        [nom, prenom, email, mot_de_passe, tel, photo_url, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erreur interne du serveur.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Aucun utilisateur trouvé avec cet ID.' });
        }

        return res.status(200).json({ message: 'Utilisateur modifié avec succès.' });
    });
};

exports.supprimerUser = (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM utilisateur WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erreur interne du serveur.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Aucun utilisateur trouvé avec cet ID.' });
        }

        return res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
    });
};

exports.rechercherUser = (req, res) => {
    const { nom, prenom, email, tel } = req.query;
    let conditions = [];
    let params = [];

    if (nom) {
        conditions.push('nom LIKE ?');
        params.push(`%${nom}%`);
    }
    if (prenom) {
        conditions.push('prenom LIKE ?');
        params.push(`%${prenom}%`);
    }
    if (email) {
        conditions.push('email LIKE ?');
        params.push(`%${email}%`);
    }
  
    if (tel) {
        conditions.push('tel = ?');
        params.push(tel);
    }

    if (conditions.length === 0) {
        return res.status(400).json({ message: 'Au moins un critère de recherche est requis.' });
    }

    const whereClause = conditions.join(' AND ');

    db.query(`SELECT * FROM utilisateur WHERE ${whereClause}`, params, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erreur interne du serveur.' });
        }

        return res.status(200).json(result);
    });
};


