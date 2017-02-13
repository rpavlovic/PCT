// global list of data feeds
var feeds = {
  'offices': [ 'data/OfficeCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/OfficeCollection?$format=json' ],
  'employee': [ 'data/EmployeeCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/EmployeeCollection?$format=json' ],
  'projectList': [ 'data/ProjectInfoCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectInfoCollection?$format=json' ],
  'project': [ 'data/ProjectInfoCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectInfoCollection?$filter=Projid eq \'{token}\'&$format=json' ],
  'jobSearch': [ 'data/JobSearchCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/JobNumberCollection/?$filter=SearchString eq \'{token}\'&$format=json' ],

  /*
   * margin modeling data, e.g.:  get_data_feed('marginModeling', '100100', 'SRGF')
   *  SRBF    Standard Resource Based Fee
   *  ARBF    Adjusted Resource Based Fee
   *  TMBF    Target Margin Based Fee
   *  FFT    Fixed Fee Target
   */
  'marginModeling': [ 'data/MarginModeling.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectRsrcModelingCollection?$filter=Projid eq \'{token}\' and ModelType eq \'{count}\'&$format=json' ],

  // Rate Card / Bill Rate / Job Title by Office name, e.g.:  get_data_feed('rateCards', 'US02')
  'rateCards': [ 'data/RateCardBillRateCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/RateCardCollection/?$  \'{token}\'&$format=json' ],

  // Project Deliverables by Project ID, e.g.:  get_data_feed('projectDeliverables', '100100')
  'projectDeliverables': [ 'data/ProjectRelatedDeliverables.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjDeliverablesCollection?$filter=Projid eq \'{token}\'&$format=json' ],

  // Project Resources by Project ID and Row Count, e.g.:  get_data_feed('projectResources', '100100', 1)
  'projectResources': [ 'data/ProjectResourcesCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectResourcesCollection?$filter=Projid eq \'{token}\' and Rowno eq \'{count}\'&$format=json' ],

  // TODO: make dynamic
  'plannedHours': [ 'data/PlannedHours.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/PlannedHoursSet?$filter=Projid eq \'1000103\' and Rowno eq \'001\' and Plantyp eq \'WK\' and Cellid eq \'R1\'&$format=json' ],

  // Project Expenses by Project ID, e.g.:  get_data_feed('projectExpenses', '100100')
  'projectExpenses': [ 'data/ProjectExpensesCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/ProjectExpensesCollection/?$filter=Projid eq \'{token}\'&$format=json' ],

  // custom bill sheet by employee ID
  'billSheet': [ 'data/BillSheetCollection.json', '/sap/opu/odata/sap/ZUX_PCT_SRV/BillSheetCollection?$filter=EmpNumber eq \'{token}\'&$format=json' ]
};

/**
 * Returns static JSON if local; SAP endpoint, otherwise
 * @param {String} key name of feed to return data for
 * @param {String} query string to be used for SAP endpoint
 * @return {String|NULL} local filename; SAP endpoint (or NULL)
 */
function get_data_feed(feed, query, count) {
  var json = null;

  // typically the Project ID
  if(typeof query == 'undefined') {
    query = false;
  }

  // Row count for Resources
  if(typeof count == 'undefined') {
    count = 1;
  }

  if (location.href.indexOf('localhost') != -1 || location.href.indexOf('10.211.55.2') != -1) {
    json = feed[0];
  }
  else {
    json = feed[1].replace('{token}', query);
    json = feed[1].replace('{count}', count);
  }

  return json;
}
