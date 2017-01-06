$(function() {
  $("#range").ionRangeSlider({
    grid: true,
    min: 0,
    max: 100,
    from: 0,
    step: 5,
    postfix: " 分鐘後"
  });
  return $('.star').click(function() {
    return $('#content').hide();
  });
});