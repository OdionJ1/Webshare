let async = require('async');
let ImageModel = require('../models/image')
let CommentModel = require('../models/comment')

module.exports = function(callback){
    async.parallel([
        function(next){
            ImageModel.countDocuments({}, function(err, images){
                next(null, images)
            })
        },
        function(next){
            CommentModel.countDocuments({}, function(err, comments){
                next(null, comments)
            })
        },
        function(next){
            ImageModel.aggregate([{$group:{_id:1, viewTotal:{$sum:'$views'}}}], function(err, viewsTotal){
                if(viewsTotal.length > 0){
                    next(null, viewsTotal[0].viewTotal);   
                    } else {next(null , 0)}
            });
        },
        function(next){
            ImageModel.aggregate([{$group:{_id:1, likeTotal:{$sum:'$likes'}}}], function(err, likesTotal){
                if(likesTotal.length > 0){
                    next(null, likesTotal[0].likeTotal);   
                    } else {next(null , 0)}
            });
        },
    
    ], function(err, results){
        let stats = {
            images:results[0],
            comments:results[1],
            views:results[2],
            likes:results[3]
        }

        callback(null, stats);
    });
}