var site = window.location.pathname;

$(document).ready(function() {

	var window_height = $(window).height();
	var window_width = $(window).width();
	$('.container').css({'width': (window_width-200) +'px', 'height': (window_height-200) +'px'});

	$('a.navilink[href="'+ site +'"]').css({'background-color': '#0d5980', 'color': '#ffffff', 'box-shadow': 'inset 0px 3px 4px 0px #0a4766'});

	if(site == '/') {

		alert("Polnik śmierdzisz");

	}
});