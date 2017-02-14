// global list of data feeds
var feeds = {
  'offices': [ 'data/OfficeCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/OfficeCollection?$format=json' ],
  'employee': [ 'data/EmployeeCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/EmployeeCollection?$format=json' ],
  'projectList': [ 'data/ProjectInfoCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectInfoCollection?$format=json' ],

  // Project by Project ID, e.g.:  get_data_feed('project', '1000100')
  'project': [ 'data/ProjectInfoCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectInfoCollection?$filter=Projid eq \'{param1}\'&$format=json' ],

  // deprecated (may be used for phase 2)
  'jobSearch': [ 'data/JobSearchCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/JobNumberCollection/?$filter=SearchString eq \'{param1}\'&$format=json' ],

  /*
   * margin modeling data, e.g.:  get_data_feed('marginModeling', '1000100', 'SRGF'); key:
   *  SRBF    Standard Resource Based Fee
   *  ARBF    Adjusted Resource Based Fee
   *  TMBF    Target Margin Based Fee
   *  FFT    Fixed Fee Target
   */
  'marginModeling': [ 'data/MarginModeling.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectRsrcModelingCollection?$filter=Projid eq \'{param1}\' and ModelType eq \'{param2}\'&$format=json' ],

  // Rate Card / Bill Rate / Job Title by Office name, e.g.:  get_data_feed('rateCards', 'US02')
  'rateCards': [ 'data/RateCardBillRateCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/RateCardCollection/?$  \'{param1}\'&$format=json' ],

  // Project Deliverables by Project ID, e.g.:  get_data_feed('projectDeliverables', '1000100')
  'projectDeliverables': [ 'data/ProjectRelatedDeliverables.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjDeliverablesCollection?$filter=Projid eq \'{param1}\'&$format=json' ],

  // Project Resources by Project ID and Row Count, e.g.:  get_data_feed('projectResources', '1000100', 1)
  'projectResources': [ 'data/ProjectResourcesCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectResourcesCollection?$filter=Projid eq \'{param1}\' and Rowno eq \'{param2}\'&$format=json' ],

  /*
   * planned hours by type, e.g.:  get_data_feed('plannedHours', '1000100', '001', 'WK', 'R1'):
   *  @param {String|Number} project ID
   *  @param {String|Number} row count
   *  @param {String} plant type: Weekly, Monthly, Summary
   *  @param {String} column/cell count
   */
  'plannedHours': [ 'data/PlannedHours.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/PlannedHoursSet?$filter=Projid eq \'{param1}\' and Rowno eq \'{param2}\' and Plantyp eq \'{param3}\' and Cellid eq \'{param4}\'&$format=json' ],

  // Project Expenses by Project ID, e.g.:  get_data_feed('projectExpenses', '1000100')
  'projectExpenses': [ 'data/ProjectExpensesCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectExpensesCollection/?$filter=Projid eq \'{param1}\'&$format=json' ],

  // custom bill sheet by employee ID
  'billSheet': [ 'data/BillSheetCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/BillSheetCollection?$filter=EmpNumber eq \'{param1}\'&$format=json' ]
};

/**
 * Returns static JSON if local; SAP endpoint, otherwise
 * @param {Array} key name of feed to return data for
 * @param {String} optional param to be used for SAP endpoint
 * @return {String|NULL} local filename; SAP endpoint (or NULL)
 */
function get_data_feed(feed, param1, param2, param3, param4) {
  var uri = null;

  // typically the Project ID
  if(typeof param1 == 'undefined') {
    param1 = false;
  }

  // Usually row count for Resources
  if(typeof param2 == 'undefined') {
    param2 = 1;
  }

  if (location.href.indexOf('localhost') != -1 || location.href.indexOf('10.211.55.2') != -1) {
    uri = feed[0];
  }
  else {
    uri = feed[1];
    uri = uri.replace(new RegExp('{param1}', 'g'), param1);
    uri = uri.replace(new RegExp('{param2}', 'g'), param2);
    uri = uri.replace(new RegExp('{param3}', 'g'), param3);
    uri = uri.replace(new RegExp('{param4}', 'g'), param4);
  }

  return uri;
}
