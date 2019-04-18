/* global $ */

var margin = (($(window).width() % $('.element').width()) / 2);
$('.container').css('margin-left', margin + 20 + 'px');
$('.container').css('margin-right', margin - 20 + 'px');
$('.btn').click(function() {
  $('.circle_loader').addClass('animation');
  $('.btn').addClass('animation_circle');
  $('.profile').addClass('animation_card');
  del();
});
var del = function() {
  setTimeout(function() {
    $(".btn").css("animation", "popout-btn 0.3s both ease-in-out 0.5s");
  }, 100);
  setTimeout(function() {
    $('.container').css('margin-left', margin + 'px');
    $('.container').css('margin-right', margin + 'px');
    $(".photo").css("animation", "rotate-photo-reverse 0.5s forwards ease-in-out");
    $(".profile").css("animation", "hide-profile 0.5s forwards ease-in-out");
  }, 800);
};
