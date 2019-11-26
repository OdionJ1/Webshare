let ImageModel = require('../models/image')
let sidebar = require('../helpers/sidebar')
module.exports = {
    home: function(req, res){
        let viewModel = {
            images: [],
            user:req.user
        }

        ImageModel.find({user_id:req.user._id},{},{sort:{timestamp:-1}}, function(err, images){
            if(err) {
                throw err;
            }

            viewModel.images = images;

            sidebar(viewModel, function(viewModel){
                res.render('index', viewModel)
            })
        });
    }
}