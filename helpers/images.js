let imageModel = require('../models/image');

module.exports = {
    popular: function(callback){
        imageModel.find({}, {}, {limits:9, sort: {likes: -1}},
            function(err, images){
                if(err){throw err}

                callback(null, images);
            });
    }
}