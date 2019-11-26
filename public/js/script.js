$(document).ready(function(){

	// $('#btn-like').click(function(event){
	// 	event.preventDefault();

	// 	let imgId = $(this).data('id');

	// 	$.post('/image/' + imgId + '/like').done(function(data){
	// 		$('.likes-count').text(data.Likes);
	// 	});
	// });

	let remove = false;

	$('#btn-delete').click(function(event){
		event.preventDefault();

		let $this = $(this);

		let imgId = $(this).data('id');

		//remove = confirm('Are you sure you want to delete this image?');

		$('#deleteModal').modal('show');

		$('#btn-modal-yes').click(function(event){
			event.preventDefault();

			remove = true;

			if(remove){
				$.ajax({
					'url':'/image/' + imgId,
					'type':'DELETE'
				}).done(function(result){
					if(result){
						$this.removeClass('btn-danger').addClass('btn-success');
						$this.text('Deleted ');
						$this.append('<i class="fa fa-check"></i>');
						setTimeout(function(){
							location.href = '/logged';
						},3000);
					}
				});
			}
		});
	});

	$('#comment-form-area').hide();

	$('#post-comment').click(function(){
		$('#comment-form-area').slideToggle(650);
	});

	$('.btn-create').click(function(event){
		event.preventDefault();

		$('#signupModal').modal('show');
	});

	$('#signupForm').submit(function(event){
		event.preventDefault();

		// let firstname = $('#firstname').val();
		// let surname = $('#surname').val();
		// let email = $('#signup_email').val();
		// let password = $('#signup_password').val();
		// let confirmpassword = $('#confirmpassword').val();

		// alert(firstname + " " + surname + " " + email + " " + password + " " + confirmpassword);

		let $this = $(this);
		let str = $(this).serialize();
		console.log('sign up form details = '+ str);
		let action = '/signup';
	    $.ajax({
	      type: "POST",
	      url: action,
	      data:str,
	      success: function(msg) {
	        if (msg == 'OK') {
	        	$this.siblings('.alert-danger').remove();
	        	$('#signupForm').find("input").val("");
	        	$('#firstname_text').text('');
	        	$('#surname_text').text('');
				$('#email_text').text('');
	        	$('#password_text').text('');
	        	$('#confirmpassword_text').text('');
	          	$this.before('<div class="alert alert-success"><span class="close" data-dismiss="alert"><i class="fa fa-times"></i> </span></div>');
	          	$('.alert-success .close').before('');
				$('.alert-success .close').before("Signup Successful! You can now Login");
				setTimeout(function(){
					$('.alert-success').fadeOut('slow', function(){
						setTimeout(function(){
							location.href = '/';
						},2000)
					});
				},5000)
	        } else if(msg == 'User Already Exist!'){
	        	$this.siblings('.alert-danger').remove();
	        	$('#firstname_text').text('');
	        	$('#surname_text').text('');
	        	$('#email_text').text('');
	        	$('#password_text').text('');
	        	$('#confirmpassword_text').text('');
	        	$this.before('<div class="alert alert-danger"><span class="close" data-dismiss="alert"><i class="fa fa-times"></i> </span></div>');
	        	$('.alert-danger').text('');
	        	$('.alert-danger').append(msg);
	        } else {
	        	// $this.siblings('.alert-danger').remove();
	        	// $this.before('<div class="alert alert-danger"><span class="close" data-dismiss="alert"><i class="fa fa-times"></i> </span></div>');
	        	// $('.alert-danger').text('');
				// // $('.alert-danger .close').before(msg[0].msg);
				console.log(msg);
				var errors = '';
				$('#firstname_text').text('');
				$('#firstname_text').slideUp('fast');
				$('#surname_text').text('');
				$('#surname_text').slideUp('fast');
				$('#email_text').text('');
				$('#email_text').slideUp('fast');
				$('#password_text').text('');
				$('#password_text').slideUp('fast');
				$('#confirmpassword_text').text('');
				for(val in msg){
					console.log('value in msg = ' + msg[val]);
					errors += msg[val].msg + '<br />';
					if(msg[val].param == 'firstname'){
						$('#firstname_text').slideDown('slow');
						$('#firstname_text').append('&times; ' + msg[val].msg + '<br />');
					}
					if(msg[val].param == 'surname'){
						$('#surname_text').slideDown('slow');
						$('#surname_text').append('&times; ' + msg[val].msg + '<br />');
					}
					if(msg[val].param == 'email'){
						$('#email_text').slideDown('slow');
						$('#email_text').append('&times; ' + msg[val].msg + '<br />');
					}
					if(msg[val].param == 'password'){
						$('#password_text').slideDown('slow');
						$('#password_text').append('&times; ' + msg[val].msg + '<br />');
					}
					if(msg[val].param == 'confirmpassword'){
						$('#confirmpassword_text').slideDown('slow');
						$('#confirmpassword_text').append('&times; ' + msg[val].msg + '<br />');
					}
				}
				// $('.alert-danger').append(errors);
	        }
	      }
	    });
	});
	$('.btn-update').click(function(event){
        event.preventDefault();

        let $this = $(this);

        let userId = $(this).data('id');

        $.ajax({
            'url':'/profile/' + userId,
            'type':'GET'
        }).done(function(result){ 
            console.log(result);
            if(result){
                $('#profile-update').attr('action','/update/' + result._id + '?_method=PUT');
				$('#profile-update input:eq(1)').val(result.firstname);
				$('#profile-update input:eq(2)').val(result.surname);
				$('#profile-update input:eq(3)').val(result.email);
                $('#updateModal').modal('show');
            }
        });

	});
	
	$('#btn-delete-account').click(function(event){
        event.preventDefault();

		$('#accountDeleteModal').modal('show')

	});
	
	$('#user').keyup(function(event){
		event.preventDefault();

		let $this = $(this);

		let userEmail = $(this).val();
		console.log(userEmail);

		$.ajax({
			'url':'/useremail/' + userEmail,
			'type': 'GET'
		}).done(function(feedback){
			console.log('feedback from route =' + feedback);
			if(feedback){
				$('#btn-account-delete-yes').removeAttr('disabled');
			}else{
				$('#btn-account-delete-yes').attr('disabled', 'disabled');
			}
		})
	});

	$('#btn-account-delete-yes').click(function(event){
		event.preventDefault();

		let $this = $(this)

		let email = $('#user').val();
		console.log('email from input field is ' + email)

		$.ajax({
			'url':'/accountdelete/' + email,
			'type': 'DELETE'
		}).done(function(feedback){
			console.log('feedback from route =' + feedback);
			if(feedback == true){
				$this.text('');
				$this.append('Account Deleted Successfully <i class= "fa fa-check"></i>');
				$this.removeClass('btn-default').addClass('btn-sucess')
				setTimeout(function(){
					location.href = '/'
				}, 1000)
			}
		})
	})
});