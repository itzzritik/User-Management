/* global $ */
/* global swal */

var itemsPerRow, itemsPerColumn;

$(window).resize(function() { layout(); });

function layout() {
  var zoomlvl = $(window).width() / 430;
  itemsPerRow = parseInt($(window).width() / (430), 10);
  itemsPerColumn = parseInt(($(window).height() + 50) / (140), 10);

  if ($(window).width() < 430) {
    itemsPerRow = 1;
    itemsPerRow = parseInt($(window).width() / (430 * zoomlvl), 10);
    itemsPerColumn = parseInt(($(window).height() + 50) / (140 * zoomlvl), 10);
    $('body').css({ zoom: zoomlvl, '-moz-transform': 'scale(' + zoomlvl + ')' });
    $('.container').css('margin-left', +20 + 'px');
    $('.container').css('margin-right', -20 + 'px');
  }
  else {
    var margin = (($(window).width() % 430) / 2);

    $('body').css({ zoom: 1, '-moz-transform': 'scale(1)' });
    $('.container').css('margin-left', margin + 20 + 'px');
    $('.container').css('margin-right', margin - 20 + 'px');
  }
}
layout();

$('.container').on('click', '.btn', function() {
  swal({
      title: "Are You Sure?",
      text: "Deleted Accounts Cannot Be Recovered!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        var card = $(this).parent().parent();
        card.find('.circle_loader').addClass('animation');
        card.find('.btn').addClass('animation_circle');
        card.find('.profile').addClass('animation_card');
        console.log(card.find('#emailId').text() + " Deleted Successfully");
        del(card);
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
    setTimeout(function() { card.parent().css("animation", "hide-card 0.3s both ease-in-out 0.5s"); }, 800);
    setTimeout(function() { card.parent().remove(); }, 2000);
  }, 1000);
};


const http = new XMLHttpRequest();
http.open('POST', '/admin');
http.setRequestHeader('Content-type', 'application/json');
http.onload = function() {
  const data = JSON.parse(http.responseText);
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
            setTimeout(function() { $('body, html').css("overflow-y", "auto"); }, 500);
          }
        }
      }
    }, delay);
  }
  addCards(0, 500);
};
http.send();
