const User = require('../models/user');

// vérifier que tous les champs sont renseignés
module.exports.verifyPostData  = async (req, res, next) =>{
    if (!req.body.username)
        return res.status(401).send({ message: 'Aucun username fourni' });
    if (!req.body.email)
        return res.status(401).send({ message: 'Aucun email fourni' });
    if (!req.body.password)
        return res.status(401).send({ message: 'Aucun Mot de passe fourni' });
    next();
};

// vérifier les duplications du username et de email 
module.exports.checkDuplicateData = async (req, res, next) => {
    //Username
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (user) {
            res.status(400).send({ message: "username déjà utilisé..." });
            console.log("username déjà utilisé...");
            return;
        }

        // Email
        User.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (user) {
                res.status(400).send({ message: "Adresse mail déjà utilisé..." });
                return;
            }

            next();
        });
    });
};

