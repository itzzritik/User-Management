/* global $ */

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
    $(".photo").css("animation", "rotate-photo-reverse 0.5s forwards ease-in-out");
    $(".profile").css("animation", "hide-profile 0.5s forwards ease-in-out");
  }, 800);
};
