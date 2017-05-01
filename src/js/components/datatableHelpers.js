var classLetters = {
  "E": 1000,
  "M": 500,
  "S": 1
};


function getClassValue(resClass) {
  return parseInt(classLetters[resClass[0]]) + parseInt(resClass[1]);
}

$.fn.dataTableExt.oSort["rclass-desc"] = function (x, y) {
  return getClassValue(x) < getClassValue(y);
};

$.fn.dataTableExt.oSort["rclass-asc"] = function (x, y) {
  return getClassValue(x) > getClassValue(y);
};

$.fn.dataTableExt.oSort["select-desc"] = function (x, y) {
  return $(x).find(":selected").val() < $(y).find(":selected").val();
};

$.fn.dataTableExt.oSort["select-asc"] = function (x, y) {
  return $(x).find(":selected").val() > $(y).find(":selected").val();
};

$.fn.dataTableExt.oSort["selecttext-desc"] = function (x, y) {
  return $(x).find(":selected").text() < $(y).find(":selected").text();
};

$.fn.dataTableExt.oSort["selecttext-asc"] = function (x, y) {
  return $(x).find(":selected").text() > $(y).find(":selected").text();
};