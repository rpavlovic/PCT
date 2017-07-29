var classLetters = {
  "E": 1000,
  "M": 500,
  "S": 1
};

function getClassValue(resClass) {
  return parseInt(classLetters[resClass[0]]) + parseInt(resClass[1]);
}

$.fn.dataTableExt.oSort["rclass-desc"] = function (x, y) {
  if (getClassValue(x) < getClassValue(y)) {
    return 1;
  }
  else if (getClassValue(x) > getClassValue(y)) {
    return -1;
  }
  // must be equal
  else {
    return 0;
  }
};

$.fn.dataTableExt.oSort["rclass-asc"] = function (x, y) {
  if (getClassValue(x) < getClassValue(y)) {
    return -1;
  }
  else if (getClassValue(x) > getClassValue(y)) {
    return 1;
  }
  // must be equal
  else {
    return 0;
  }
};

$.fn.dataTableExt.oSort["select-desc"] = function (x, y) {
  if ($(x).find(":selected").val() < $(y).find(":selected").val()) {
    return -1;
  }
  else if ($(x).find(":selected").val() > $(y).find(":selected").val()) {
    return 1;
  }
  else {
    return 0;
  }
};

$.fn.dataTableExt.oSort["select-asc"] = function (x, y) {
  if ($(x).find(":selected").val() < $(y).find(":selected").val()) {
    return 1;
  }
  else if ($(x).find(":selected").val() > $(y).find(":selected").val()) {
    return -1;
  }
  else {
    return 0;
  }
};

$.fn.dataTableExt.oSort["selecttext-desc"] = function (x, y) {
  if($(x).find(":selected").text() < $(y).find(":selected").text()) {
    return -1;
  }
  else if($(x).find(":selected").text() > $(y).find(":selected").text()) {
    return 1;
  }
  else {
    return 0;
  }
};

$.fn.dataTableExt.oSort["selecttext-asc"] = function (x, y) {
  if($(x).find(":selected").text() < $(y).find(":selected").text()) {
    return 1;
  }
  else if($(x).find(":selected").text() > $(y).find(":selected").text()) {
    return -1;
  }
  else {
    return 0;
  }
};

function getDeliverablesDropdown(deliverables, resource) {
  var select = "<select class='deliverable' name='DelvDesc'>";
  $.each(deliverables, function (key, val) {
    var selected = val.DelvDesc === resource.DelvDesc ? 'selected="selected" ' : '';
    select += '<option ' + selected + ' >' + val.DelvDesc + '</option>';
  });
  select += "</select>";
  return select;
}


function getOfficesDropdown(offices, resource) {
  var select = "<select class='office' name='Office'>";
  select += "<option>Select Office</option>";
  $.each(offices, function (key, val) {
    var selectString = resource.Officeid === val.Office ? 'selected="selected"' : '';
    select += '<option value="' + val.Office + '"' + selectString + '>' + val.OfficeName + ', ' + val.City + ' (' + val.Office + ')</option>';
  });
  select += "</select>";
  return select;
}

// this is Resource or Expense
function getPractices(projectInfo, resource) {
  var rateCards = getRateCardLocal(resource.Officeid, projectInfo.Currency);
  var selectedStyle = resource.Practiceid ? '' : "style='border:solid 1px red;'";
  var select = "<select class='practice' name='CostCenterName' " + selectedStyle + ">";
  select += "<option>Select Practice</option>";
  var practices = [];
  rateCards.filter(function (val) {
    // combining this conditional. if there's an EmpGradeName, then we need to filter,
    // otherwise just show any practice.
    var hasGradeName = resource.EmpGradeName ? resource.EmpGradeName === val.EmpGradeName : true;
    return val.Office === resource.Officeid && val.CostCenterName && hasGradeName;
  }).forEach(function (val) {
    practices[val.CostCenter] = val;
  });
  practices = Object.values(practices);
  practices.sort(function (a, b) {
    return (a.CostCenterName > b.CostCenterName) ? 1 : ((b.CostCenterName > a.CostCenterName) ? -1 : 0);
  });

  practices.forEach(function (val) {
    var selected = '';
    if (val.CostCenter === resource.Practiceid) {
      selected = 'selected="selected" ';
    }
    select += '<option value="' + val.CostCenter + '" ' + selected + '>' + val.CostCenterName + '</option>';
  });
  select += "</select>";
  return select;
}