/*global jQuery*/
(function ($) {
  $(document).ready (function () {

    /*$('form').submit(function(e) {
      console.log('#e');
      e.preventDefault();
    });*/

    $('#page-title #menu-dropdown').bind('click', function() {
      $('header').show();
    });

    setTimeout(function() {
      $('.flash').fadeOut('fast');
    }, 6000);

    $('.dropdown li').click(function(){window.location.href = $(this).children('a').attr('href')});
    $('#account').click(function() {
      $('.dropdown').css({'width':$('#account').width() -1 + 'px'});
      $('.dropdown').fadeToggle('fast',function() {
        if($(this).data('toggle') == false) {
          $(this).data('toggle',true);
          $('#account').css({'background-color':'#156b8f'})
        }else {
          $(this).data('toggle',false);
          $('#account').css({'background-color':''})
        }
      });
    });

    $(document).mouseup(function(event) {
      var account = $('#account');
      if (account.not(event.target) && account.has(event.target).length === 0) {
        account.css({'background-color':''});
        $('.dropdown').hide();
      }
    });

  });
} (jQuery));
