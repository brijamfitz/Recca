var db = require("../models");

module.exports = {
    create: function(req, res){
        req.body.postAuthor = `${req.user.firstName} ${req.user.lastName}`;
        console.log(req.body)
        db.Post
        .create(req.body)
        .then(function(dbPost){
            return db.User.findOneAndUpdate({ _id: req.user._id }, {$push: { posts: dbPost._id }}, {new: true})
        })
        .then(function(dbUserInfo){
            console.log(dbUserInfo);
            res.json(dbUserInfo);
        })
        .catch(err => res.status(422).json(err));
    }
}