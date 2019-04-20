/* global $ */
/* global Swal */
/* global Noty */
var data;
var itemsPerRow, itemsPerColumn;

$(window).resize(function() {
	layout();
});

function layout() {
	var zoomlvl = $(window).width() / 430;
	itemsPerRow = parseInt($(window).width() / (430), 10);
	itemsPerColumn = parseInt(($(window).height() + 50) / (140), 10);

	if ($(window).width() < 430) {
		itemsPerRow = 1;
		itemsPerRow = parseInt($(window).width() / (430 * zoomlvl), 10);
		itemsPerColumn = parseInt(($(window).height() + 50) / (140 * zoomlvl), 10);
		$('body').css({
			zoom: zoomlvl,
			'-moz-transform': 'scale(' + zoomlvl + ')'
		});
		$('.container').css('margin-left', +20 + 'px');
		$('.container').css('margin-right', -20 + 'px');
	}
	else {
		var margin = (($(window).width() % 430) / 2);

		$('body').css({
			zoom: 1,
			'-moz-transform': 'scale(1)'
		});
		$('.container').css('margin-left', margin + 20 + 'px');
		$('.container').css('margin-right', margin - 20 + 'px');
	}
}
layout();

$('.container').on('click', '.btn', function() {
	Swal.fire({
		title: 'Are you sure?',
		text: "Once Deleted,You Won't Be Able To Revert This!",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes, delete it!'
	}).then((result) => {
		if (result.value) {
			var card = $(this).parent().parent();
			card.find('.circle_loader').addClass('animation');

			var id = card.find('#emailId').text(),
				pass = "";
			for (var i = 0; i < data.length; i++)
				if (data[i].emailId == id)
					pass = data[i].password;

			const http = new XMLHttpRequest();
			http.open('POST', '/delete');
			http.setRequestHeader('Content-type', 'application/json');
			http.onreadystatechange = function() {
				if (http.readyState == XMLHttpRequest.DONE) {
					if (http.responseText == 1) {
						new Noty({
							text: "Yayy! Account Deletion Successfull!",
							type: 'success',
							theme: 'metroui',
							layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
							timeout: 4000
						}).show();
						card.find('.btn').addClass('animation_circle');
						card.find('.profile').addClass('animation_card');
						del(card);
					}
					else if (http.responseText == 0) {
						new Noty({
							text: "Apologies! Account Deletion Failed!",
							type: 'error',
							theme: 'metroui',
							layout: (screen.width <= 480) ? 'bottomCenter' : 'topRight',
							timeout: 4000
						}).show();
						card.find('.circle_loader').removeClass('animation');
					}
				}
			};
			http.send(JSON.stringify({
				email: id,
				pass: pass
			}));
		}
	});
});
var del = function(card) {
	setTimeout(function() {
		card.find(".btn").css("animation", "popout-btn 0.3s both ease-in-out 0.5s");
	}, 100);
	setTimeout(function() {
		card.find(".photo").css("animation", "rotate-photo-reverse 0.5s forwards ease-in-out");
		card.css("animation", "hide-profile 0.5s forwards ease-in-out");
		card.css("margin-left", "-20px");
		card.css("transition-duration", "0.5s");
		setTimeout(function() {
			card.find(".content").remove();
			card.find(".photo").css("animation", "popout-btn 0.3s both ease-in-out 0.5s");
		}, 460);
		setTimeout(function() {
			card.parent().css("animation", "hide-card 0.3s both ease-in-out 0.5s");
		}, 800);
		setTimeout(function() {
			card.parent().remove();
		}, 2000);
	}, 1000);
};


const http = new XMLHttpRequest();
http.open('POST', '/admin');
http.setRequestHeader('Content-type', 'application/json');
http.onload = function() {
	data = JSON.parse(http.responseText);
	console.log(data);

	function addCards(i, delay) {
		setTimeout(function() {
			var element =
				'<div class="element">' +
				'<div class="profile">' +
				'<div class="photo"><img src="https://avatars.dicebear.com/v2/avataaars/' + data[i].emailId + '.svg" /></div>' +
				'<div class="content">' +
				'<div class="text">' +
				'<h3>' + data[i].userName + '</h3>' +
				'<h6 id="emailId">' + data[i].emailId + '</h6>' +
				'<h6>' + data[i].phoneNo + '</h6>' +
				'</div>' +
				'<div class="btn">' +
				'<div class="circle_loader"></div>' +
				'<img src="/public/img/del.svg" />' +
				'</div></div></div></div>';
			$('.container').append(element);
			if (++i < data.length) {
				if (i < itemsPerColumn * itemsPerRow) {
					addCards(i, 100);
				}
				else if (i == itemsPerColumn * itemsPerRow) {
					addCards(i, 500);
				}
				if (i > itemsPerColumn * itemsPerRow) {
					addCards(i, 0);
					if (i == data.length - 1) {
						setTimeout(function() {
							$('body, html').css("overflow-y", "auto");
						}, 500);
					}
				}
			}
		}, delay);
	}
	addCards(0, 500);
};
http.send();
