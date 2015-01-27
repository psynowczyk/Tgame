var site = window.location.pathname;

$(document).ready(function() {

	var window_height = $(window).height();
	var window_width = $(window).width();
	$('#container').css({'width': (window_width-200) +'px', 'height': (window_height-250) +'px'});
	$('a.navilink[href="'+ site +'"]').css({'background-color': '#0d5980', 'color': '#ffffff', 'box-shadow': 'inset 0px 3px 4px 0px #0a4766'});
	$('#useroptions').css({'margin-top': ($('#useroptions').height() * -1) +'px'});
	$('#usermenu').on('click', function () {
		var status = $(this).attr('status');
		if (status == '0') {
			$('#useroptions').css('display', 'block');
			$('#usermenu').attr('status', '1');
		}
		else {
			$('#useroptions').css('display', 'none');
			$('#usermenu').attr('status', '0');
		}
	});

	if(site == '/') {
		
	}
	else if(site == '/dashboard') {
		$('body').css('background-image', 'none');
		var postdata = {'action': 'get-notifications'};
		$.ajax({
		   url: '/',
		   type: 'POST',
		   contentType: 'application/json',
		   data: JSON.stringify(postdata),
		   success: function (result) {
		   	if(result != 'fail') {
		   		for (var x = 0; x < result.length; x++) {
		   			$('#kok_notifications').append('<div class="kok_notification">'+ result[x].text +'</div>');
		   		}
		   	}
			   else $('#kok_notifications').append('<div class="kok_notification">Brak powiadomień.</div>');
		   }
		});
	}
	else if(site == '/structures') {
		$('body').css('background-image', 'none');
		$('.structure_upgrade').on('click', function (){
			var structure = $(this).attr('data-struct');
			var postdata = {'action': 'upgrade-structure', 'structure': structure};
			$.ajax({
			   url: '/structures',
			   type: 'POST',
			   contentType: 'application/json',
			   data: JSON.stringify(postdata),
			   success: function (result) {
			   	if(result == 'success') window.location.href = '/structures';
				   else if(result == 'fail:resources') alert('Brak środków.');
			   }
			});
		});
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
					   else if(result == 'fail') $('div.inputstatus#username').css('display', 'block').html('That username is already taken.');
					   checkForm();
				   }
				});
			}
			else $('div.inputstatus#username').css('display', 'block').html('Min. 3 signs.');
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
					   else if(result == 'fail') $('div.inputstatus#login').css('display', 'block').html('That login is already taken.');
						checkForm();
					}
				});
			}
			else $('div.inputstatus#login').css('display', 'block').html('Min. 3 signs.');
		});
		$('input[name="password"]').on('input', function() {
			password = $(this).val();
			if(password.length >= 3) $('div.inputstatus#password').css('display', 'none').html('');
			else $('div.inputstatus#password').css('display', 'block').html('Min. 3 signs.');
			checkForm();
		});
	}
});