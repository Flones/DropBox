const bcrypt = require('bcryptjs'),
      config = require('../../env'),
      jwt = require('jsonwebtoken'); //pour créer, signer et vérifier les jetons
      User = require('../models/user');

//enregistrement d'un utilisateur
module.exports.inscription = (req, res) => {
    //crypter le mot de passe de l'utilisateur
    bcrypt.hash(req.body.password, 10, (err, hashpasswod) =>{
        if(err){
            res.json({
                error: err
            })
        }
        let user = new User({
            username: req.body.username,
            email: req.body.email,
            isActive: true,
            password: hashpasswod
        });
        user.save()
            .then(user => {
                res.json({
                    message: "Utilisateur enregitré avec succès..."
                })
            })
            .catch(err => {
                res.json({
                    message: "Une erreur rencontrée..."
                });
            });
    });

};

// connexion de l'utilisateur avec generation du token
module.exports.connexion =  async (req, res) =>{
    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!user) {
            res.status(400).send({ message: "Cette adresse email n'existe pas..."});
            return;
        }
        var isMathPassword = bcrypt.compareSync(req.body.password, user.password);
        if (!isMathPassword)
            return res.status(401).send({ message: "Mot de passe invalide...", accessToken: null });
        //creation du token de l'utilisateur pour la connexion
        createAccessToken = (_id) => {
            return jwt.sign({ id: _id }, config.cleSecret, {
                expiresIn: 86400 // expire dans 24 heures
            });
        }
        const userToken = createAccessToken(user._id);
        const infoUser = {};
        infoUser.id = user._id;
        infoUser.username = user.username;
        infoUser.isActive = user.isActive;
        return res.status(200).send({ message: "Vous êtes connecté...", userToken: userToken, infoUser: infoUser });
    });
};
