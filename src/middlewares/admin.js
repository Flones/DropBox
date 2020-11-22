const User = require('../models/user');

// ajouter un rôle d'administration
module.exports.RoleAdmin = async(req, res, next) => {
    try {
        User.findById(req.userId, { password: 0 }, (err, user) => {
            if (user.role !== 1)
                return res.status(500).send({ message: "Vous ne disposez pas des droit Admin" });
            next()
        });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
}