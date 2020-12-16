const config = require('../../env');
const jwt = require('jsonwebtoken');

// vérifier si le token de l'utilsateur est valide pour faire la navigation
module.exports.verifyToken = (req, res, next) => {
    try {
        var token = req.headers['x-access-token'];
        if (!token)
            return res.status(400).send({ message: "Connectez vous SVP..." });
        jwt.verify(token, config.CLE_SECRET, (err, user) => {
            if (err)
                return res.status(400).send({ message: "Authentification invalide" });
            //si tout est ok il peut accéder à la page dédiée
            req.user = user
            next()
        })
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};