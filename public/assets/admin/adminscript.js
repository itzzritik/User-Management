/* global $ */

var itemsPerRow = parseInt($(window).width() / 430);
var itemsPerColumn = parseInt(($(window).height() + 50) / 140);
//alert(itemsPerColumn);

var margin = (($(window).width() % 430) / 2);
$('.container').css('margin-left', margin + 20 + 'px');
$('.container').css('margin-right', margin - 20 + 'px');

$('.btn').click(function() {
  var card = $(this).parent().parent();
  console.log(card);
  card.find('.circle_loader').addClass('animation');
  card.find('.btn').addClass('animation_circle');
  card.find('.profile').addClass('animation_card');
  del(card);
});
var del = function(card) {
  setTimeout(function() {
    card.find(".btn").css("animation", "popout-btn 0.3s both ease-in-out 0.5s");
  }, 100);
  setTimeout(function() {
    card.find(".photo").css("animation", "rotate-photo-reverse 0.5s forwards ease-in-out");
    card.css("animation", "hide-profile 0.5s forwards ease-in-out");
    setTimeout(function() {
      card.find(".photo").css("animation", "popout-btn 0.3s both ease-in-out 0.5s");
    }, 480);
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
        '<h6>' + data[i].emailId + '</h6>' +
        '<h6>' + data[i].phoneNo + '</h6>' +
        '</div>' +
        '<div class="btn">' +
        '<div class="circle_loader"></div>' +
        '<img src="/public/img/del.svg" />' +
        '</div></div></div></div>';
      $('.container').append(element);
      if (++i < data.length) {
        if (i > itemsPerColumn * itemsPerRow) {
          $('.body').css("overflow-y", "auto");
          addCards(i, 0);
        }
        else if (i % itemsPerRow == 0) addCards(i, 500);
        else addCards(i, 0);
      }
    }, delay);
  }
  addCards(0, 500);
};
http.send();
