({
  "dir": "build/optimized/",
  "mainConfigFile": "require.config.js",
  "optimizeCss": "none",
  "optimize": "uglify2",
  "skipDirOptimize": false,
  "removeCombined": false,
  "preserveLicenseComments": false,
  "paths": {
    "common": "bower_components/js-sdk/src/common",
    "jquery": "empty:",
    "prototype": "empty:",
    "report.global": "empty:",
    "csrf.guard": "empty:",
    "wcf.scroll": "empty:",
    "ReportRequireJsConfig": "empty:",
    "fusioncharts": "empty:",
    "ireport.highcharts.default.service": "empty",
    "jasperreports-global-css": "empty",
    "jr.jive.i18n": "empty",
    "jr.jive.vm": "empty",
    "jr.jive.sort.vm": "empty",
    "jr.jive.crosstab.templates.styles": "empty",
    "jr.jive.highcharts.vm": "empty",
    "jr.jive.templates": "empty",
    "jr.jive.crosstab.templates": "empty",
    "jr.jive.chartSelector": "empty",
    "jr.jive.filterDialog": "empty"
  },
  "shim": {
    "xdm.remote.page": {
      "deps": [
        "bower_components/requirejs/require",
        "require.config",
        "bower_components/jquery/dist/jquery"
      ]
    },
    "mustache": {
      "init": function () {
                                return Mustache;
                            }
    }
  },
  "modules": [
    {
      "name": "adhoc.start.page"
    },
    {
      "name": "admin.adhoc.cache.page"
    },
    {
      "name": "admin.adhoc.options.page"
    },
    {
      "name": "admin.orgs.page"
    },
    {
      "name": "dashboard.designer.frame.page"
    },
    {
      "name": "dashboard.designer.page"
    },
    {
      "name": "dashboard.runtime.frame.page"
    },
    {
      "name": "dashboard.runtime.page"
    },
    {
      "name": "dashboardDesignerPage"
    },
    {
      "name": "dashboardViewerPage"
    },
    {
      "name": "domain.designer.calculatedFields.page"
    },
    {
      "name": "domain.designer.derivedTables.page"
    },
    {
      "name": "domain.designer.display.page"
    },
    {
      "name": "domain.designer.filters.page"
    },
    {
      "name": "domain.designer.joins.page"
    },
    {
      "name": "domain.designer.tables.page"
    },
    {
      "name": "domain.setup.page"
    },
    {
      "name": "adhoc/adhoc.page"
    },
    {
      "name": "dataChooser/pages/displayPage"
    },
    {
      "name": "dataChooser/pages/fieldsPage"
    },
    {
      "name": "dataChooser/pages/preFiltersPage"
    },
    {
      "name": "dataChooser/pages/saveAsTopicPage"
    },
    {
      "name": "home/AdminWorkflowPage"
    },
    {
      "name": "home/HomePage"
    },
    {
      "name": "old/home/DeprecatedHomeApp"
    },
    {
      "name": "report/option/editReportOptionPage"
    },
    {
      "name": "commons.main"
    },
    {
      "name": "dataSource/addDataSourcePage"
    },
    {
      "name": "addDataType.page"
    },
    {
      "name": "addFileResource.page"
    },
    {
      "name": "addInputControl.page"
    },
    {
      "name": "addInputControlQueryInformation.page"
    },
    {
      "name": "addJasperReport.page"
    },
    {
      "name": "addJasperReportLocateControl.page"
    },
    {
      "name": "addJasperReportResourceNaming.page"
    },
    {
      "name": "addJasperReportResourcesAndControls.page"
    },
    {
      "name": "addListOfValues.page"
    },
    {
      "name": "addMondrianXML.page"
    },
    {
      "name": "addOLAPView.page"
    },
    {
      "name": "addQuery.page"
    },
    {
      "name": "addQueryWithResourceLocator.page"
    },
    {
      "name": "admin.export.page"
    },
    {
      "name": "admin.import.page"
    },
    {
      "name": "admin.logging.page"
    },
    {
      "name": "admin.options.page"
    },
    {
      "name": "admin.roles.page"
    },
    {
      "name": "admin.users.page"
    },
    {
      "name": "connectionType.page"
    },
    {
      "name": "dataTypeLocate.page"
    },
    {
      "name": "listOfValuesLocate.page"
    },
    {
      "name": "locateDataSource.page"
    },
    {
      "name": "locateMondrianConnectionSource.page"
    },
    {
      "name": "locateQuery.page"
    },
    {
      "name": "locateXmlConnectionSource.page"
    },
    {
      "name": "login.page"
    },
    {
      "name": "olap.view.page"
    },
    {
      "name": "report.viewer.page"
    },
    {
      "name": "plain.report.viewer.page"
    },
    {
      "name": "results.page"
    },
    {
      "name": "messages/details/messageDetails.page"
    },
    {
      "name": "messages/list/messageList.page"
    },
    {
      "name": "scheduler/JobsPage"
    },
    {
      "name": "encrypt.page"
    },
    {
      "name": "error.system"
    },
    {
      "name": "xdm.remote.page"
    }
  ],
  "inlineText": true,
  "excludeText": [
    "jr.jive.i18n.tmpl",
    "jr.jive.templates.tmpl",
    "jr.jive.crosstab.templates.tmpl",
    "jr.jive.crosstab.templates.styles.css",
    "jr.jive.sort.vm.css",
    "jr.jive.filterDialog.tmpl",
    "jr.jive.chartSelector.tmpl"
  ],
  "fileExclusionRegExp": /(prototype.*patched\.js|Owasp\.CsrfGuard\.js)/
})