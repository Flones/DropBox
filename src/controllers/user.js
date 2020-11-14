const   bcrypt = require('bcryptjs'),
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
                    message: "Une erreur rencontrée...."
                });
            });
    });

};



    




        


