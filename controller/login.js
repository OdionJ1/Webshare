let UserModel = require('../models/user');

module.exports = {
	signin: function(req, res){
		let viewModel = {
			layout:'login',
			loginError:req.flash('loginError'),
			resetSuccess:req.flash('resetSuccess')
		}

		res.render('login', viewModel);
	},
	signup: function(req, res){
		req.check('firstname','Firstname cannot be empty').trim().notEmpty();
		req.check('firstname','Only Letter are allowed for Firstname').isAlpha();
		req.check('surname','Surname cannot be empty').trim().notEmpty();
		req.check('surname','Only Letter are allowed for Surname').isAlpha();
		req.check('email', 'Email cannot be empty').trim().notEmpty();
		req.check('email', 'Please enter a valid Email').isEmail();
		req.check('password', 'Password cannot be Empty').trim().notEmpty();
		req.check('password','Password Must Not be less than 8 characters').trim().isLength({min:8});
		req.check('confirmpassword', 'Confirm Password cannot be Empty').trim().notEmpty();
		req.check('password', 'Password do not Match Confirm Password').equals(req.body.confirmpassword);

		let errors = req.validationErrors();

		if(errors){
			res.json(errors);
		}else{
			UserModel.findOne({email:req.body.email}, function(err, user){
				if(err){throw err;}

				if(user){
					res.send('User Already Exist!');
				}else{
					let newUser = new UserModel();
					newUser.firstname = req.body.firstname;
					newUser.surname = req.body.surname;
					newUser.email = req.body.email;
					newUser.password = newUser.encryptPassword(req.body.password);

					newUser.save(function(err){
						if(err){throw err;}
						
						res.send('OK');
					});
				}
			});
		}
	},
	logout: function(req, res){
		req.logout();
		res.redirect('/');
	},
	recover: function(req, res){
		let viewModel = {
			layout: 'login',
			recoveryError:req.flash('recoveryError')
		}
		res.render('recover', viewModel)
	},
	search: function(req, res) {
		UserModel.findOne({email:req.body.email}, function(err, user){
			if(err){throw err}

			if(user){
				res.redirect('/reset/' + user.email)
			}else{
				req.flash('recoveryError', 'User Not Found')
				res.redirect('/recover')
			}
		});
	},

	reset: function(req, res){
		let viewModel = {
			layout: 'login'
		}

		UserModel.findOne({'email' :{$regex:req.params.email}}, function(err, user){
			if(err){throw err}

			if(user){
				viewModel.user = user
			}else{
				res.redirect('/')
			}

			res.render('reset', viewModel)
		})
	},
	resetpassword: function(req, res){
		UserModel.findOne({'email':{$regex:req.params.email}}, function(err, user){
			if(err){throw err;}
			if(user){
				user.password = user.encryptPassword(req.body.password);
				user.save(function(err){
					if(err){throw err}
					req.flash('resetSuccess', 'Password Reset Successful');
					res.redirect('/')
				});
			}else{
				res.redirect('/');
			}
		})

	}
}