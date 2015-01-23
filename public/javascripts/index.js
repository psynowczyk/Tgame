var site = window.location.pathname;

$(document).ready(function() {

	var window_height = $(window).height();
	var window_width = $(window).width();
	$('.container').css({'width': (window_width-200) +'px', 'height': (window_height-300) +'px'});

	$('a.navilink[href="'+ site +'"]').css({'background-color': '#0d5980', 'color': '#ffffff', 'box-shadow': 'inset 0px 3px 4px 0px #0a4766'});

	if(site == '/') {

	}
	else if(site == '/signup') {
		var username = '', login = '', password = '';
		function checkForm () {
			if (username.length >= 3 && login.length >= 3 && password.length >= 3) $('input[type="submit"]').attr('disabled', false);
		}
		$('input[name="username"]').on('input', function() {
			username = $(this).val();
			if(username.length >= 3) {
				var postdata = {'action': 'uniq-username', 'username': username};
				$.ajax({
				   url: '/',
				   type: 'POST',
				   contentType: 'application/json',
				   data: JSON.stringify(postdata),
				   success: function (result) {
				   	if(result == 'success') $('div.inputstatus#username').css('display', 'none').html('');
					   else if(result == 'fail') $('div.inputstatus#username').css('display', 'block').html('Ten użytkownik jest zajęty.');
					   checkForm();
				   }
				});
			}
			else $('div.inputstatus#username').css('display', 'block').html('Min. 3 znaki.');
		});
		$('input[name="login"]').on('input', function() {
			login = $(this).val();
			if(login.length >= 3) {
				var postdata = {'action': 'uniq-login', 'login': login};
				$.ajax({
				   url: '/',
				   type: 'POST',
				   contentType: 'application/json',
				   data: JSON.stringify(postdata),
				   success: function (result) {
				   	if(result == 'success') $('div.inputstatus#login').css('display', 'none').html('');
					   else if(result == 'fail') $('div.inputstatus#login').css('display', 'block').html('Ten login jest zajęty.');
						checkForm();
					}
				});
			}
			else $('div.inputstatus#login').css('display', 'block').html('Min. 3 znaki.');
		});
		$('input[name="password"]').on('input', function() {
			password = $(this).val();
			if(password.length >= 3) $('div.inputstatus#password').css('display', 'none').html('');
			else $('div.inputstatus#password').css('display', 'block').html('Min. 3 znaki.');
			checkForm();
		});
	}
});