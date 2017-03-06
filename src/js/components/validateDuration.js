/**
* @module Tabs called from showLogin.js
* @version
*/

var validateDurationPlanBy = (function ($) {
  'use strict';

  function initValidateDurationPlanBy() {

    function validatePlanBy() {
       $("form.project-info select[name='planby']").on('change', function(event) {
        var planby = $(this).val();
        if($("form.project-info input[name='Duration']").hasClass('error')) {
          $("form.project-info input[name='Duration']").val('').removeClass('error');
        }
      });
    }

    function validateDuration() {
       $("form.project-info input[name='Duration']").on('change keyup', function(event) {
        var duration = $(this).val().replace(/\D/g, '');
        compare_plan_duration($("form.project-info select[name='planby']").val(), duration);
      });
    }

    function compare_plan_duration(planby, duration) {
      if(planby === 'WK' && duration > 52) {
        $("form.project-info input[name='Duration']").val('Please enter less than 52 weeks.').addClass('error');
      }
      if(planby === 'MN' && duration > 24) {
         $("form.project-info input[name='Duration']").val('Please enter less than 24 months.').addClass('error');
      }
    }
    validatePlanBy();
    validateDuration();
  }

  return {
    initValidateDurationPlanBy:initValidateDurationPlanBy
  };

})($);
