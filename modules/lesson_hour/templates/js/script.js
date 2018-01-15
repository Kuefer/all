/*global jQuery, Drupal */
(function () {
	'use strict';
	jQuery(document).ready(function () {
      jQuery('#lesson-certificate').mask("9.99");
      jQuery('#lesson-target').mask("9.99");
      jQuery('#lesson-hour').mask("99:99");
      jQuery('#lesson-registered').mask("99/99/9999");
      jQuery('#lesson-mark-date').mask("9999/99/99");
      jQuery('#remark-date').mask("9999/99/99");
      jQuery('#lesson-mark').mask("9.99");
      jQuery('#lesson-points').mask("9.99");

        jQuery('#new-lesson').bind('click', function() {
          jQuery('#submit-lesson').fadeToggle();
        });
	});
//-------------------------
}(jQuery, Drupal));
