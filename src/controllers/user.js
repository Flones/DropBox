const bcrypt = require('bcryptjs');
const config = require('../../env');
const jwt = require('jsonwebtoken'); //pour créer, signer et vérifier les jetons
const User = require('../models/user');
const sendMail = require('./sendMail');
//connexion avec google 
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const fetch = require('node-fetch')

const client = new OAuth2(config.ID_CLIENT_SERVICE_MAIL)

const { CLIENT_URL } = config


//enregistrement d'un utilisateur
module.exports.inscription = (req, res) => {
        //crypter le mot de passe de l'utilisateur
        bcrypt.hash(req.body.password, 10, (err, hashpasswod) => {
            if (err) {
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

    },

    // connexion de l'utilisateur avec generation du token
    module.exports.connexion = async(req, res) => {
        User.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (!user) {
                res.status(400).send({ message: "Cette adresse email n'existe pas" });
                return;
            }
            var isMathPassword = bcrypt.compareSync(req.body.password, user.password);
            if (!isMathPassword)
                return res.status(401).send({ message: "Mot de passe invalide", accessToken: null });
            //creation du token de l'utilisateur pour la connexion
            createAccessToken = (_id) => {
                return jwt.sign({ id: _id }, config.CLE_SECRET, {
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
    },

    // Connexion des utilisateurs avec le compte google
    module.exports.googleLogin = async(req, res) => {
        try {
            const { tokenId } = req.body

            const verify = await client.verifyIdToken({ idToken: tokenId, audience: config.ID_CLIENT_SERVICE_MAIL })

            const { email_verified, email, name } = verify.payload

            const password = email + config.GOOGLE_SECRET

            const passwordHash = await bcrypt.hash(password, 10)

            if (!email_verified) return res.status(400).json({ msg: "Email de vérification n'est pas valide." })

            const user = await User.findOne({ email })

            if (user) {
                const isMathPassword = bcrypt.compareSync(password, user.password);
                if (!isMathPassword) return res.status(400).json({ msg: "Le mot de passe est incorrect" })
                res.json({ msg: "Vous êtes!" })
            } else {
                const newUser = new User({
                    username: name,
                    email: email,
                    password: passwordHash,
                    isActive: true
                })
                await newUser.save()
                res.json({ msg: "Vous êtes connecté" })
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    // Connexion des utilisateurs avec le compte facebook
    module.exports.facebookLogin = async(req, res) => {
        try {
            const { accessToken, userID } = req.body

            const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`

            const data = await fetch(URL).then(res => res.json()).then(res => { return res })

            const { email, name } = data

            const password = email + config.FACEBOOK_SECRET

            const passwordHash = await bcrypt.hash(password, 10)

            const user = await User.findOne({ email })

            if (user) {
                const isMathPassword = bcrypt.compareSync(password, user.password)
                if (!isMathPassword) return res.status(400).json({ msg: "Le mot de passe est incorrect" })
                res.json({ msg: "Vous êtes connecté" })
            } else {
                const newUser = new User({
                    username: name,
                    email: email,
                    password: passwordHash,
                    isActive: true
                })
                await newUser.save()
                res.json({ msg: "Vous êtes connecté" })
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    //Envoyer un email à l'utilisateur pour renitialiser son mot de passe
    module.exports.forgotPassword = async(req, res) => {
        try {
            User.findOne({
                email: req.body.email
            }).exec((err, user) => {
                if (err) return res.status(500).send({ message: err });
                if (!user) return res.status(400).send({ message: "Cette adresse email n'existe pas" });
                //si ok, générer le token et envoi d'email
                createAccessToken = (_id) => {
                    return jwt.sign({ id: _id }, config.CLE_SECRET, {
                        expiresIn: 86400 // expire dans 24 heures
                    });
                }
                console.log(req.body.email)
                const accessToken = createAccessToken(user._id)
                const url = `${config.CLIENT_URL}/user/reset/${accessToken}`
                sendMail(req.body.email, url, "Nouveau mot de passe");
                res.status(200).send({ message: "Vérifier votre boite email afin de finaliser la renitialisation" });
            });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    //Rénitialisation du mot de passe de l'utilisateur
    module.exports.resetPassword = async(req, res) => {
        try {
            const { password } = req.body
            const passwordHash = await bcrypt.hash(password, 10);
            await User.findByIdAndUpdate({ _id: req.user.id }, {
                password: passwordHash
            })
            res.status(200).send({ message: 'Mot de passe rénitialisé avec succès' });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    // récuper les informartions de l'utilisateur courant
    module.exports.findOneUser = async(req, res) => {
        try {
            User.findById(req.user.id, { password: 0 }, (err, user) => {
                if (err) return res.status(500).send("There was a problem finding the user.");
                if (!user) return res.status(404).send("No user found.");
                res.status(200).send(user)
            });
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    },

    // récuper les informartions des utilisateurs sans le mot de passe
    module.exports.findAllUsers = async(req, res) => {
        try {
            User.find({}, function(err, users) {
                if (err) return res.status(500).send("Un problème dans le recherche des utilisateurs");
                res.status(200).send(users);
            });
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    }

// Suppression d'un utilisateur
module.exports.deleteUser = async(req, res) => {
    try {
        await User.findByIdAndRemove(req.params.id, (err, user) => {
            if (err) return res.status(500).send("Un problème dans la suppression de l'utilisateur");
            res.status(200).send({ message: "Utilisateur supprimé avec succès" });
        })
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }

}

//Déconnecter un utilisateur
module.exports.LogoutUser = async(req, res) => {
    try {
        res.status(200).send({ auth: false, token: null });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }

}

