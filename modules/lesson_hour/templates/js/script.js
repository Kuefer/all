/*global jQuery, Drupal, console */
(function ($, Drupal) {
	'use strict';
//-------------------------
//-------------------------
	$(document).ready(function () {
      $('#lesson-certificate').mask("9.99");
      $('#lesson-target').mask("9.99");
      $('#lesson-hour').mask("99:99");
      $('#lesson-registered').mask("99/99/9999");
      $('#lesson-mark-date').mask("9999/99/99");
      $('#remark-date').mask("9999/99/99");
      $('#lesson-mark').mask("9.99");
      $('#lesson-points').mask("9.99");

        $('#new-lesson').bind('click', function() {
          $('#submit-lesson').fadeToggle();
        });
	});
//-------------------------
//-------------------------
//-------------------------
}(jQuery, Drupal));
