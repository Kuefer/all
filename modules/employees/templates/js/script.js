/*global jQuery, Drupal, console */
(function ($, Drupal) {
    $.fn.refresh = function () {
        location.reload(true);
    };
	$(document).ready(function () {
      $('#edit-employees-about-birthday').mask("99-99-9999");
	});

} (jQuery, Drupal));
