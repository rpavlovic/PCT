
/**
* @module Draw Data Table for Active Projects.
* @version
*/
var activeTableFunction = (function ($) {
  'use strict';

  function initActiveTable() {

  var table = $('#active-projects');

  var activeTable = table.DataTable({
    "sDom": '<"toolbar"><B><tip>',
    "searching": true,
    "ajax" : {
       "url": get_data_feed( feeds.project ),
        "dataSrc": "d.results"
     },
    "bServerSide" : false,
    "iDisplayLength": 10,
    "bAutoWidth": false,
    "columnDefs": [ {
      "orderable": false,
      "targets": [5, 6],
      }],
    "aoColumns": [
    {
      "sTitle": 'Project Name',
      "data":"Projname",
      "render": function ( data, type, set, meta ) {
        var output = '<a href="projectGeneral.html?projID='+set.Projid+'&projName='+data+'" title="ProjectName">';
            output += data;
            output += '</a>';
        return output;
      }
    },
    {
      "sTitle": 'Billing Office',
      "data":"Office"
    },
    {
      "title": 'Est.Date',
      "data":"EstStDate",
      "defaultContent": '',
      "render" : function(data, type) {
        var str = data;
        var num = parseInt(str.replace(/[^0-9]/g, ""));
        var date = new Date(num);
        if ( type === 'display' || type === 'filter' ) {
         var d = date;
         return d.getDate() +'/'+ (d.getMonth()+1) +'/'+ d.getFullYear();
        }
       // Otherwise the data type requested (`type`) is type detection or
       // sorting data, for which we want to use the integer, so just return
       // that, unaltered
       return data;
       }
    },
    {
      "title": 'Duration',
      "data": "Duration",
      "defaultContent": '',
    },
    {
      "title": 'Budget',
      "data":" ",
      "defaultContent": ''
    },
    {
      "title" : '<i class="fa fa-files-o"></i>',
      "sClass": "center blue-bg",
      "data": "Projid",
      "defaultContent": '',
      "render": function ( data, type, set, meta ) {
       return '<a href="projectGeneral.html?projID='+data+'&projName='+set.Projname+'" class=""><i class="fa fa-files-o"></i></a>';
      }
    },
    {
      "title" : '<i class="fa fa-trash"></i>',
      "sClass": "center blue-bg",
      "data": null,
      "defaultContent":'<a href="" class="remove"><i class="fa fa-trash"></i></a>',
    }
    ],
    "bFilter": true,
    "select": true,
    "buttons": [
      'copy', 'csv', 'excel',
      {
        "extend": 'pdf',
        "download": 'open'
      }
    ],
    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      $(nRow).removeClass('odd even');
    },
    //when json is loaded add the filters to the toolbar div.
    "fnInitComplete": function (nRow) {
      this.api().columns().every(function (index, fn) {
        var column = this;
        var field_wrapper =$('<div class="field-wrapper"></div>');
        var label = $('<label for="search_'+index+'" class="show">Filter</label>');
        if(index < 5) {
          var select = $('<select name="search_'+index+'" selected><option value=""></option></select>')
          .appendTo( "div.toolbar")
            .on('change', function () {
              var val = $.fn.dataTable.util.escapeRegex(
                $(this).val()
              );
              column.search( val ? '^' + val + '$' : '', true, false ).draw();
            });

            select.wrap(field_wrapper);
            label.insertBefore(select);
            //create filters
            column.data().unique().sort().each( function ( d ) {
              if(typeof d === 'string' && d.indexOf('/Date') != -1) {
                console.log(typeof d)
                var str = d;
                var num = parseInt(str.replace(/[^0-9]/g, ""));
                d = new Date(num);
                d = d.getDate() +'/'+ (d.getMonth()+1) +'/'+ d.getFullYear();
              }
              select.append( '<option value="'+ d +'">' + d + '</option>' );
          });
        }
      });
      $('.toolbar').hide();
    },
    "bDestroy": true,
  });
  // activeTable.api().on( 'xhr', function () {
  //   var json = activeTable.api().ajax.json();
  //   console.log( json.d.results );
  // });

  $('.search-table').on( 'keyup change search', function (e) {
     activeTable.search( this.value ).draw(  );
  });
  // $( '.buttons-page-length' ).insertAfter('#active-projects_wrapperarchived-projects_wrapper').wrap("<div class=\"dt-buttons\" />").addClass('float-right');
  $('#active-projects tbody').on( 'click', '.remove', function (e) {
    e.preventDefault();
     activeTable.row( $(this).parents('tr') ).remove().draw();
   });
  }
  return {
    initActiveTable:initActiveTable
  };

})($);
