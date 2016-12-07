
/**
 * @module working with dates in form fields.
 * @version
 */
var projectDuration = (function ($) {
    'use strict';

    function initProjectDuration(form, inst, dateText) {
        console.log(dateText);
            if($(form + " select[name=planby] option:selected").text() == 'Weekly') {

                var curr = new Date($(form + " .datepicker").val()); // get current date
                var first = curr.getDate();
                var last = first + 7;
                var lastday = new Date(curr.setDate(last));
                var month = lastday.getMonth() + 1;
                var weekly_month = month < 10 ? '0' + month : '' + month;
                // $(form + " select[name=planby] option").on('keyup change',function(){
                    if($(inst.input.val()!== '')) {
                        $(form + " input[name=\"duration\"]").val(weekly_month + '/' + lastday.getDate() + '/' + lastday.getFullYear());
                    } else {
                        $(form + " input[name=\"duration\"]").val();
                    }
                // })

                // $(form + " input[name=\"duration\"]").val(weekly_month + '/' + lastday.getDate() + '/' + lastday.getFullYear());
        }
    }
    return {
        initProjectDuration:initProjectDuration
    }

})($);


