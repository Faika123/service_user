const express = require('express');
const router = express.Router();
const controller = require('../controllers/UserController');
const service = require('../services/User');

router.get('/lister', controller.listerUser);
router.get('/:id/listerbyid', controller.getUserById);
router.post('/ajouter', controller.ajouterUser);
router.put('/:id/modifier', controller.modifierUser);
router.delete('/:id/supprimer', controller.supprimerUser);
router.get('/rechercher', controller.rechercherUser);
router.post('/login', service.loginUser);
router.post('/signup', service.signupUser);
router.post('/loginAdmin', service.loginAdmin);



module.exports = router;
