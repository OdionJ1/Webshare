let commentModel = require('../models/comment')
let ImageModel = require('../models/image')
let async = require('async');

module.exports = {
    newest: function(callback){
        commentModel.find({}, {}, {limits:5, sort: {timestamp: -1}},
            function(err, comments){
                if(err){throw err}

                let attachImage = function(comment, next){
                    ImageModel.findOne({_id:comment.image_id},
                        function(err,image){
                            if(err){throw err}

                            comment.image = image;
                            next(err);
                        })
                }

                async.each(comments, attachImage, function(err){
                    if(err){throw err}

                    callback(null, comments)
                })

            });
    }
}