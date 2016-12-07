
/**
 * @module working with dates in form fields.
 * @version
 */
var projectDuration = (function ($) {
    'use strict';

    function initProjectDuration(form) {
            if($(form + " select[name=planby] option:selected").text() == 'Weekly') {
            //     $(form + " select[name=planby]").on("change", function() {
                var curr = new Date($(form + " .datepicker").val()); // get current date

                var first = curr.getDate(); // First day is the day of the month - the day of the week
                var last = first + 7; // last day is the first day + 6

                // var firstday = new Date(curr.setDate(first));
                var lastday = new Date(curr.setDate(last));
                var month = lastday.getMonth() + 1;
                var weekly_month = month < 10 ? '0' + month : '' + month
                $(form + " input[name=\"duration\"]").val(weekly_month + '/' + lastday.getDate() + '/' + lastday.getFullYear());
            // });
        }
    }
    return {
        initProjectDuration:initProjectDuration
    }

})($);


