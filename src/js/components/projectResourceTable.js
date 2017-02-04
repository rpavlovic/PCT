/**
 * @module Draw Data Table for Preoject Resource page.
 * @version
 */

var projectResourceTable = (function ($) {
    'use strict';

    function initProjectResourceTable() {
        var myD;

        var p1 = new Promise(function (resolve, reject) {
            $.getJSON(get_data_feed(feeds.projectDeliverables), function (deliverables) {
                resolve(deliverables.d.results);
            });
        });

        var p2 = new Promise(function (resolve, reject) {
            $.getJSON(get_data_feed(feeds.offices), function (offices) {
                resolve(offices.d.results);
            });
        });

        var p3 = new Promise(function (resolve, reject) {
            $.getJSON(get_data_feed(feeds.rateCards), function (rateCards) {
                resolve(rateCards.d.results);
            });
        });
        
        Promise.all([p1, p2, p3]).then(function (values) {
            console.log(values);
            //deliverables
            var de = values[0];
            var off = values[1];
            var rcs = values[2];

            var myRows = {};

            for (var i = 0; i < off.length; i++) {
                var officeElem = off[i];
                myRows[officeElem.Office] = {
                    deliver: de,
                    office: officeElem
                }
            }

            console.log(myRows);
            myRows = Object.values(myRows);
            var table = $('#project-resource-table');

            var projResourceTable = table.DataTable({
                "searching": false,
                "data": myRows,
                "deferRender": true,
                "paging": false,
                "stateSave": true,
                "info": false,
                "bAutoWidth": false,
                "ordering": true,
                "columnDefs": [
                    {
                        "orderable": false,
                        "targets": [0, 1]
                    }
                ],
                "order": [[3, 'asc']],
                "columns": [{
                    "title": 'Row',
                    "class": "center",
                    "defaultContent": '',
                    "data": null
                },
                    {
                        "title": '<i class="fa fa-trash"></i>',
                        "class": "center blue-bg",
                        "data": null,
                        "defaultContent": '<a href=" " class="remove"><i class="fa fa-trash"></i></a>'
                    },
                    {
                        "title": 'Deliverable / Work&nbsp;Stream',
                        "data": "deliver",
                        "defaultContent": '',
                        "render": function (data, type, set) {
                            var select = "<select class='deliverable' name='DelvDesc' >";
                            $.each(data, function (key, val) {
                                select += '<option>' + val.DelvDesc + '</option>';
                            });
                            select += "</select>";
                            return select;
                        }
                    },
                    {
                        "title": 'Office',
                        "data": "Offices",
                        "defaultContent": '',
                        "class": "td-office",
                        "render": function () {
                            // if(Offices.length > 0) {
                            //     var select = "<select class='office' name='Office'>";
                            //     $.each(Offices, function(key, val){
                            //         select += val;
                            //     });
                            //     select += "</select>";
                            //     return select;
                            // } else {
                            return "<select class='office' name='Office' />";
                            //}
                        }
                    },
                    {
                        "title": 'Title',
                        "data": "EmpGradeName",
                        "defaultContent": '',
                        "class": 'td-title',
                        "render": function (data, type, set) {
                            return "<select class='title' name='EmpGradeName' />";
                        }
                    },
                    {
                        "title": 'Class',
                        "data": " ",
                        "class": "center td-class",
                        "defaultContent": '',
                        render: function (data, type, row) {
                            if (data) {
                                return "<div contenteditable />" + data + "</div>";
                            }
                            else {
                                return "<div contenteditable />";
                            }
                        }
                    },
                    {
                        "title": 'Practice',
                        "data": "CostCenterName",
                        "defaultContent": '',
                        "class": "td-practice",
                        "render": function () {
                            return "<select class='practice' name='CostCenterName' />";
                        }
                    },
                    {
                        "title": 'Role',
                        "data": " ",
                        "defaultContent": '<div contenteditable />',
                        // render : function(data, type, row) {
                        //   return "<div contenteditable />" ;
                        // }
                    },
                    {
                        "title": 'Proposed <br/> Resource',
                        "data": " ",
                        "defaultContent": '<div contenteditable />',
                        // render : function(data, type, row) {
                        //   return "<div contenteditable />" ;
                        // }
                    },
                    {
                        "title": 'Bill Rate',
                        "defaultContent": '',
                        "data": "BillRate",
                        "class": "td-billrate"
                    },
                    {
                        "title": 'Bill Rate <br/> Override',
                        "defaultContent": '<div contenteditable />',
                        "sClass": "rate-override num",
                        // render : function(data, type, row) {
                        //   return "<div contenteditable />" ;
                        // }
                    },
                    {
                        "title": "Cost Bill Rate",
                        "data": "CostRate",
                        "defaultContent": '',
                        "visible": false,
                        "render": function (data) {
                            return "$" + data;
                        }
                    },
                    {
                        "title": 'Total Hours',
                        "data": " ",
                        "defaultContent": ''
                    },
                    {
                        "title": 'Total Fees',
                        "data": " ",
                        "defaultContent": ''
                    },
                    {
                        "title": 'JAN <br/> 16',
                        "data": " ",
                        "defaultContent": '<div contenteditable />',
                        // render : function(data, type, row) {
                        //   return "<div contenteditable />" ;
                        // }
                    },
                    {
                        "title": 'FEB <br/> 16',
                        "data": " ",
                        "defaultContent": '<div contenteditable />',
                        // render : function(data, type, row) {
                        //   return "<div contenteditable />" ;
                        // }
                    },
                    {
                        "title": 'MAR <br/> 16',
                        "data": " ",
                        "defaultContent": '<div contenteditable />',
                        // render : function(data, type, row) {
                        //   return "<div contenteditable />" ;
                        // }
                    },
                    {
                        "title": 'APR <br/> 16',
                        "data": " ",
                        "defaultContent": '<div contenteditable />',
                        // render : function(data, type, row) {
                        //   return "<div contenteditable />" ;
                        // }
                    },
                    {
                        "title": 'MAY <br/> 16',
                        "data": " ",
                        "defaultContent": '<div contenteditable />',
                        // render : function(data, type, row) {
                        //   return "<div contenteditable />" ;
                        // }
                    },
                    {
                        "title": 'JUN <br/> 16',
                        "data": " ",
                        "defaultContent": '<div contenteditable />',
                        // render : function(data, type, row) {
                        //   return "<div contenteditable />" ;
                        // }
                    },
                    {
                        "title": 'JUL <br/> 16',
                        "data": " ",
                        "defaultContent": '<div contenteditable />',
                        // render : function(data, type, row) {
                        //   return "<div contenteditable />" ;
                        // }
                    },
                    {
                        "title": 'AUG <br/> 16',
                        "data": " ",
                        "defaultContent": '<div contenteditable />',
                        // render : function(data, type, row) {
                        //   return "<div contenteditable />" ;
                        // }
                    },
                    {
                        "title": 'SEP <br/> 16',
                        "data": " ",
                        "defaultContent": '<div contenteditable />',
                        // render : function(data, type, row) {
                        //   return "<div contenteditable />" ;
                        // }
                    },
                    {
                        "title": 'OCT <br/> 16',
                        "data": " ",
                        "defaultContent": '<div contenteditable />',
                        // render : function(data, type, row) {
                        //   return "<div contenteditable />" ;
                        // }
                    },
                    {
                        "title": 'NOV <br/> 16',
                        "data": " ",
                        "defaultContent": '<div contenteditable />',
                        // render : function(data, type, row) {
                        //   return "<div contenteditable />" ;
                        // }
                    },
                    {
                        "title": 'DEC <br/> 16',
                        "data": " ",
                        "defaultContent": '<div contenteditable />',
                        // render : function(data, type, row) {
                        //   return "<div contenteditable />" ;
                        // }
                    }],
                "bFilter": false,
                "select": true,
                "rowCallback": function (row, json) {
                    $(row).removeClass('odd even');
                    $("td:nth-child(n+6):not(:nth-child(7)):not(:nth-child(10)):not(:nth-child(12)):not(:nth-child(13))", row)
                    // .prop('contenteditable', true)
                        .addClass("contenteditable");
                },
                "createdRow": function (row, data, index) {
                    $('tfoot td').removeClass('center blue-bg rate-override num');
                },
                "drawCallback": function () {
                },
                "initComplete": function (settings, json, row) {
                },
                "bDestroy": true
            });
        });
    }

    return {
        initProjectResourceTable: initProjectResourceTable
    };
})($);