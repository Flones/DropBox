const PostMessage = require('../models/postMessage')

module.exports.getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();
        console.log(postMessages);
        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
module.exports.createPost = (req, res) => {
    res.send("createPost controller")
}