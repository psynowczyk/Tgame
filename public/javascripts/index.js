var site = window.location.pathname;

$(document).ready(function() {

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

	var incomeInterval = setInterval(function () {
		var postdata = {'action': 'get-wallet'};
		$.ajax({
		   url: '/',
		   type: 'POST',
		   contentType: 'application/json',
		   data: JSON.stringify(postdata),
		   success: function (result) {
		   	if(result != 'fail') {
		   		$('.walletvalue[data-type="cash"]').html(result.cash);
		   		$('.walletvalue[data-type="oil"]').html(result.oil);
		   		$('.walletvalue[data-type="gas"]').html(result.gas);
		   		$('.walletvalue[data-type="metal"]').html(result.metal);
		   	}
		   }
		});
	}, 20000);

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
	else if(site == '/weapons') {
		$('body').css('background-image', 'url(../images/weapons/bg_weapons.jpg)');
		$('.weapon_upgrade').on('click', function (){
			var structure = $(this).attr('data-struct');
			var postdata = {'action': 'upgrade-structure', 'structure': structure};
			$.ajax({
			   url: '/structures',
			   type: 'POST',
			   contentType: 'application/json',
			   data: JSON.stringify(postdata),
			   success: function (result) {
			   	if(result == 'success') window.location.href = '/weapons';
				   else if(result == 'fail:resources') alert('Brak środków.');
			   }
			});
		});
	}
	else if(site == '/observatory') {
		$('body').css('background-image', 'none');
		$('#spacemapbox').css('background-image', 'url(images/ajaxloader.gif)');

		var postdata = {'action': 'load-spacemap'};
		$.ajax({
		   url: '/observatory',
		   type: 'POST',
		   contentType: 'application/json',
		   data: JSON.stringify(postdata),
		   success: function (result) {
		   	if(result != 'fail') {
		   		$('#spacemapbox').css('background-image', 'none');
		   		var details = result[result.length - 1].split(':');
		   		var oblvl = parseInt(details[0]);
		   		var owpx = parseInt(details[1]);
		   		var owpy = parseInt(details[2]);
		   		var rangecount = 9 + (oblvl*2);
		   		var boxwidth = Math.floor($('#spacemapbox').width() / rangecount);
		   		for (var x = 0; x < rangecount*rangecount; x++) {
		   			var ox = owpx-((rangecount-1)/2)+(x%rangecount);
		   			var oy = owpy+((rangecount-1)/2)-(Math.floor(x/rangecount));
		   			$('#spacemapbox').append('<div class="spacemap_object" data-cx="'+ ox +'" data-cy="'+ oy +'" data-objtype="0" data-status="0" style="width:'+ (boxwidth-2) +'px; height:'+ (boxwidth-2) +'px;"></div>');
		   		}
		   		for (var x = 0; x < result.length - 1; x++) {
		   			var ox = result[x].coordinates.x;
		   			var oy = result[x].coordinates.y;
		   			$('.spacemap_object[data-cx='+ ox +'][data-cy='+ oy +']').attr('data-objtype', '1').css('background-image', 'url(images/planets/'+ result[x].image +'.jpg)');
		   		}
		   	}
			   else if(result == 'fail') $('#spacemapbox').html('Could not load the map.');
		   }
		});

		$(document).on('click', '.spacemap_object[data-objtype="1"]', function () {
			var that = $(this);
			var status = that.attr('data-status');
			if (status == 0) {
				var tempwidth = that.width();
				var postdata = {'action': 'get-spaceobjdetails', 'coordinates': $(this).attr('data-cx') +':'+ $(this).attr('data-cy')};
				$.ajax({
				   url: '/observatory',
				   type: 'POST',
				   contentType: 'application/json',
				   data: JSON.stringify(postdata),
				   success: function (result) {
				   	if(result != 'fail') {
				   		that.attr('data-status', '1');
				   		var objdetails = result[0];
				   		var owner = result[1].local;
				   		var userID = result[2];
				   		var spacemapengage = '<div class="spacemap_engage" data-cx="'+ objdetails.coordinates.x +'" data-cy="'+ objdetails.coordinates.y +'">zaatakuj</div>';
				   		if (userID == result[1]._id) spacemapengage = '';
				   		that.html(
				   			'<div class="spacemap_objdetails" style="margin-left:'+ tempwidth +'px;">'+
				   				'<div class="spacemap_objdetail">Właściciel: '+ owner.username +'</div>'+
				   				'<div class="spacemap_objdetail">Współrzędne: '+ objdetails.coordinates.x +' : '+ objdetails.coordinates.y +'</div>'+
				   				spacemapengage +
				   			'</div>'
				   		);
				   	}
				   }
				});
			}
			else {
				that.html('');
				that.attr('data-status', '0');
			}
		});

		$('.structure_upgrade').on('click', function (){
			var structure = $(this).attr('data-struct');
			var postdata = {'action': 'upgrade-structure', 'structure': structure};
			$.ajax({
			   url: '/structures',
			   type: 'POST',
			   contentType: 'application/json',
			   data: JSON.stringify(postdata),
			   success: function (result) {
			   	if(result == 'success') window.location.href = '/observatory';
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
	else if(site == '/editprofile') {
		var username = '', login = '', password = '';
		function checkForm () {
			if ((username.length == 0 || username.length >= 3) && (login.length == 0 || login.length >= 3) && (password.length == 0 || password.length >= 3)) $('input[type="submit"]').attr('disabled', false);
		}
		$('input[name="username"]').on('input', function() {
			var username_now = $(this).attr('placeholder');
			username = $(this).val();
			if(username.length >= 3) {
				if (username_now != username) {
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
			}
			else if(username.length == 0) $('div.inputstatus#username').css('display', 'none').html('');
			else $('div.inputstatus#username').css('display', 'block').html('Min. 3 signs.');
		});
		$('input[name="login"]').on('input', function() {
			var login_now = $(this).attr('placeholder');
			login = $(this).val();
			if(login.length >= 3) {
				if (login_now != login) {
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
			}
			else if(username.length == 0) $('div.inputstatus#login').css('display', 'none').html('');
			else $('div.inputstatus#login').css('display', 'block').html('Min. 3 signs.');
		});
		$('input[name="password"]').on('input', function() {
			password = $(this).val();
			if(password.length >= 3) $('div.inputstatus#password').css('display', 'none').html('');
			else if(username.length == 0) $('div.inputstatus#login').css('display', 'none').html('');
			else $('div.inputstatus#password').css('display', 'block').html('Min. 3 signs.');
			checkForm();
		});
	}
	else if(site == '/defense') {
		$('body').css('background-image', 'url(../images/defense.jpg)');
		$('.structure_upgrade').on('click', function (){
			var structure = $(this).attr('data-struct');
			var postdata = {'action': 'upgrade-structure', 'structure': structure};
			$.ajax({
			   url: '/structures',
			   type: 'POST',
			   contentType: 'application/json',
			   data: JSON.stringify(postdata),
			   success: function (result) {
			   	if(result == 'success') window.location.href = '/defense';
				   else if(result == 'fail:resources') alert('Brak środków.');
			   }
			});
		});
	}
});