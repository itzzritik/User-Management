/* global $ */
/* global Swal */
/* global Noty */

$(window).resize(function() {
	layout();
});

function layout() {
	var zoomlvl = 1;
	if ($(window).width() < 480)
		zoomlvl = $(window).width() / 480;
	$('body').css({ zoom: zoomlvl, '-moz-transform': 'scale(' + zoomlvl + ')' });
}
layout();

$('.form-control').focusout(function() {
	$('.form-group').removeClass('focus');
});
$('.form-control').focus(function() {
	$(this).closest('.form-group').addClass('focus');
});

$('.form-control').keyup(function() {
	if ($(this).val().length > 0) {
		$(this).closest('.form-group').addClass('filled');
	}
	else {
		$(this).closest('.form-group').removeClass('filled');
	}
});

var $formControl = $('.form-control');
$formControl.each(function() {
	if ($(this).val().length > 0) {
		$(this).closest('.form-group').addClass('filled');
	}
	else {
		$(this).closest('.form-group').removeClass('filled');
	}
});

$('.log').click(function() {
	$('.center').css('animation', 'logoutanim 0.5s forwards cubic-bezier(0.86, 0, 0.07, 1)');
	setTimeout(function() { $('.frame').css('animation', 'logoutanim 0.5s forwards cubic-bezier(0.86, 0, 0.07, 1)'); }, 200);
	$(this).remove();
	setTimeout(function() { window.location.replace("/login"); }, 500);
});

$('.close').click(function() {
	$(this).closest('.register-form').toggleClass('open');
});

$('.formset .btn').click(function() {
	var id = $('.id').val(),
		pass = $('.pass').val();
	if (!validateEmail(id)) {
		new Noty({
			text: "Ummm! This email doesn't sound correct! Please enter correct email address.",
			type: 'warning',
			theme: 'metroui',
			layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
			timeout: 3000
		}).show()
	}
	else if (pass == "") {
		new Noty({
			text: 'Nobody is allowed in without a password! Please enter yours.',
			type: 'warning',
			theme: 'metroui',
			layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
			timeout: 3000
		}).show()
	}
	else {
		const http = new XMLHttpRequest();
		http.open('POST', '/login');
		http.setRequestHeader('Content-type', 'application/json');
		http.onreadystatechange = function() {
			if (http.readyState == XMLHttpRequest.DONE) {
				if (http.responseText == 1) {
					new Noty({
						text: "Yayy! You're successfully logged in!",
						type: 'success',
						theme: 'metroui',
						layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
						timeout: 1000
					}).show();
					setTimeout(function() {
						var url = '/profile';
						var form = $('<form action="' + url + '" method="post">' +
							'<input type="hidden" name="email" value="' + id + '" />' +
							'<input type="hidden" name="pass" value="' + pass + '" />' +
							'</form>');
						$('body').append(form);
						form.submit();
					}, 1000);
				}
				else if (http.responseText == 0) {
					new Noty({
						text: "Oops! Password you've entered is incorrect!",
						type: 'error',
						theme: 'metroui',
						layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
						timeout: 5000
					}).show();
				}
				else if (http.responseText == 2) {
					new Noty({
						text: "Uh-Uh! Account with this email doesn't exist!",
						type: 'error',
						theme: 'metroui',
						layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
						timeout: 5000
					}).show();
				}
			}
		};
		http.send(JSON.stringify({
			email: id,
			pass: pass
		}));
	}
});


$(".b").on("keyup", function(e) {
	e.target.value = e.target.value.toLowerCase();
});
$(".id").on("keyup", function(e) {
	e.target.value = e.target.value.toLowerCase();
});
$(".d").on("keyup", function(e) {
	e.target.value = e.target.value.replace(/[^\d]/, "");
});

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
var username, email, pass, ph, signup = 0;
$('.circlebtn').click(function() {
	if (signup == 0) {
		username = $('.a').val();
		email = $('.b').val();
		pass = $('.c').val();
		ph = $('.d').val();

		var proceed = true,
			kill = true;
		if (username == "") {
			new Noty({
				text: "Ummm! This username doesn't sound good!",
				type: 'warning',
				theme: 'metroui',
				layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
				timeout: 3000,
				killer: kill
			}).show();
			proceed = false;
			if (kill) kill = false;
		}
		if (!validateEmail(email)) {
			new Noty({
				text: "Ahem! This email doesn't look right!",
				type: 'warning',
				theme: 'metroui',
				layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
				timeout: 3000,
				killer: kill
			}).show();
			proceed = false;
			if (kill) kill = false;
		}
		if (pass == "") {
			new Noty({
				text: 'Aahh! Please enter a valid password!',
				type: 'warning',
				theme: 'metroui',
				layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
				timeout: 3000,
				killer: kill
			}).show();
			proceed = false;
			if (kill) kill = false;
		}
		if (ph.length != 10) {
			new Noty({
				text: "Ummm! Enter your correct phone number! Don't worry We care about your privacy.",
				type: 'warning',
				theme: 'metroui',
				layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
				timeout: 3000,
				killer: kill
			}).show();
			proceed = false;
			if (kill) kill = false;
		}
		if (proceed) {
			signup = 1;

			$(".a").attr("disabled", "disabled");
			$(".b").attr("disabled", "disabled");
			$(".d").attr("disabled", "disabled");
			$('.c').val("");
			$('.c').focus();

			$('.aa').text("Username");
			$('.bb').text("Email");
			$('.cc').text("Confirm Password");
			$('.dd').text("Phone Number");

			$('.register-form h2').text("CONFIRM PASSWORD");
			$('.close').css('display', 'none');
			$('.register-form h2').css('color', '#ED2553');
			$('.register-form').css({
				"color": "#ED2553",
				"background": "#FFF"
			});
			$('.register-form .form-group .form-label, .register-form .form-group .form-control').css('color', '#ED2553');
		}
	}
	else if (signup == 1) {
		if ($('.c').val() != pass) {
			new Noty({
				text: "Password and Confirm Password does not match",
				type: 'warning',
				theme: 'metroui',
				layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
				timeout: 3000
			}).show();
			return;
		}

		const http = new XMLHttpRequest();
		http.open('POST', '/signup');
		http.setRequestHeader('Content-type', 'application/json');
		http.onreadystatechange = function() {
			if (http.readyState == XMLHttpRequest.DONE) {
				if (http.responseText == 1) {
					$('.close').css({
						"display": "inline",
						"color": "#fff",
						"font-size": "25px",
						"transform": "rotate(0deg)",
						"line-height": "55px",
						"right": "15px"
					});
					$('.register-form').css('background', '#4BB543');
					$(".close").click();
					$('.close').text("✓");
					$(".close").off('click');
					new Noty({
						text: "Yayy! Successfully created your account!",
						type: 'success',
						theme: 'metroui',
						layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
						timeout: 1000
					}).show();
				}
				else if (http.responseText == 2) {
					Swal.fire({
						type: 'error',
						title: 'Error!',
						text: "A User With Same Email ID Already Exists!"
					}).then(() => { window.location.replace("/login"); });
				}
				else {
					Swal.fire({
						type: 'error',
						title: 'Error!',
						text: "Error While Creating This Account!"
					}).then(() => { window.location.replace("/login"); });
				}
			}
		};
		http.send(JSON.stringify({
			username: username,
			email: email,
			pass: pass,
			ph: ph
		}));
	}
});
