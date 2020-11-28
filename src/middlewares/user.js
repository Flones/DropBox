const User = require('../models/user');


//Valider l'adresse email de l'utilisateur
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
// vérifier que tous les champs sont renseignés
module.exports.verifyPostData = async(req, res, next) => {
    if (!req.body.username)
        return res.status(401).send({ message: 'Aucun username fourni' });
    if (!req.body.email)
        return res.status(401).send({ message: 'Aucun email fourni' });
    if (!validateEmail(req.body.email))
        return res.status(401).send({ message: 'Adresse email invalide' });
    if (!req.body.password)
        return res.status(401).send({ message: 'Aucun Mot de passe fourni' });
    if (req.body.password.length < 4)
        return res.status(401).send({ message: 'Mot de passe trop court' });
    next();
};

// vérifier les duplications du username et de email avant l'enregistrement en BD
module.exports.checkDuplicateData = async(req, res, next) => {
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

//Middelware pour l'email et password avant la connexion
module.exports.verifyLoginData = async(req, res, next) => {
    if (!req.body.email)
        return res.status(401).send({ message: 'Aucun email fourni' });
    if (!req.body.password)
        return res.status(401).send({ message: 'Aucun Mot de passe fourni' });
    next();

};

//Middelware pour la validité de l'email de renitialisation du mot de passe
module.exports.emailForgotPassword = (req, res, next) => {
    if (!req.body.email)
        return res.status(401).send({ message: "Veuillez saisir votre email" })
    next();
}

// Middelware pour la validité de l'email de renitialisation du mot de passe
module.exports.verifynewPassword = (req, res, next) => {
    if (!req.body.password)
        return res.status(401).send({ message: "Veuillez saisir votre nouveau mot de passe" })
    if (req.body.password.length < 4)
        return res.status(401).send({ message: "Mot de passe trop court" })
    next();
}