/* global $ */

var margin = (($(window).width() % $('.element').width()) / 2);
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
  }, 800);
};
