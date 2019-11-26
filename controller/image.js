let path = require('path');
let fs = require('fs');
let ImageModel = require('../models/image')
let CommentModel = require('../models/comment')
let md5 = require('md5');
let sidebar = require('../helpers/sidebar')

module.exports = {
    index: function(req, res){
        let viewModel = {
            image:{},
            user:req.user

        }

        ImageModel.findOne({'filename':{$regex:req.params.image_id}}, 
        function(err, image) {

            image.views = image.views + 1;
            image.save(function(err){
                if(err){
                    throw err;
                }
                
            });

            viewModel.image = image;

            CommentModel.find({'image_id': image._id}, function(err, comments){
                if(err){
                    throw err;
                }

                viewModel.comments = comments;

                sidebar(viewModel, function(viewModel){
                    res.render('image', viewModel)
                })
            }); 
        });
    },
    create: function(req,res){
        function saveImage(){
            let possible = 'abcdefghijklmnopqrstuvwxyz0123456789'
            let imgUrl = '';

            for(i=0; i<6; i+=1){
                imgUrl += possible.charAt(Math.floor(Math.random() *possible.length));
            }

            ImageModel.find({'filename':{$regex:imgUrl}} , function(err, images) {
                if (err){
                    throw err;
                }

                if(images.length > 0) {
                    saveImage();
                } else {
                    let tempPath = req.file.path;
                    let ext = path.extname(req.file.originalname).toLowerCase();
                    let targePath = path.resolve('./public/upload/' + imgUrl + ext);

                    if(ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif'){
                    fs.rename(tempPath, targePath, function(err){
                        if(err) {
                            throw err;
                        }

                let newImg = new ImageModel({
                    filename: imgUrl + ext,
                    title:req.body.title,
                    description:req.body.description,
                    user_id:req.user._id
                });

                newImg.save(function(){
                    if(err){
                        throw err
                    }

                    res.redirect('/logged')
                });

                
                });   
                } else {
                    fs.unlink(tempPath, function(err) {
                        if(err){
                            throw err;
                        }

                res.status(500).json({'Error': 'Invalid File Format'});
                });
                }
                }
            })

            
        }
        saveImage();

    },
    like: function(req, res){       /// likes increment
        ImageModel.findOne({'filename':{$regex:req.params.image_id}}, function(err, image){
            if(!err && image){
                image.likes += 1;
                image.save(function(){
                    if(err){
                        res.json(err);
                    }else{
                        res.json({'Likes': image.likes})
                    }
                });
            }else{
                res.redirect('/logged')
            }
        });
    },
    remove:function(req, res){
        ImageModel.findOne({'filename':{$regex:req.params.image_id}}, function(err, image){
             if(err){
                throw err;
            
             } 
             if (image){
                fs.unlink(path.resolve('./public/upload/' + image.filename),function(err){
                   if(err){
                         throw err;
                      }

                      CommentModel.remove({'image_id':image._id}, function(err){
                        if(err){
                            throw err;
                        
                        } 
                        
                        image.remove(function(err){
                            if(err){
                               res.json(err);
                          }else{
                               res.json(true);
                           }
                        });
                    });
                });
            }else{
                res.redirect('/logged');
            }
        });
    },
            comment:function(req, res){
                ImageModel.findOne({'filename':{$regex:req.params.image_id}}, function(err,
                    image){
                        if(!err && image){
                            let newComment = new CommentModel(req.body);
                            newComment.image_id = image._id;
                            newComment.gravatar = md5(req.body.email);

                            newComment.save(function(err,comment){
                                if(err){
                                    throw err
                                } else {
                                    res.redirect('/image/' + image.uniqueId + '#' + comment._id)
                                };
                                
                            });
                        } else {
                            res.redirect('/logged')
                        }
        });
    }
}
