/*global jQuery, Drupal, console */
(function ($, Drupal) {
    $.fn.validateEmail = function (string) {
      var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      if (filter.test(sEmail)) {
        return true;
      }
      else {
        return false;
      }
    };

	$(document).ready(function () {
      $('#edit-students-others-birthday').mask("99-99-9999");

	});

} (jQuery, Drupal));
