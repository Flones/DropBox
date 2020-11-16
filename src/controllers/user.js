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

// connexion de l'utilisateur
module.exports.connexion = async (req, res) =>{
    try {
        const user =  User.findOne({email:req.body.email})
        if(!user)
            return res.status(400).json({ message: "Cette adresse email n'existe pas..." });
        const isMathPassword =  bcrypt.compare(req.body.password, user.password);
        if(!isMathPassword)
            return res.status(400).json({ message: "Mot de passe incorrect...", token: null });
        //créer un token  de l'utilisateur et le connecter si les informations sont valides
        createAccessToken = (_id) => {
            return jwt.sign({ id: _id }, config.cleSecret, {
                expiresIn: 86400 // expire dans 24 heures
            });
        }
        const userToken = createAccessToken(user._id);
        let infoUser = {};
        infoUser.id = user._id;
        infoUser.username = user.username;
        infoUser.isActive = user.isActive;
        return res.status(200).send({ message: "Vous êtes connecté...",token: userToken, infoUser : infoUser});
    } catch (err) {
        return res.status(500).json({ message: err.message});
    }
};



    




        


