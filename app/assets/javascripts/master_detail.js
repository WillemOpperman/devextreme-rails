$.fn.extend({
  animateCss: function (animationName) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    $(this).addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);
    });
  }
});

$('.grow').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
  function() {
    level1Width = level1.width();
    thisGridL1.dxDataGrid({
      width: level1Width
    });
    thisGridL1.css('overflow', 'none');
  });

function show_level_1(data_to_show) {
  var current_download_location = $('.tabbable').find('.download_button').attr('href');
  $('.download_button').attr('data-href', current_download_location);
  level1.addClass('span12 grow dx-back-hidden').html(data_to_show).removeClass('hidden');
  level2.removeClass('span3 span6').addClass('hidden').animateCss('fadeInRight');
  level3.removeClass('span6').addClass('hidden').animateCss('fadeInLeft');
  reset_refresh("level_1_grid");
  reset_column_picker("level_1_grid");
}

function show_level_2(data_to_show) {
  var new_download_location = $(data_to_show).find('.download_button').attr('href');
  $('.download_button').attr('href', new_download_location).attr('data-href', new_download_location);
  level1.removeClass('span12 dx-back-hidden').addClass('span3 grow');
  level2.addClass('span9 grow dx-back-hidden').html(data_to_show).removeClass('hidden');
  level3.addClass('hidden ').removeClass('span6');
  reset_grid(thisGridL1, 'level_2');
  level_back('#level_1');

  var thisGridL2 = $('#level_2_grid');
  if (thisGridL2.length > 0) {
    reset_grid(thisGridL2, 'level_2');
    reset_refresh("level_2_grid");
    reset_column_picker("level_2_grid");
  }
}

function show_level_3(data_to_show, level_3_grid_id ) {
  level1.removeClass('span3').addClass('span2 grow');
  level2.removeClass('span9 dx-back-hidden').addClass('span3 grow ');
  level3.removeClass('hidden').addClass('span7 grow ').html(data_to_show);
  $('#level_3 .dx-datagrid').animateCss('fadeIn');
  $('.back-return').css('visibility', 'visible').animateCss('fadeIn');
  reset_grid(thisGridL1, 'level_3');
  reset_grid($('#level_2_grid'), 'level_3');
  level_back('#level_2');

  level_3_grid_id = level_3_grid_id || 'level_3_grid';
  var thisGridL3 = $('#' + level_3_grid_id);
  if (thisGridL3.length > 0) {
    reset_grid(thisGridL3, 'level_3');
    reset_refresh(level_3_grid_id);
    reset_column_picker(level_3_grid_id);
  }
}

function level_back(level) {
  var selBtn = $('[data-md-level="' + level + '"]');
  var lvlSel = $( level );

  lvlSel.mouseenter(function() {
    selBtn.removeClass('hidden').animateCss('fadeIn');
  });
  lvlSel.mouseleave(function() {
    selBtn.addClass('hidden');
  });
}

function clickBack(btn, level) {

  $('body').on('click', btn, function() {
    var downLoadBtn = $('.download_button');
    var old_link = downLoadBtn.attr('data-href');
    downLoadBtn.attr('href', old_link);
    level();

    $('.dx-md-return').addClass('hidden');
  });
}

function reset_grid(grid, level){
  var dataGrid = grid.dxDataGrid('instance');
  try {
    if(grid.data("compact-view") && (grid.data("compact-view")[level] || []).length > 0) {
      $.each(grid.data("compact-view")[level], function(i, item) {
        grid.dxDataGrid('columnOption', item.name, item.property, item.value);
      });
    }
  }
  catch(e) {
    // Catches the instance where the compact view is not defined in a master detail (but its indeterminable  )
  }
  finally {
    window.setTimeout(function(){
      dataGrid.updateDimensions();
      dataGrid.repaint();
    }, 1000);
  }
}

function reset_refresh(grid_continer_id){
  $('#btn_refresh_level_1_grid').data("container-id", grid_continer_id);
}

function reset_column_picker(grid_container_id){
  $('#btn_col_chooser_level_1_grid').data("container-id", grid_container_id);
}

function factory_reset_grid(grid){
  var dataGrid = grid;

  dataGrid.dxDataGrid({
    columns: grid.data("default-json")
  });

  dataGrid.dxDataGrid('instance').clearSelection();
}

function initMasterDetail() {
  thisGridL1 = $('#level_1_grid');
  level1 = $('#level_1');
  level2 = $('#level_2');
  level3 = $('#level_3');
  allLevels = $('#level_1, #level_2, #level_3');
  allLevels.css('overflow', 'none');
  show_level_1();

  clickBack('.btn-return-l1', show_level_1);
  clickBack('.btn-return-l2', show_level_2);

  $('body').on('click', '.btn-return-l1', function () {
    if (thisGridL1.data("compact-view") && (thisGridL1.data("compact-view")['level_1'] || []).length > 0) {
      reset_grid(thisGridL1, 'level_1');
      thisGridL1.dxDataGrid('instance').clearSelection();
    } else {
      //keep original functionality if there is no level 1 setup in the datatable.
      factory_reset_grid(thisGridL1)
    }
  });

  $('body').on('toggle', '.dx-select-checkbox', function () {
    $('#level_2_grid').dxDataGrid('instance').clearSelection();
  });

  this.showErrorDialog = function() {
    $('#dialog_error').modal('hide');
    return false;
  };

  $('#grid_toolbar').remove();
}
