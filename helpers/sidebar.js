let async = require('async');
let images = require('./images');
let comments = require('./comments');
let stats = require('./stats');

module.exports = function(viewModel, callback){
    async.parallel([
        function(next){
            stats(next)
        },
        function(next){
            images.popular(next);

        },
        function(next){
            comments.newest(next);
        }
    ], function(err, results){
        viewModel.sidebar = {
            stats:results[0],
            images:results[1],
            comments:results[2]
        }

        callback(viewModel)
    });
}