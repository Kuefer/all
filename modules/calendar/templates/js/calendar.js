/*global jQuery, Drupal*/
(function ($, Drupal) {
  "use strict";
  
//----------------
  $.fn.eventBack = function () {
    //$('.page-right').show();
    $('#block-calendar-events').show().siblings().hide();
    //$(document).initDoc();
  };
  $.fn.fixEventsWidth = function () {
    //var siblings = 0;
    $('.event').each(function () {
      var value =  100 / ($(this).siblings(':visible').length + 1) - 1;
      $(this).css('width', (value) + '%');
    });
  };
  $.fn.fixZIndex = function () {
    var max = 0;
    $('.event').each(function () {
      $(this).css('z-index', 1);
      var current = parseInt($(this).css('z-index'), 10);
      if (current > max) {
        max = current;
      }
    });
    $('.focused').css('z-index', max + 1);
  };
//----------------
  $.fn.newEvent = function () {
    var data = $(this).data(),
      d = new Date(),
      tag = $('<div></div>'),
      date = Drupal.settings.calendar.date.split('-'),
      starthour = data.starthour.substring(1),
      startminute = data.startminute.substring(1),
      endhour = data.endhour.substring(1),
      endminute = data.endminute.substring(1),
      starts_time = starthour + ':' + startminute,
      ends_time = endhour + ':' + endminute,
      height = Drupal.settings.calendar.duration,
      group = $('.active-group').children('th').children().children('input').data('group'),
      zValue = $('.event').length + 1;
    $(document).fixEventsWidth();
    $('.create').detach();
    $(tag).addClass('event create focused');
    $(tag).css({'z-index' : zValue + '!important', 'height' : height});
    $(tag).css({'background' : $('.active-group').find('input').data('color')});
    $(tag).html('<span class="event-content-hours">' + starts_time + ' - ' + ends_time + ' </span><br>');
    $(this).append(tag);

    $(document).fixZIndex();
    $('#event-id').val(0);
    $('#event-student-id').val(0);
    $('#event-title').attr('placeholder', 'None').val('');
    $('#event-starts-date-year').val(date[0]);
    $('#event-ends-date-year').val(date[0]);
    $('#event-starts-date-month').val(date[1]);
    $('#event-ends-date-month').val(date[1]);
    $('#event-starts-date-day').val(date[2]);
    $('#event-ends-date-day').val(date[2]);
    $('#event-starts-hour').val(starthour);
    $('#event-starts-minute').val(startminute);
    $('#event-ends-hour').val(endhour);
    $('#event-ends-minute').val(endminute);
    $('#event-repeat').val(0).change();
    $('#event-end-repeat').val(0).change();
    $('#event-students').val('');
    $('#event-group-select').val(group);
    //$('.page-right').show();
    $('#block-calendar-events').show().siblings().hide();
    $('#event-end-repeat-date-year').val(d.getFullYear());
    $('#event-end-repeat-date-month').val(parseInt(d.getMonth() + 1, 10));
    $('#event-end-repeat-date-day').val(parseInt(d.getDate(), 10));

    $('.form-item-event-student-field-name').show();
    $('#event-student-tag').hide();
    $('#event-student-name').text('');
    $('#event-students').attr('placeholder', 'None');
  };
//----------------
  $.fn.close = function () {
    //$('.page-right').hide();
  };
  $.fn.refresh = function () {
    location.reload(true);
  };
  $.fn.initGroups = function (event) {
    //$('.form-checkbox[data-group="' + event + '"]').parent().parent().parent().addClass('active-group').siblings().removeClass('active-group');
    $('.selectable-group').bind('click', function () {
      var group = parseInt($(this).siblings('th').children().children('input').data('group'), 10);
      $(this).parent().addClass('active-group').siblings().removeClass('active-group');
      $('.edit-selected-group').val(group).change();
    });
    $('.list-colors').bind('click', function (event) {
      var group = $(this).parent().data('group-selected'),
        color = $(this).data('color');
      $('.edit-groups-group').val(group);
      $('.edit-groups-color').val(color);
      $('.edit-groups-color').change();
      $('.groups-block .color-groups-select').hide();
    });
    $('.group-button').each(function (object, callback) {
      var group = $(this).data('group'),
        color = $(this).data('color');

      $(this).siblings('label').css('background', color);
      if ($(this).attr('checked')) {
        $('[data-groups="' + group + '"]').each(function (object, callback) {
          $(this).show();
        });
      } else {
        $('[data-groups="' + group + '"]').each(function (object, callback) {
          $(this).hide();
        });
      }
    });
  };
  $.fn.initDoc = function () {
//----------------
    /*
    $('#block-calendar-events').dialog({
      autoOpen: true,
      height: 400,
      width: 350,
      modal: true
    });
    */
//----------------
    $('#event-starts-date-year, #event-starts-date-month, #event-starts-date-day, #event-starts-hour, event-ends-date-year, #event-ends-date-month, #event-ends-date-day, #event-ends-hour, #event-ends-minute').bind('change', function () {
      var starts = new Date($('#event-starts-date-year').val(), $('#event-starts-date-month').val(), $('#event-starts-date-day').val(), $('#event-starts-hour').val(), $('#event-starts-minute').val(), '00'),
      ends = new Date($('#event-ends-date-year').val(), $('#event-ends-date-month').val(), $('#event-ends-date-day').val(), $('#event-ends-hour').val(), $('#event-ends-minute').val(), '00'),
      time = ends.getTime() - starts.getTime();
      if(time < 0){
        $('#event-ends-date-day').val($('#event-starts-date-day').val());
        $('#event-ends-date-month').val($('#event-starts-date-month').val());
        $('#event-ends-date-year').val($('#event-starts-date-year').val());
        $('#event-ends-hour').val($('#event-starts-hour').val());
        $('#event-ends-minute').val($('#event-starts-minute').val());
        //alert('Start time must be biger than end time');
      }
    });
//----------------
    $('input[name="students[others][birthday]"]').mask("99-99-9999");
//----------------
    $('#close-panel').bind('click', function () {
      $('.region-sidebar-right .block').hide();
    });
//----------------
    if (Drupal.settings.calendar) {
      if (Drupal.settings.calendar.scroll !== '0') {
        $('html, body').animate({
          scrollTop: $('tr[data-hour="d' + Drupal.settings.calendar.start + '"]').offset().top - 64
        }, 900);
      }
    }

    $(document).bind('scroll', 'html', function (event) {
      var wrap = $('#view-calendar');
      if ($(this).scrollTop() > 130) {
        wrap.addClass('fix-search');
        //$('#calendar-date-title').css('padding-left', wrap.offset().left);
        //742
      } else {
        wrap.removeClass('fix-search');
        $('#calendar-date-title').css('padding-left', 0);
      }
    });
    /*--------------------------------------------------------*/
    $(document).mouseup(function (event) {
      if ($('.color-groups-options:visible').length !== 0) {
        if ($(event.target).not('.color-groups-options') && $('.color-groups-options:visible').has(event.target).length === 0) {
          $('.color-groups-options:visible').hide();
          $('.groups-block .color-groups-select').hide();
        }
      }
    });
    //----------------
    $('#student-tag-remove').bind('click', function () {
      $('#event-student-id').val(0);
      $('.form-item-event-student-field-name').show();
      $('#event-student-tag').hide();
      $('#event-student-name').text('');
      $('#event-students').attr('placeholder', 'None');
    });
  };
  $.fn.fillEventForm = function (event) {
    var startst = event.starts_date.split('-'),
      startsh = event.starts_time.split(':'),
      endst = event.ends_date.split('-'),
      endsh = event.ends_time.split(':'),
      repeat_date = null;
    if (event.repeat_end_date) {repeat_date = event.repeat_end_date.split('-'); }
    //$('.focused').data({starts_date:event.starts_date, starts_time:event.starts_time, ends_date:event.ends_date, ends_time:event.ends_time});
    $('#event-id').val(event.id);
    $('#event-student-id').val(event.student || '0');
    if (event.title.length !== 0) {
      $('#event-title').attr('placeholder', '').val(event.title);
    } else {
      $('#event-title').attr('placeholder', 'None').val('');
    }

    $('#event-nhus').val(event.nhus);
    $('#event-starts-date-year').val(startst[0]);
    $('#event-ends-date-year').val(endst[0]);
    $('#event-starts-date-month').val(parseInt(startst[1], 10));
    $('#event-ends-date-month').val(parseInt(endst[1], 10));
    $('#event-starts-date-day').val(parseInt(startst[2], 10));
    $('#event-ends-date-day').val(parseInt(endst[2], 10));
    $('#event-starts-hour').val(startsh[0]);
    $('#event-starts-minute').val(startsh[1]);
    $('#event-ends-hour').val(endsh[0]);
    $('#event-ends-minute').val(endsh[1]);
    $('#event-repeat').val(event.repeat_event).change();
    $('#event-end-repeat').val(event.repeat_end).change();
    if (repeat_date !== null) {
      $('#event-end-repeat-date-year').val(repeat_date[0]);
      $('#event-end-repeat-date-month').val(parseInt(repeat_date[1], 10));
      $('#event-end-repeat-date-day').val(parseInt(repeat_date[2], 10));
    }
    $('#event-students').val('');
    if (event.student) {
      $('.form-item-event-student-field-name').hide();
      $('#event-student-tag').show();
      $('#event-student-name').text(event.student_firstname + ' ' + event.student_lastname);
      $('#event-students').attr('placeholder', '');
    } else {
      $('.form-item-event-student-field-name').show();
      $('#event-student-tag').hide();
      $('#event-student-name').text('');
      $('#event-students').attr('placeholder', 'None');
    }
    $('#event-group-select').val(event.groups);
  };
//----------------
  $.fn.readDomEvent = function (event) {
    var dataParent = event.parent().data(),
      data = event.data(),
      height = event.height(),
      sh = dataParent.starthour.substring(1),
      sm = dataParent.startminute.substring(1),
      es = data.starts_date.split('-'),
      sd = new Date(es[0], es[1], es[2], sh, sm),
      ed = new Date(sd.getTime() + (Math.round((height + 15 / 2) / 15) * 15) * 60000);
    $(event).addClass('focused');
    //data.starts_date = sd.getFullYear()+'-'+('0' + sd.getMonth()).slice(-2)+'-'+('0' + sd.getDate()).slice(-2);
    data.starts_time = ('0' + sd.getHours()).slice(-2) + ':' + ('0' + sd.getMinutes()).slice(-2);
    //data.ends_date = ed.getFullYear()+'-'+('0' + ed.getMonth()).slice(-2)+'-'+('0' + ed.getDate()).slice(-2);
    data.ends_time = ('0' + ed.getHours()).slice(-2) + ':' + ('0' + ed.getMinutes()).slice(-2);
    $(document).fillEventForm(data);
    $('.focused').children('.event-content-hours').text(data.starts_time.substr(0, 5) + ' - ' + data.ends_time);
    //$('.page-right').show();
    $('#block-calendar-events').show().siblings().hide();
  };
//----------------
  $.fn.setNewEvent = function () {
    if (typeof Drupal.settings.studentBeforeEvent !== 'object') {return false; }
    var data = Drupal.settings.studentBeforeEvent,
      //height = Drupal.settings.calendar.duration,
      zValue = $('.event').length + 1,
      tag = $('<div></div>'),
      starts = new Date(data.startYear, data.startMonth, data.startDay, data.startHour, data.startMin, '00'),
      ends = new Date(data.endsYear, data.endsMonth, data.endsDay, data.endsHour, data.endsMin, '00'),
      height = ends.getTime() - starts.getTime();

    $(tag).addClass('event create focused');
    $(tag).css({'z-index' : zValue + '!important', 'height' : height});
    $(tag).css({'background' : $('.active-group').find('input').data('color')});
    $(tag).html('<span class="event-content-hours">' + data.startHour + ':' + data.startMin + ' - ' + data.endsHour + ':' + data.endsMin + ' </span><br>');
    $('div.selectable[data-starthour="d' + data.startHour + '"][data-startminute="d' + data.startMin + '"]').append(tag);
    $('.focused').css('height', height / 60000 - 5);

    $(document).fixZIndex();

    $('#event-title').attr('placeholder', 'None').val(data.title);
    $('#event-nhus').val(data.nhus);
    $('#event-starts-date-year').val(data.startYear);
    $('#event-ends-date-year').val(data.endsYear);
    $('#event-starts-date-month').val(data.startMonth);
    $('#event-ends-date-month').val(data.endsMonth);
    $('#event-starts-date-day').val(data.startDay);
    $('#event-ends-date-day').val(data.endsDay);

    $('#event-starts-hour').val(data.startHour);
    $('#event-starts-minute').val(data.startMin);
    $('#event-ends-hour').val(data.endsHour);
    $('#event-ends-minute').val(data.endsMin);

    $('#event-repeat').val(data.repeat).change();
    $('#event-end-repeat').val(data.endRepeat).change();

    $('#event-end-repeat-date-year').val(data.endRepeatDateYear);
    $('#event-end-repeat-date-month').val(data.endRepeatDateMonth);
    $('#event-end-repeat-date-day').val(data.endRepeatDateDay);

    $('#event-students').attr('placeholder', 'None').val('');
    $('.form-item-event-student-field-name').hide();
    $('#event-student-tag').show();
    $('#event-student-name').text(data.student);

    $('#event-group-select').val(data.teacher);

    $('#block-calendar-events').show().siblings().hide();

    $('#event-id').val(0);
    $('#event-student-id').val(data.studentId);
  };
//----------------
  $.fn.setDomEvent = function (event) {
    var year = $('#event-starts-date-year').val(),
      month = $('#event-starts-date-month').val(),
      day = $('#event-starts-date-day').val(),
      starts_hour = $('#event-starts-hour').val(),
      starts_min = $('#event-starts-minute').val(),
      ends_hour = $('#event-ends-hour').val(),
      ends_min = $('#event-ends-minute').val(),
      starts = new Date(year, month, day, starts_hour, starts_min, '00'),
      ends = new Date(year, month, day, ends_hour, ends_min, '00'),
      height = ends.getTime() - starts.getTime(),
      focused = $('.focused'),
      title_hours = ('0' + starts.getHours()).slice(-2) + ':' + ('0' + starts.getMinutes()).slice(-2) + ' - ' + ('0' + ends.getHours()).slice(-2) + ':' + ('0' + ends.getMinutes()).slice(-2),
      selectable = '.selectable[data-starthour="d' + ('0' + starts.getHours()).slice(-2) + '"][data-startminute="d' + ('0' + starts.getMinutes()).slice(-2) + '"]';
    $('.focused').css('height', height / 60000 - 5);
    $('.focused').children('.event-content-hours').text(title_hours);
    focused.detach();
    $(selectable).prepend(focused);
  };
//----------------
  $.fn.initEvents = function () {
//----------------
    $('.event').bind('click', function () {
      var dataId = $(this).data('id');
      $('.event').removeClass('focused');
      $('.create').detach();
      $(this).addClass('focused');
      $(document).fixZIndex();
      $(document).fillEventForm($(this).data());
      //$('.page-right').show();
      $('#block-calendar-events').show().siblings().hide();
      $('.event').css();
    });
//----------------
    $('#event-starts-hour, #event-starts-minute, #event-ends-hour, #event-ends-minute').change(function () {
      var event = $('.focused');
      $(document).setDomEvent(event);
    });
//----------------
    $('.groups-block tr').mouseover(function () {
      if (!$('.color-groups-options').is(':visible')) {
        $(this).find('.color-groups-select').show();
        $('.color-groups-options').hide();
      }
    });
    $('.groups-block tr').mouseout(function () {
      if (!$('.color-groups-options').is(':visible')) {
        $(this).find('.color-groups-select').hide();
      }
    });
//----------------
    $('.groups-block .color-groups-select').bind('click', function () {
      $(this).find('.color-groups-options').show();
      var group = $(this).find('.groups-list-colors').data('group-selected');
      $('.edit-groups-group').val(group).change();
    });
//----------------
    $('.selectable').bind('click', function () {
      if (!$(this).children().hasClass('event')) {
        $('.event').removeClass('focused');
        $(this).newEvent();
      }
    });
//----------------
    $('.event').resizable({
      containment: '.calendar-day',
      handles: 's',
      minHeight: 13,
      maxHeight: 1440,
      resize: function (event, ui) {
        $('.event').removeClass('focused');
        $(this).addClass('focused');
        $(document).fixZIndex();
        $(this).css({top: "", left: "", position: ""});
        $(document).fixEventsWidth();
        $(document).readDomEvent(ui.element);
      }
    });
//----------------
    $('.event').draggable({
      axis: 'y',
      containment: '.calendar-day',
      cursorAt: { top: 1 },
      snap: '.selectable',
      scroll: true,
      snapMode: 'inner',
      snapTolerance: 15,
      drag: function (event, ui) {
        $('.event').removeClass('focused');
        $(document).fixEventsWidth();
        $(document).fixZIndex();
      }
    });
//----------------
    $('.selectable').droppable({
      tolerance: 'pointer',
      hoverClass: '.selectable',
      drop: function (event, ui) {
        $(ui.draggable).detach();
        $(document).fixEventsWidth();
        $(event.target).append(ui.draggable);
        $(ui.draggable).css('top', '0');
        $(document).fixEventsWidth();
        $(document).fixZIndex();
        $(document).readDomEvent(ui.draggable);
      }
    });
  };
//----------------
  Drupal.jsAC.prototype.found = function (matches) {
    // If no value in the textfield, do not show the popup.
    if (!this.input.value.length) {return false; }
    // Prepare matches.
    var ul = $('<ul></ul>'),
      ac = this;

    matches.forEach(function (element, index, array) {
      $('<li></li>')
        .html($('<div></div>').html(element.name))
        .mousedown(function () { ac.select(this); })
        .mouseover(function () { ac.highlight(this); })
        .mouseout(function () { ac.unhighlight(this); })
        .data('autocompleteId', element.uid)
        .data('autocompleteValue', element.name)
        .appendTo(ul);
    });

    // Show popup with matches, if any.
    if (this.popup) {
      if (ul.children().length) {
        $(this.popup).empty().append(ul).show();
        $(this.ariaLive).html(Drupal.t('Autocomplete popup'));
      } else {
        $(this.popup).css({ visibility: 'hidden' });
        this.hidePopup();
      }
    }
  };
  Drupal.jsAC.prototype.select = function (node) {
    $('#event-students').val('');
    $('#event-student-id').val($(node).data('autocompleteId'));
    $('.form-item-event-student-field-name').hide();
    $('#event-student-tag').show();
    $('#event-student-name').text($(node).data('autocompleteValue'));
    $(this.popup).css({ visibility: 'hidden' });
  };
  Drupal.behaviors.calendar = {
    attach: function () {
      $('#button-new-group').once('calendar', function () {
        $(this).click(function (event) {
          event.preventDefault();
          //$('.page-right').show();
          $('#block-calendar-new-group').show().siblings().hide();
        });
      });
      $('#button-new-student').once('calendar', function () {
        $(this).click(function (event) {
          //event.preventDefault();
          //$('.page-right').show();
          //$('#block-calendar-new-student').show().siblings().hide();
        });
      });
    }
  };
//----------------
  $(document).ready(function () {
    $(this).initDoc();
//----------------
    $(this).setNewEvent();
    $(this).fixEventsWidth();
    $(this).initEvents();
    $(this).initGroups();
    
    $('#event-starts-picker').datetimepicker();
  });
}(jQuery, Drupal));
