requirejs.config(
{
  enforceDefine: true,
  config: {
    moment: {
      noGlobal: true
    },
    logger: {
      enabled: true,
      level: 'error',
      appenders: ['console']
    }
  },
  paths: {
    'backbone.original': 'bower_components/backbone/backbone',
    'underscore.string': 'bower_components/underscore.string/lib/underscore.string',
    'iota-observable': 'bower_components/iota-observable/iota-observable',
    'requirejs.plugin.css': 'bower_components/require-css/css',
    'tv4.original': 'bower_components/tv4/tv4',
    'backbone.validation.original': 'bower_components/backbone-validation/dist/backbone-validation-amd',
    jquery: 'bower_components/jquery/dist/jquery',
    'lodash.custom': 'bower_components/lodash.custom/lodash-2.4.1-custom',
    json3: 'bower_components/json3/lib/json3',
    xregexp: 'bower_components/xregexp/xregexp-all',
    moment: 'bower_components/moment/moment',
    'requirejs.plugin.text': 'bower_components/requirejs-text/text',
    domReady: 'bower_components/requirejs-domready/domReady',
    xdm: 'bower_components/xdm/artifacts/v2.4.19/easyXDM.jasper',
    'rivets.original': 'bower_components/rivets/dist/rivets',
    base64: 'bower_components/js-base64/base64',
    'jquery.timepicker.addon': 'bower_components/jquery.timepicker.addon/dist/jquery-ui-timepicker-addon',
    'jquery.ui': 'bower_components/jquery-ui/ui/jquery-ui-1.10.4.custom',
    'datepicker.i18n.en': 'bower_components/jquery-ui/ui/i18n/jquery.ui.datepicker-en',
    'datepicker.i18n.de': 'bower_components/jquery-ui/ui/ui/i18n/jquery.ui.datepicker-de',
    'datepicker.i18n.es': 'bower_components/jquery-ui/ui/ui/i18n/jquery.ui.datepicker-es',
    'datepicker.i18n.fr': 'bower_components/jquery-ui/ui/ui/i18n/jquery.ui.datepicker-fr',
    'datepicker.i18n.it': 'bower_components/jquery-ui/ui/ui/i18n/jquery.ui.datepicker-it',
    'datepicker.i18n.ja': 'bower_components/jquery-ui/ui/ui/i18n/jquery.ui.datepicker-ja',
    'datepicker.i18n.ro': 'bower_components/jquery-ui/ui/ui/i18n/jquery.ui.datepicker-ro',
    'datepicker.i18n.zh-CN': 'bower_components/jquery-ui/ui/ui/i18n/jquery.ui.datepicker-zh-CN',
    'datepicker.i18n.zh-TW': 'bower_components/jquery-ui/ui/ui/i18n/jquery.ui.datepicker-zh-TW',
    'jquery.ui.mouse.touch': 'bower_components/jquery.ui.touch-punch/jquery.ui.touch-punch',
    'jquery.selection': 'bower_components/jquery.selection/src/jquery.selection',
    'jquery.urldecoder': 'bower_components/jquery.urldecoder/jquery.urldecoder',
    'jquery.jcryption': 'bower_components/jCryption/jquery.jcryption',
    backbone: 'bower_components/js-sdk/src/common/config/backboneSettings',
    underscore: 'bower_components/js-sdk/src/common/config/lodashTemplateSettings',
    tv4: 'bower_components/js-sdk/src/common/config/tv4Settings',
    'backbone.validation': 'bower_components/js-sdk/src/common/extension/backboneValidationExtension',
    rivets: 'bower_components/js-sdk/src/common/extension/rivetsExtension',
    bundle: 'bower_components/js-sdk/src/common/plugin/bundle',
    settings: 'bower_components/js-sdk/src/common/plugin/settings',
    text: 'bower_components/js-sdk/src/common/plugin/text',
    css: 'bower_components/js-sdk/src/common/plugin/css',
    csslink: 'bower_components/js-sdk/src/common/plugin/csslink',
    logger: 'bower_components/js-sdk/src/common/logging/logger',
    'jquery-ui-custom-css': 'bower_components/jquery-ui/themes/redmond/jquery-ui-1.10.4-custom.css',
    'jquery-ui-custom-css-visualizejs': 'bower_components/jquery-ui/themes/redmond/jquery-ui-1.10.4-custom-visualizejs.css',
    async: 'bower_components/requirejs-plugins/src/async',
    common: 'bower_components/js-sdk/src/common',
    highcharts: 'bower_components/highcharts-pack/highcharts/highcharts',
    'highcharts-more': 'bower_components/highcharts-pack/highcharts/highcharts-more',
    heatmap: 'bower_components/highcharts-pack/highcharts/heatmap',
    'grouped-categories': 'bower_components/highcharts-pack/highcharts/grouped-categories',
    'jr.jive.i18n': '../reportresource/reportresource?resource=jive.i18n',
    'jr.jive.vm': '../reportresource/reportresource?resource=jive.vm',
    'jr.jive.sort.vm': '../reportresource/reportresource?resource=jive.sort.vm',
    'jr.jive.crosstab.templates.styles': '../reportresource/reportresource?resource=jive.crosstab.templates.styles',
    'jr.jive.highcharts.vm': '../reportresource/reportresource?resource=jive.highcharts.vm',
    'jr.jive.templates': '../reportresource/reportresource?resource=jive.templates',
    'jr.jive.crosstab.templates': '../reportresource/reportresource?resource=net/sf/jasperreports/crosstabs/interactive/jive.crosstab.templates',
    'jr.jive.chartSelector': '../reportresource/reportresource?resource=jive.chartSelector',
    'jr.jive.filterDialog': '../reportresource/reportresource?resource=jive.filterDialog',
    mustache: 'bower_components/mustache/mustache',
    jasper: 'bower_components/js-sdk/build/jasper',
    visualize: 'bi/viz/visualize',
    dashboard: 'bower_components/bi-dashboard/src/dashboard',
    'bi/repo': 'bower_components/bi-repo/src/bi/repo',
    'bi/control': 'bower_components/bi-control/src/bi/control',
    'bi/report': 'bower_components/bi-report/src/bi/report',
    'bi/dashboard': 'bower_components/bi-dashboard/src/bi/dashboard',
    'adhoc/highcharts.api': 'bower_components/bi-report/src/adhoc/chart/adhocToHighchartsAdapter',
    'adhoc/chart': 'bower_components/bi-report/src/adhoc/chart',
    prototype: 'bower_components/prototype/dist/prototype',
    json2: 'bower_components/json2/json2',
    builder: 'bower_components/scriptaculous/src/builder',
    effects: 'bower_components/scriptaculous/src/effects',
    dragdrop: 'bower_components/scriptaculous/src/dragdrop',
    iscroll: 'bower_components/iscroll/src/iscroll',
    'dragdrop.extra': 'bower_components/dragdropextra/dragdropextra',
    touchcontroller: 'bower_components/jrs-ui/src/touch.controller',
    'export.app': 'bower_components/jrs-ui/src/export.app',
    'components.toolbar': 'bower_components/jrs-ui/src/components.toolbarButtons.events',
    'components.list': 'bower_components/jrs-ui/src/list.base',
    'components.dynamicTree': 'bower_components/jrs-ui/src/dynamicTree.treesupport',
    'component.repository.search': 'repository.search.pro',
    'report.view': 'report.view.pro',
    'wcf.scroll': '../wcf/scroller',
    'csrf.guard': '../JavaScriptServlet?noext',
    'report.global': 'bower_components/jrs-ui/src/report.global',
    ReportRequireJsConfig: '../getRequirejsConfig.html?noext',
    'adhoc/chart/highchartsDataMapper': 'bower_components/bi-report/src/adhoc/chart/highchartsDataMapper',
    'adhoc/chart/palette/defaultPalette': 'bower_components/bi-report/src/adhoc/chart/palette/defaultPalette',
    'adhoc/chart/adhocDataProcessor': 'bower_components/bi-report/src/adhoc/chart/adhocDataProcessor',
    'adhoc/chart/enum/dateTimeFormats': 'bower_components/bi-report/src/adhoc/chart/enum/dateTimeFormats',
    'adhoc/chart/enum/adhocToHighchartsTypes': 'bower_components/bi-report/src/adhoc/chart/enum/adhocToHighchartsTypes',
    'jasperreports-loader': 'reportViewer/jasperreports-loader',
    dateFormatter: 'lib/dateFormatter-patched',
    'dragdrop.extra.v0.5': 'lib/dragdrop.extra-0.5-patched',
    'ireport.highcharts.default.service': '../reportresource?resource=com/jaspersoft/jasperreports/highcharts/charts/services/default.service.js',
    'jasperreports-global-css': '../reportresource?resource=net/sf/jasperreports/web/servlets/resources/jasperreports-global.css',
    fusioncharts: '../fusion/maps/FusionCharts',
    'bi/viz': 'bower_components/visualize-js/src/bi/viz',
    reportViewer: 'bower_components/jrs-ui/src/reportViewer',
    scheduler: 'bower_components/jrs-ui/src/scheduler',
    'commons.minimal.main': 'bower_components/jrs-ui/src/commons.minimal.main',
    'commons.bare.main': 'bower_components/jrs-ui/src/commons.bare.main',
    namespace: 'bower_components/jrs-ui/src/namespace',
    'jpivot.jaPro': 'bower_components/jrs-ui/src/jpivot.jaPro',
    'utils.common': 'bower_components/jrs-ui/src/utils.common',
    'utils.animation': 'bower_components/jrs-ui/src/utils.animation',
    'tools.truncator': 'bower_components/jrs-ui/src/tools.truncator',
    'tools.drag': 'bower_components/jrs-ui/src/tools.drag',
    'actionModel.modelGenerator': 'bower_components/jrs-ui/src/actionModel.modelGenerator',
    'actionModel.primaryNavigation': 'bower_components/jrs-ui/src/actionModel.primaryNavigation',
    'core.layout': 'bower_components/jrs-ui/src/core.layout',
    'home.simple': 'bower_components/jrs-ui/src/home.simple',
    'ajax.mock': 'bower_components/jrs-ui/src/ajax.mock',
    'core.ajax': 'bower_components/jrs-ui/src/core.ajax',
    'core.accessibility': 'bower_components/jrs-ui/src/core.accessibility',
    'core.events.bis': 'bower_components/jrs-ui/src/core.events.bis',
    'core.key.events': 'bower_components/jrs-ui/src/core.key.events',
    'error.system': 'bower_components/jrs-ui/src/error.system',
    errorPage: 'bower_components/jrs-ui/src/errorPage',
    'components.templateengine': 'bower_components/jrs-ui/src/components.templateengine',
    'components.ajaxdownloader': 'bower_components/jrs-ui/src/components.ajaxdownloader',
    'components.ajaxuploader': 'bower_components/jrs-ui/src/components.ajaxuploader',
    'components.authoritymodel': 'bower_components/jrs-ui/src/components.authoritymodel',
    'components.authoritypickerview': 'bower_components/jrs-ui/src/components.authoritypickerview',
    'components.dialogs': 'bower_components/jrs-ui/src/components.dialogs',
    'components.dialog': 'bower_components/jrs-ui/src/components.dialog',
    'components.dependent.dialog': 'bower_components/jrs-ui/src/components.dependent.dialog',
    'components.layout': 'bower_components/jrs-ui/src/components.layout',
    'components.searchBox': 'bower_components/jrs-ui/src/components.searchBox',
    'components.servererrorsbackbonetrait': 'bower_components/jrs-ui/src/components.servererrorsbackbonetrait',
    'components.notificationviewtrait': 'bower_components/jrs-ui/src/components.notificationviewtrait',
    'components.statecontrollertrait': 'bower_components/jrs-ui/src/components.statecontrollertrait',
    'components.state': 'bower_components/jrs-ui/src/components.state',
    'components.stateview': 'bower_components/jrs-ui/src/components.stateview',
    'components.notificationview': 'bower_components/jrs-ui/src/components.notificationview',
    'components.systemnotificationview': 'bower_components/jrs-ui/src/components.systemnotificationview',
    'components.toolbarButtons': 'bower_components/jrs-ui/src/components.toolbarButtons',
    'components.calendarInput': 'bower_components/jrs-ui/src/components.calendarInput',
    'messages/list/messageList': 'bower_components/jrs-ui/src/messages/list/messageList',
    'messages/details/messageDetails': 'bower_components/jrs-ui/src/messages/details/messageDetails',
    'components.tooltip': 'bower_components/jrs-ui/src/components.tooltip',
    'components.utils': 'bower_components/jrs-ui/src/components.utils',
    heartbeat: 'bower_components/jrs-ui/src/heartbeat',
    'components.heartbeat': 'bower_components/jrs-ui/src/components.heartbeat',
    'components.customTooltip': 'bower_components/jrs-ui/src/components.customTooltip',
    'components.pickers': 'bower_components/jrs-ui/src/components.pickers',
    'controls.core': 'bower_components/jrs-ui/src/controls.core',
    localContext: 'bower_components/jrs-ui/src/localContext',
    'controls.dataconverter': 'bower_components/jrs-ui/src/controls.dataconverter',
    'controls.datatransfer': 'bower_components/jrs-ui/src/controls.datatransfer',
    'controls.basecontrol': 'bower_components/jrs-ui/src/controls.basecontrol',
    'controls.base': 'bower_components/jrs-ui/src/controls.base',
    'repository.search.globalSearchBoxInit': 'bower_components/jrs-ui/src/repository.search.globalSearchBoxInit',
    'attributes.model': 'bower_components/jrs-ui/src/attributes.model',
    'attributes.view': 'bower_components/jrs-ui/src/attributes.view',
    'export': 'bower_components/jrs-ui/src/export',
    'export.statecontroller': 'bower_components/jrs-ui/src/export.statecontroller',
    'export.servererrortrait': 'bower_components/jrs-ui/src/export.servererrortrait',
    'export.formmodel': 'bower_components/jrs-ui/src/export.formmodel',
    'export.extendedformview': 'bower_components/jrs-ui/src/export.extendedformview',
    'export.shortformview': 'bower_components/jrs-ui/src/export.shortformview',
    'import': 'bower_components/jrs-ui/src/import',
    'import.formmodel': 'bower_components/jrs-ui/src/import.formmodel',
    'import.extendedformview': 'bower_components/jrs-ui/src/import.extendedformview',
    'import.app': 'bower_components/jrs-ui/src/import.app',
    'controls.components': 'bower_components/jrs-ui/src/controls.components',
    'controls.viewmodel': 'bower_components/jrs-ui/src/controls.viewmodel',
    'controls.logging': 'bower_components/jrs-ui/src/controls.logging',
    'controls.controller': 'bower_components/jrs-ui/src/controls.controller',
    'components.about': 'bower_components/jrs-ui/src/components.about',
    'dynamicTree.tree': 'bower_components/jrs-ui/src/dynamicTree.tree',
    'dynamicTree.treenode': 'bower_components/jrs-ui/src/dynamicTree.treenode',
    'dynamicTree.events': 'bower_components/jrs-ui/src/dynamicTree.events',
    'dynamicTree.utils': 'bower_components/jrs-ui/src/dynamicTree.utils',
    'components.webHelp': 'bower_components/jrs-ui/src/components.webHelp',
    'components.loginBox': 'bower_components/jrs-ui/src/components.loginBox',
    'components.tabs': 'bower_components/jrs-ui/src/components.tabs',
    'login.form': 'bower_components/jrs-ui/src/login.form',
    'login.main': 'bower_components/jrs-ui/src/login.main',
    'login.page': 'bower_components/jrs-ui/src/login.page',
    'tools.infiniteScroll': 'bower_components/jrs-ui/src/tools.infiniteScroll',
    'mng.common': 'bower_components/jrs-ui/src/mng.common',
    'mng.main': 'bower_components/jrs-ui/src/mng.main',
    'mng.common.actions': 'bower_components/jrs-ui/src/mng.common.actions',
    'org.role.mng.main': 'bower_components/jrs-ui/src/org.role.mng.main',
    'org.role.mng.actions': 'bower_components/jrs-ui/src/org.role.mng.actions',
    'org.role.mng.components': 'bower_components/jrs-ui/src/org.role.mng.components',
    'org.user.mng.main': 'bower_components/jrs-ui/src/org.user.mng.main',
    'org.user.mng.actions': 'bower_components/jrs-ui/src/org.user.mng.actions',
    'org.user.mng.components': 'bower_components/jrs-ui/src/org.user.mng.components',
    'administer.base': 'bower_components/jrs-ui/src/administer.base',
    'administer.logging': 'bower_components/jrs-ui/src/administer.logging',
    'administer.options': 'bower_components/jrs-ui/src/administer.options',
    'repository.search.components': 'bower_components/jrs-ui/src/repository.search.components',
    'repository.search.actions': 'bower_components/jrs-ui/src/repository.search.actions',
    'repository.search.main': 'bower_components/jrs-ui/src/repository.search.main',
    'controls.report': 'bower_components/jrs-ui/src/controls.report',
    'resource.base': 'bower_components/jrs-ui/src/resource.base',
    'resource.locate': 'bower_components/jrs-ui/src/resource.locate',
    'resource.dataSource': 'bower_components/jrs-ui/src/resource.dataSource',
    'resource.dataSource.jdbc': 'bower_components/jrs-ui/src/resource.dataSource.jdbc',
    'resource.dataSource.jndi': 'bower_components/jrs-ui/src/resource.dataSource.jndi',
    'resource.dataSource.bean': 'bower_components/jrs-ui/src/resource.dataSource.bean',
    'resource.dataSource.aws': 'bower_components/jrs-ui/src/resource.dataSource.aws',
    'resource.dataSource.virtual': 'bower_components/jrs-ui/src/resource.dataSource.virtual',
    'resource.dataType': 'bower_components/jrs-ui/src/resource.dataType',
    'resource.dataType.locate': 'bower_components/jrs-ui/src/resource.dataType.locate',
    'resource.listOfValues.locate': 'bower_components/jrs-ui/src/resource.listOfValues.locate',
    'resource.listofvalues': 'bower_components/jrs-ui/src/resource.listofvalues',
    'resource.inputControl': 'bower_components/jrs-ui/src/resource.inputControl',
    'resource.add.files': 'bower_components/jrs-ui/src/resource.add.files',
    'resource.add.mondrianxmla': 'bower_components/jrs-ui/src/resource.add.mondrianxmla',
    'resource.query': 'bower_components/jrs-ui/src/resource.query',
    'resource.report': 'bower_components/jrs-ui/src/resource.report',
    'resource.reportResourceNaming': 'bower_components/jrs-ui/src/resource.reportResourceNaming',
    'resource.inputControl.locate': 'bower_components/jrs-ui/src/resource.inputControl.locate',
    'resource.query.locate': 'bower_components/jrs-ui/src/resource.query.locate',
    'resource.analysisView': 'bower_components/jrs-ui/src/resource.analysisView',
    'resource.analysisConnection.mondrian.locate': 'bower_components/jrs-ui/src/resource.analysisConnection.mondrian.locate',
    'resource.analysisConnection.xmla.locate': 'bower_components/jrs-ui/src/resource.analysisConnection.xmla.locate',
    'resource.analysisConnection': 'bower_components/jrs-ui/src/resource.analysisConnection',
    'resource.analysisConnection.dataSource.locate': 'bower_components/jrs-ui/src/resource.analysisConnection.dataSource.locate',
    'addinputcontrol.queryextra': 'bower_components/jrs-ui/src/addinputcontrol.queryextra',
    'org.rootObjectModifier': 'bower_components/jrs-ui/src/org.rootObjectModifier',
    'report.schedule': 'bower_components/jrs-ui/src/report.schedule',
    'report.schedule.list': 'bower_components/jrs-ui/src/report.schedule.list',
    'report.schedule.setup': 'bower_components/jrs-ui/src/report.schedule.setup',
    'report.schedule.output': 'bower_components/jrs-ui/src/report.schedule.output',
    'report.schedule.params': 'bower_components/jrs-ui/src/report.schedule.params',
    'report.view.base': 'bower_components/jrs-ui/src/report.view.base',
    'report.view.runtime': 'bower_components/jrs-ui/src/report.view.runtime',
    dataSource: 'bower_components/jrs-ui/src/dataSource/',
    'report.viewer.page': 'bower_components/jrs-ui/src/report.viewer.page',
    'plain.report.viewer.page': 'bower_components/jrs-ui/src/plain.report.viewer.page',
    'report.viewer.main': 'bower_components/jrs-ui/src/report.viewer.main',
    'results.page': 'bower_components/jrs-ui/src/results.page',
    'repository.main': 'bower_components/jrs-ui/src/repository.main',
    'messages/list/messageList.page': 'bower_components/jrs-ui/src/messages/list/messageList.page',
    'messages/list/messageList.main': 'bower_components/jrs-ui/src/messages/list/messageList.main',
    'messages/details/messageDetails.page': 'bower_components/jrs-ui/src/messages/details/messageDetails.page',
    'messages/details/messageDetails.main': 'bower_components/jrs-ui/src/messages/details/messageDetails.main',
    'admin.users.page': 'bower_components/jrs-ui/src/admin.users.page',
    'admin.users.main': 'bower_components/jrs-ui/src/admin.users.main',
    'admin.roles.page': 'bower_components/jrs-ui/src/admin.roles.page',
    'admin.roles.main': 'bower_components/jrs-ui/src/admin.roles.main',
    'admin.logging.main': 'bower_components/jrs-ui/src/admin.logging.main',
    'admin.logging.page': 'bower_components/jrs-ui/src/admin.logging.page',
    'admin.options.page': 'bower_components/jrs-ui/src/admin.options.page',
    'admin.options.main': 'bower_components/jrs-ui/src/admin.options.main',
    'admin.import.page': 'bower_components/jrs-ui/src/admin.import.page',
    'admin.import.main': 'bower_components/jrs-ui/src/admin.import.main',
    'admin.export.page': 'bower_components/jrs-ui/src/admin.export.page',
    'admin.export.main': 'bower_components/jrs-ui/src/admin.export.main',
    'addDataSource.main': 'bower_components/jrs-ui/src/addDataSource.main',
    'addDataSource.page': 'bower_components/jrs-ui/src/addDataSource.page',
    'addDataType.main': 'bower_components/jrs-ui/src/addDataType.main',
    'addDataType.page': 'bower_components/jrs-ui/src/addDataType.page',
    'addFileResource.main': 'bower_components/jrs-ui/src/addFileResource.main',
    'addFileResource.page': 'bower_components/jrs-ui/src/addFileResource.page',
    'addInputControl.main': 'bower_components/jrs-ui/src/addInputControl.main',
    'addInputControl.page': 'bower_components/jrs-ui/src/addInputControl.page',
    'addInputControlQueryInformation.main': 'bower_components/jrs-ui/src/addInputControlQueryInformation.main',
    'addInputControlQueryInformation.page': 'bower_components/jrs-ui/src/addInputControlQueryInformation.page',
    'addJasperReport.main': 'bower_components/jrs-ui/src/addJasperReport.main',
    'addJasperReport.page': 'bower_components/jrs-ui/src/addJasperReport.page',
    'addJasperReportLocateControl.main': 'bower_components/jrs-ui/src/addJasperReportLocateControl.main',
    'addJasperReportLocateControl.page': 'bower_components/jrs-ui/src/addJasperReportLocateControl.page',
    'addJasperReportResourceNaming.main': 'bower_components/jrs-ui/src/addJasperReportResourceNaming.main',
    'addJasperReportResourceNaming.page': 'bower_components/jrs-ui/src/addJasperReportResourceNaming.page',
    'addJasperReportResourcesAndControls.main': 'bower_components/jrs-ui/src/addJasperReportResourcesAndControls.main',
    'addJasperReportResourcesAndControls.page': 'bower_components/jrs-ui/src/addJasperReportResourcesAndControls.page',
    'addListOfValues.main': 'bower_components/jrs-ui/src/addListOfValues.main',
    'addListOfValues.page': 'bower_components/jrs-ui/src/addListOfValues.page',
    'addMondrianXML.main': 'bower_components/jrs-ui/src/addMondrianXML.main',
    'addMondrianXML.page': 'bower_components/jrs-ui/src/addMondrianXML.page',
    'addOLAPView.main': 'bower_components/jrs-ui/src/addOLAPView.main',
    'addOLAPView.page': 'bower_components/jrs-ui/src/addOLAPView.page',
    'addQuery.main': 'bower_components/jrs-ui/src/addQuery.main',
    'addQuery.page': 'bower_components/jrs-ui/src/addQuery.page',
    'addQueryWithResourceLocator.main': 'bower_components/jrs-ui/src/addQueryWithResourceLocator.main',
    'addQueryWithResourceLocator.page': 'bower_components/jrs-ui/src/addQueryWithResourceLocator.page',
    'listOfValuesLocate.main': 'bower_components/jrs-ui/src/listOfValuesLocate.main',
    'listOfValuesLocate.page': 'bower_components/jrs-ui/src/listOfValuesLocate.page',
    'locateDataSource.main': 'bower_components/jrs-ui/src/locateDataSource.main',
    'locateDataSource.page': 'bower_components/jrs-ui/src/locateDataSource.page',
    'locateMondrianConnectionSource.main': 'bower_components/jrs-ui/src/locateMondrianConnectionSource.main',
    'locateMondrianConnectionSource.page': 'bower_components/jrs-ui/src/locateMondrianConnectionSource.page',
    'locateQuery.main': 'bower_components/jrs-ui/src/locateQuery.main',
    'locateQuery.page': 'bower_components/jrs-ui/src/locateQuery.page',
    'locateXmlConnectionSource.main': 'bower_components/jrs-ui/src/locateXmlConnectionSource.main',
    'locateXmlConnectionSource.page': 'bower_components/jrs-ui/src/locateXmlConnectionSource.page',
    'olap.view.main': 'bower_components/jrs-ui/src/olap.view.main',
    'olap.view.page': 'bower_components/jrs-ui/src/olap.view.page',
    'encrypt.page': 'bower_components/jrs-ui/src/encrypt.page',
    'connectionType.main': 'bower_components/jrs-ui/src/connectionType.main',
    'connectionType.page': 'bower_components/jrs-ui/src/connectionType.page',
    'dataTypeLocate.main': 'bower_components/jrs-ui/src/dataTypeLocate.main',
    'dataTypeLocate.page': 'bower_components/jrs-ui/src/dataTypeLocate.page',
    'xdm.remote.page': 'bower_components/jrs-ui/src/xdm.remote.page',
    'type.LocalAnchor': 'bower_components/bi-dashboard/src/dashboard/hyperlink/handler/type.LocalAnchor',
    'type.LocalPage': 'bower_components/bi-dashboard/src/dashboard/hyperlink/handler/type.LocalPage',
    'type.Reference': 'bower_components/bi-dashboard/src/dashboard/hyperlink/handler/type.Reference',
    'type.RemoteAnchor': 'bower_components/bi-dashboard/src/dashboard/hyperlink/handler/type.RemoteAnchor',
    'type.RemotePage': 'bower_components/bi-dashboard/src/dashboard/hyperlink/handler/type.RemotePage',
    'type.ReportExecution': 'bower_components/bi-dashboard/src/dashboard/hyperlink/handler/type.ReportExecution'
  },
  shim: {
    'backbone.original': {
      deps: ['underscore','json3'],
      exports: 'Backbone',
      init: null
    },
    base64: {
      exports: 'Base64',
      init: function () {
                return this.Base64.noConflict();
            }
    },
    json3: {
      exports: 'JSON'
    },
    'jquery.selection': {
      deps: ['jquery'],
      exports: 'jQuery'
    },
    'jquery.doubletap': {
      deps: ['jquery'],
      exports: 'jQuery'
    },
    'jquery.urldecoder': {
      deps: ['jquery'],
      exports: 'jQuery'
    },
    xregexp: {
      exports: 'XRegExp'
    },
    'jquery.jcryption': {
      deps: ['jquery'],
      exports: 'jQuery'
    },
    'datepicker.i18n.en': {
      deps: ['jquery.ui'],
      exports: 'jQuery'
    },
    'datepicker.i18n.de': {
      deps: ['jquery.ui'],
      exports: 'jQuery'
    },
    'datepicker.i18n.es': {
      deps: ['jquery.ui'],
      exports: 'jQuery'
    },
    'datepicker.i18n.fr': {
      deps: ['jquery.ui'],
      exports: 'jQuery'
    },
    'datepicker.i18n.it': {
      deps: ['jquery.ui'],
      exports: 'jQuery'
    },
    'datepicker.i18n.ja': {
      deps: ['jquery.ui'],
      exports: 'jQuery'
    },
    'datepicker.i18n.ro': {
      deps: ['jquery.ui'],
      exports: 'jQuery'
    },
    'datepicker.i18n.zh-CN': {
      deps: ['jquery.ui'],
      exports: 'jQuery'
    },
    'datepicker.i18n.zh-TW': {
      deps: ['jquery.ui'],
      exports: 'jQuery'
    },
    'jquery.timepicker.addon': {
      deps: ['jquery','common/jquery/extension/datepickerExt'],
      exports: 'jQuery'
    },
    highcharts: {
      deps: ['jquery'],
      exports: 'Highcharts'
    },
    'grouped-categories': {
      deps: ['highcharts'],
      exports: 'Highcharts'
    },
    'highcharts-more': {
      deps: ['highcharts'],
      exports: 'Highcharts'
    },
    heatmap: {
      deps: ['highcharts'],
      exports: 'Highcharts'
    },
    mustache: {
      exports: 'Mustache'
    },
    jasper: {
      exports: 'jasper'
    },
    visualize: {
      deps: ['jasper','bi/viz/BiComponentFactory','common/auth/Authentication','bi/report/jive/jr/jive.all.deps'],
      exports: 'visualize'
    },
    prototype: {
      exports: '__dollar_sign__'
    },
    json2: {
      exports: 'JSON'
    },
    builder: {
      deps: ['prototype'],
      exports: 'Builder'
    },
    effects: {
      deps: ['prototype'],
      exports: 'Effect'
    },
    dragdrop: {
      deps: ['prototype','effects'],
      exports: 'Draggable'
    },
    'dragdrop.extra': {
      deps: ['dragdrop','jquery'],
      exports: 'Draggable'
    },
    iscroll: {
      exports: 'iScroll'
    },
    'wcf.scroll': {
      exports: 'document'
    },
    'csrf.guard': {
      deps: ['core.ajax'],
      exports: 'window'
    },
    ReportRequireJsConfig: {
      exports: 'window'
    },
    'fakeActionModel.primaryNavigation': {
      exports: 'primaryNavModule'
    },
    namespace: {
      deps: ['common/jquery/extension/timepickerExt'],
      exports: 'jaspersoft'
    },
    touchcontroller: {
      deps: ['jquery'],
      exports: 'TouchController'
    },
    'jpivot.jaPro': {
      deps: ['prototype','utils.common'],
      exports: 'bWidth'
    },
    'utils.common': {
      deps: ['prototype','jquery','underscore'],
      exports: 'jQuery'
    },
    'utils.animation': {
      deps: ['prototype','effects'],
      exports: 'jQuery'
    },
    'tools.truncator': {
      deps: ['prototype'],
      exports: 'jQuery'
    },
    'tools.drag': {
      deps: ['jquery','prototype'],
      exports: 'Dragger'
    },
    'actionModel.modelGenerator': {
      deps: ['prototype','utils.common','core.events.bis'],
      exports: 'actionModel'
    },
    'actionModel.primaryNavigation': {
      deps: ['actionModel.modelGenerator'],
      exports: 'primaryNavModule'
    },
    'core.layout': {
      deps: ['jquery','prototype','utils.common','dragdrop.extra','tools.truncator','iscroll','components.webHelp'],
      exports: 'layoutModule'
    },
    'home.simple': {
      deps: ['prototype','components.webHelp'],
      exports: 'home'
    },
    'ajax.mock': {
      deps: ['jquery'],
      exports: 'fakeResponce'
    },
    'core.ajax': {
      deps: ['jquery','prototype','utils.common','builder','namespace'],
      exports: 'ajax'
    },
    'core.accessibility': {
      deps: ['prototype','components.list','actionModel.modelGenerator','core.events.bis'],
      exports: 'accessibilityModule'
    },
    'core.events.bis': {
      deps: ['jquery','prototype','utils.common','core.layout','components.tooltip'],
      exports: 'buttonManager'
    },
    'core.key.events': {
      deps: ['jquery','prototype','utils.common','core.layout'],
      exports: 'keyManager'
    },
    'error.system': {
      deps: ['jquery','core.layout','utils.common'],
      exports: 'systemError'
    },
    'components.templateengine': {
      deps: ['namespace','jquery','underscore','mustache'],
      exports: 'jaspersoft.components.templateEngine'
    },
    'components.ajaxdownloader': {
      deps: ['namespace','jquery','underscore','backbone'],
      exports: 'jaspersoft.components.AjaxDownloader'
    },
    'components.ajaxuploader': {
      deps: ['namespace','jquery','underscore','components.templateengine'],
      exports: 'jaspersoft.components.AjaxUploader'
    },
    'components.authoritymodel': {
      deps: ['namespace','jquery','underscore','backbone','components.templateengine'],
      exports: 'jaspersoft.components.AuthorityModel'
    },
    'components.authoritypickerview': {
      deps: ['namespace','jquery','underscore','backbone','components.templateengine'],
      exports: 'jaspersoft.components.AuthorityPickerView'
    },
    'components.dialogs': {
      deps: ['jquery','prototype','underscore','utils.common','utils.animation','core.layout'],
      exports: 'dialogs'
    },
    'components.dialog': {
      deps: ['jquery','underscore','components.templateengine','components.dialogs','backbone'],
      exports: 'jaspersoft.components.Dialog'
    },
    'components.dependent.dialog': {
      deps: ['prototype','components.dialogs','jquery','components.list'],
      exports: 'dialogs.dependentResources'
    },
    'components.list': {
      deps: ['jquery','prototype','components.layout','touchcontroller','utils.common','dragdrop.extra','core.events.bis'],
      exports: 'dynamicList'
    },
    'components.layout': {
      deps: ['jquery','underscore','components.dialog','components.systemnotificationview'],
      exports: 'jaspersoft.components.Layout'
    },
    'components.searchBox': {
      deps: ['prototype','utils.common','core.events.bis'],
      exports: 'SearchBox'
    },
    'components.servererrorsbackbonetrait': {
      deps: ['namespace','jquery','underscore'],
      exports: 'jaspersoft.components.ServerErrorsBackboneTrait'
    },
    'components.notificationviewtrait': {
      deps: ['namespace','jquery','underscore','backbone'],
      exports: 'jaspersoft.components.NotificationViewTrait'
    },
    'components.statecontrollertrait': {
      deps: ['namespace','jquery','underscore','backbone','components.state'],
      exports: 'jaspersoft.components.StateControllerTrait'
    },
    'components.state': {
      deps: ['namespace','jquery','underscore','backbone','components.servererrorsbackbonetrait'],
      exports: 'jaspersoft.components.State'
    },
    'components.stateview': {
      deps: ['namespace','jquery','underscore','components.utils','components.state'],
      exports: 'jaspersoft.components.StateView'
    },
    'components.notificationview': {
      deps: ['namespace','jquery','underscore','components.notificationviewtrait'],
      exports: 'jaspersoft.components.NotificationView'
    },
    'components.systemnotificationview': {
      deps: ['namespace','jquery','underscore','components.dialogs','components.notificationviewtrait'],
      exports: 'jaspersoft.components.SystemNotificationView'
    },
    'components.toolbarButtons': {
      deps: ['jquery','prototype'],
      exports: 'toolbarButtonModule'
    },
    'messages/list/messageList': {
      deps: ['prototype','components.list','components.toolbar','core.layout'],
      exports: 'messageListModule'
    },
    'messages/details/messageDetails': {
      deps: ['prototype','components.toolbar','core.layout'],
      exports: 'messageDetailModule'
    },
    'components.toolbar': {
      deps: ['jquery','prototype','utils.common','components.toolbarButtons'],
      exports: 'toolbarButtonModule'
    },
    'components.tooltip': {
      deps: ['jquery','prototype','utils.common','core.layout'],
      exports: 'JSTooltip'
    },
    'components.dynamicTree': {
      deps: ['prototype','dynamicTree.tree','dynamicTree.treenode','dynamicTree.events','core.ajax'],
      exports: 'dynamicTree'
    },
    'components.utils': {
      deps: ['jquery','underscore','mustache','components.dialogs','core.ajax'],
      exports: 'jaspersoft.components.utils'
    },
    heartbeat: {
      deps: ['jquery'],
      exports: 'checkHeartBeat'
    },
    'components.heartbeat': {
      deps: ['prototype','core.ajax'],
      exports: 'heartbeat'
    },
    'components.customTooltip': {
      deps: [],
      exports: 'customTooltip'
    },
    'components.pickers': {
      deps: ['utils.common','components.dialogs','core.layout','core.events.bis','prototype','jquery','dynamicTree.utils'],
      exports: 'picker'
    },
    'controls.core': {
      deps: ['jquery','underscore','mustache','components.dialogs','namespace','controls.logging'],
      exports: 'JRS.Controls'
    },
    localContext: {
      exports: 'window'
    },
    'controls.dataconverter': {
      deps: ['underscore','controls.core'],
      exports: 'JRS.Controls'
    },
    'controls.datatransfer': {
      deps: ['json3','jquery','controls.core','backbone','controls.dataconverter'],
      exports: 'JRS.Controls'
    },
    'controls.basecontrol': {
      deps: ['jquery','underscore','controls.core'],
      exports: 'JRS.Controls'
    },
    'controls.base': {
      deps: ['jquery','underscore','utils.common'],
      exports: 'ControlsBase'
    },
    'repository.search.globalSearchBoxInit': {
      deps: ['prototype','actionModel.primaryNavigation','components.searchBox'],
      exports: 'globalSearchBox'
    },
    'attributes.model': {
      deps: ['namespace','underscore','backbone','components.templateengine','controls.core'],
      exports: 'jaspersoft.attributes'
    },
    'attributes.view': {
      deps: ['jquery','underscore','backbone','attributes.model','components.templateengine'],
      exports: 'jaspersoft.attributes'
    },
    'export': {
      deps: ['namespace'],
      exports: 'JRS.Export'
    },
    'export.statecontroller': {
      deps: ['jquery','underscore','backbone','components.statecontrollertrait','components.ajaxdownloader'],
      exports: 'JRS.Export.StateController'
    },
    'export.servererrortrait': {
      deps: ['underscore','components.servererrorsbackbonetrait'],
      exports: 'JRS.Export.ServerErrorTrait'
    },
    'export.formmodel': {
      deps: ['jquery','underscore','backbone','export.servererrortrait','components.state'],
      exports: 'JRS.Export.FormModel'
    },
    'export.extendedformview': {
      deps: ['jquery','underscore','backbone','components.templateengine','components.authoritymodel','components.authoritypickerview','components.state'],
      exports: 'JRS.Export.ExtendedFormView'
    },
    'export.shortformview': {
      deps: ['jquery','underscore','backbone','components.templateengine','components.state'],
      exports: 'JRS.Export.ShortFormView'
    },
    'export.app': {
      deps: ['jquery','underscore','export.formmodel','components.layout','export.statecontroller','components.state'],
      exports: 'JRS.Export.App'
    },
    'import': {
      deps: ['namespace'],
      exports: 'JRS.Import'
    },
    'import.formmodel': {
      deps: ['jquery','underscore','import','backbone','components.servererrorsbackbonetrait','components.state'],
      exports: 'JRS.Import.FormModel'
    },
    'import.extendedformview': {
      deps: ['jquery','underscore','import','backbone','components.templateengine','components.state','components.ajaxuploader','components.stateview'],
      exports: 'JRS.Import.ExtendedFormView'
    },
    'import.app': {
      deps: ['jquery','underscore','import.formmodel','components.layout','components.state'],
      exports: 'JRS.Import.App'
    },
    'report.view.base': {
      deps: ['jquery','underscore','controls.basecontrol','controls.base','core.ajax'],
      exports: 'Report'
    },
    'controls.components': {
      deps: ['jquery','underscore','controls.basecontrol','common/jquery/extension/datepickerExt','common/jquery/extension/timepickerExt','common/component/singleSelect/view/SingleSelect','common/component/multiSelect/view/MultiSelect','common/component/singleSelect/dataprovider/CacheableDataProvider','common/util/parse/date'],
      exports: 'JRS.Controls'
    },
    'controls.viewmodel': {
      deps: ['jquery','underscore','controls.core','controls.basecontrol'],
      exports: 'JRS.Controls'
    },
    'controls.logging': {
      deps: ['namespace'],
      exports: 'JRS'
    },
    'controls.controller': {
      deps: ['jquery','underscore','controls.core','controls.datatransfer','controls.viewmodel','controls.components','report.view.base','jquery.urldecoder'],
      exports: 'JRS.Controls'
    },
    'components.about': {
      deps: ['components.dialogs'],
      exports: 'about'
    },
    'dynamicTree.tree': {
      deps: ['prototype','dragdrop.extra','touchcontroller','utils.common','core.layout','json3'],
      exports: 'dynamicTree'
    },
    'dynamicTree.treenode': {
      deps: ['prototype','dynamicTree.tree'],
      exports: 'dynamicTree'
    },
    'dynamicTree.events': {
      deps: ['prototype','dynamicTree.tree'],
      exports: 'dynamicTree'
    },
    'dynamicTree.utils': {
      deps: ['components.dynamicTree','touchcontroller','dynamicTree.treenode'],
      exports: 'dynamicTree'
    },
    'components.webHelp': {
      deps: ['jrs.configs'],
      exports: 'webHelpModule'
    },
    'components.loginBox': {
      deps: ['prototype','components.webHelp','components.dialogs','components.utils','core.layout'],
      exports: 'loginBox'
    },
    'components.tabs': {
      deps: ['prototype'],
      exports: 'tabModule'
    },
    'login.form': {
      deps: ['jquery','components.loginBox','jrs.configs','common/util/encrypter'],
      exports: 'jQuery'
    },
    'tools.infiniteScroll': {
      deps: ['jquery','prototype','utils.common'],
      exports: 'InfiniteScroll'
    },
    'mng.common': {
      deps: ['jquery','prototype','utils.common','tools.infiniteScroll','components.list','components.dynamicTree','components.toolbar'],
      exports: 'orgModule'
    },
    'mng.main': {
      deps: ['jquery','mng.common'],
      exports: 'orgModule'
    },
    'mng.common.actions': {
      deps: ['jquery','prototype','mng.common'],
      exports: 'orgModule'
    },
    'org.role.mng.main': {
      deps: ['jquery','mng.main','components.webHelp'],
      exports: 'orgModule'
    },
    'org.role.mng.actions': {
      deps: ['org.role.mng.main'],
      exports: 'orgModule'
    },
    'org.role.mng.components': {
      deps: ['jquery','org.role.mng.main'],
      exports: 'orgModule'
    },
    'org.user.mng.main': {
      deps: ['jquery','mng.main'],
      exports: 'orgModule'
    },
    'org.user.mng.actions': {
      deps: ['jquery','org.role.mng.main','org.user.mng.main','mng.common.actions'],
      exports: 'orgModule'
    },
    'org.user.mng.components': {
      deps: ['jquery','org.user.mng.main','mng.common.actions','common/util/encrypter'],
      exports: 'orgModule'
    },
    'administer.base': {
      deps: ['prototype','underscore','core.ajax'],
      exports: 'Administer'
    },
    'administer.logging': {
      deps: ['administer.base','core.layout','components.webHelp','utils.common'],
      exports: 'logging'
    },
    'administer.options': {
      deps: ['administer.base','core.layout','components.webHelp','utils.common'],
      exports: 'Options'
    },
    'repository.search.components': {
      deps: ['repository.search.main','prototype','utils.common','dynamicTree.utils'],
      exports: 'GenerateResource'
    },
    'component.repository.search': {
      deps: ['prototype','core.ajax','actionModel.modelGenerator','utils.common','repository.search.actions','core.ajax'],
      exports: 'repositorySearch'
    },
    'repository.search.actions': {
      deps: ['repository.search.main','repository.search.components','prototype','actionModel.modelGenerator','utils.common','core.ajax'],
      exports: 'repositorySearch'
    },
    'repository.search.main': {
      deps: ['prototype','actionModel.modelGenerator','utils.common','report.execution.count'],
      exports: 'repositorySearch'
    },
    'report.global': {
      exports: 'jasperreports'
    },
    'report.view': {
      deps: ['report.view.runtime'],
      exports: 'Report'
    },
    'controls.report': {
      deps: ['controls.controller','report.view.base','controls.options'],
      exports: 'Controls'
    },
    'resource.base': {
      deps: ['prototype','utils.common','core.layout'],
      exports: 'resource'
    },
    'resource.locate': {
      deps: ['resource.base','jquery','components.pickers'],
      exports: 'resourceLocator'
    },
    'resource.dataSource': {
      deps: ['jquery','underscore','backbone','core.ajax','components.dialogs','utils.common','resource.locate'],
      exports: 'window.ResourceDataSource'
    },
    'resource.dataSource.jdbc': {
      deps: ['resource.dataSource','mustache','components.dialog','core.events.bis','xregexp'],
      exports: 'window.JdbcDataSourceEditor'
    },
    'resource.dataSource.jndi': {
      deps: ['resource.dataSource','mustache','components.dialog','core.events.bis','xregexp'],
      exports: 'window.JndiResourceDataSource'
    },
    'resource.dataSource.bean': {
      deps: ['resource.dataSource','mustache','components.dialog','core.events.bis','xregexp'],
      exports: 'window.BeanResourceDataSource'
    },
    'resource.dataSource.aws': {
      deps: ['resource.dataSource.jdbc'],
      exports: 'window.AwsResourceDataSource'
    },
    'resource.dataSource.virtual': {
      deps: ['resource.dataSource','mustache','components.dialog','core.events.bis','xregexp','components.dependent.dialog'],
      exports: 'window.VirtualResourceDataSource'
    },
    'resource.dataType': {
      deps: ['resource.base','prototype','utils.common'],
      exports: 'resourceDataType'
    },
    'resource.dataType.locate': {
      deps: ['resource.locate'],
      exports: 'resourceDataTypeLocate'
    },
    'resource.listOfValues.locate': {
      deps: ['resource.locate'],
      exports: 'resourceListOfValuesLocate'
    },
    'resource.listofvalues': {
      deps: ['resource.base','utils.common'],
      exports: 'resourceListOfValues'
    },
    'resource.inputControl': {
      deps: ['resource.base','prototype','utils.common'],
      exports: 'addInputControl'
    },
    'resource.add.files': {
      deps: ['resource.locate','prototype','utils.common','core.events.bis'],
      exports: 'addFileResource'
    },
    'resource.add.mondrianxmla': {
      deps: ['resource.base','components.pickers','prototype','utils.common'],
      exports: 'resourceMondrianXmla'
    },
    'resource.query': {
      deps: ['resource.base','prototype','utils.common'],
      exports: 'resourceQuery'
    },
    'resource.report': {
      deps: ['resource.locate','prototype','jquery','utils.common'],
      exports: 'resourceReport'
    },
    'resource.reportResourceNaming': {
      deps: ['resource.base','components.pickers','prototype','utils.common'],
      exports: 'resourceReportResourceNaming'
    },
    'resource.inputControl.locate': {
      deps: ['resource.locate','core.events.bis','prototype'],
      exports: 'inputControl'
    },
    'resource.query.locate': {
      deps: ['resource.locate','prototype'],
      exports: 'resourceQueryLocate'
    },
    'resource.analysisView': {
      deps: ['resource.base','utils.common','prototype'],
      exports: 'resourceAnalysisView'
    },
    'resource.analysisConnection.mondrian.locate': {
      deps: ['resource.locate','prototype'],
      exports: 'resourceMondrianLocate'
    },
    'resource.analysisConnection.xmla.locate': {
      deps: ['resource.locate','prototype'],
      exports: 'resourceOLAPLocate'
    },
    'resource.analysisConnection': {
      deps: ['resource.base','prototype','components.pickers','utils.common'],
      exports: 'resourceAnalysisConnection'
    },
    'resource.analysisConnection.dataSource.locate': {
      deps: ['resource.locate'],
      exports: 'resourceDataSourceLocate'
    },
    'addinputcontrol.queryextra': {
      deps: ['prototype','utils.common','core.events.bis','core.layout'],
      exports: 'addListOfValues'
    },
    'org.rootObjectModifier': {
      deps: [],
      exports: 'rom_init'
    },
    'report.schedule': {
      deps: ['prototype'],
      exports: 'Schedule'
    },
    'report.schedule.list': {
      deps: ['prototype'],
      exports: 'ScheduleList'
    },
    'report.schedule.setup': {
      deps: ['prototype'],
      exports: 'ScheduleSetup'
    },
    'report.schedule.output': {
      deps: ['prototype'],
      exports: 'ScheduleOutput'
    },
    'report.schedule.params': {
      deps: ['prototype','controls.controller','json3'],
      exports: 'ScheduleParams'
    },
    dateFormatter: {
      exports: 'window'
    },
    'dragdrop.extra.v0.5': {
      deps: ['dragdrop.extra'],
      exports: 'Draggable'
    },
    'ireport.highcharts.default.service': {
      deps: ['highcharts-more'],
      exports: 'JRDefaultHighchartsSettingService'
    },
    'controls.dashboard': {
      deps: ['jquery','underscore','controls.controller'],
      exports: 'JRS.Controls'
    },
    'controls.options': {
      deps: ['namespace','jquery','underscore','controls.core','controls.basecontrol','controls.base'],
      exports: 'JRS.Controls'
    },
    'org.mng.main': {
      deps: ['jquery','mng.main'],
      exports: 'orgModule'
    },
    'org.mng.actions': {
      deps: ['jquery','org.mng.main','mng.common.actions'],
      exports: 'orgModule'
    },
    'org.mng.components': {
      deps: ['jquery','org.mng.main','mng.common.actions'],
      exports: 'orgModule'
    },
    'administer.cache': {
      deps: ['administer.base','core.layout','components.webHelp','utils.common','jquery','components.dialogs','core.events.bis'],
      exports: 'DataSetList'
    },
    'report/option/controls.editoptions': {
      deps: ['jquery','underscore','controls.controller'],
      exports: 'JRS.EditOptions'
    },
    'dialog.definitions': {
      deps: ['namespace','jquery','dynamicTree.utils'],
      exports: 'JRS.RepositorySelectionDialog'
    },
    'create.report': {
      deps: ['namespace','jrs.configs','jquery','dialog.definitions'],
      exports: 'JRS.CreateReport'
    },
    'designer.base': {
      deps: ['jquery','core.ajax','underscore','prototype','utils.common','actionModel.modelGenerator','report.execution.count'],
      exports: 'designerBase'
    },
    'dashboard.designer': {
      deps: ['designer.base','controls.dashboard','components.toolbar','dialog.definitions'],
      exports: 'localContext'
    },
    'dashboard.runtime': {
      deps: ['designer.base','controls.dashboard.runtime','dateFormatter'],
      exports: 'localContext'
    },
    'controls.dashboard.runtime': {
      deps: ['controls.controller','jquery','underscore'],
      exports: 'JRS.Controls'
    },
    'report.execution.count': {
      deps: ['namespace','jquery','components.dialogs'],
      exports: 'JRS.reportExecutionCounter'
    },
    'report.view.runtime': {
      deps: ['report.view.base','report.execution.count'],
      exports: 'Report'
    },
    'domain.base': {
      deps: ['jquery','underscore','backbone','utils.common'],
      exports: 'domain'
    },
    'domain.components': {
      deps: ['domain.base','dynamicTree.utils','components.list'],
      exports: 'domain'
    },
    'domain.filters': {
      deps: ['domain.components'],
      exports: 'domain.filter'
    },
    'domain.chooser': {
      deps: ['domain.base'],
      exports: 'domain'
    },
    'domain.chooser.fields': {
      deps: ['domain.chooser','domain.components'],
      exports: 'domain'
    },
    'domain.chooser.saveAsTopic': {
      deps: ['domain.chooser','domain.components'],
      exports: 'domain'
    },
    'domain.chooser.filters': {
      deps: ['domain.chooser','domain.filters'],
      exports: 'domain'
    },
    'domain.chooser.display': {
      deps: ['domain.chooser','domain.components'],
      exports: 'domain'
    },
    'domain.setup': {
      deps: ['domain.components','resource.base','components.pickers','domain/domainUtil'],
      exports: 'domain.wizard'
    },
    'domain.setup.dialogs': {
      deps: ['domain.setup'],
      exports: 'SelectFileDialog'
    },
    'domain.designer': {
      deps: ['domain.components','components.toolbar','domain/domainUtil'],
      exports: 'dd'
    },
    'domain.designer.validators': {
      deps: ['domain.designer'],
      exports: 'dd'
    },
    'domain.designer.tables': {
      deps: ['domain.designer.validators','dragdrop.extra'],
      exports: 'dd_tables'
    },
    'domain.designer.tables.dialogs': {
      deps: ['domain.designer.tables'],
      exports: 'dd_tables'
    },
    'domain.designer.tables.validators': {
      deps: ['domain.designer.tables.dialogs'],
      exports: 'dd_tables'
    },
    'domain.designer.derivedTables': {
      deps: ['domain.designer.validators'],
      exports: 'dd_derivedTables'
    },
    'domain.designer.joins': {
      deps: ['domain.designer.validators'],
      exports: 'dd_joins'
    },
    'domain.designer.joins.validators': {
      deps: ['domain.designer.joins'],
      exports: 'dd_joins'
    },
    'domain.designer.calculatedFields': {
      deps: ['domain.designer.validators'],
      exports: 'dd_calcFields'
    },
    'domain.designer.filters': {
      deps: ['domain.filters','domain.designer.validators'],
      exports: 'dd_filters'
    },
    'domain.designer.display': {
      deps: ['domain.designer.validators'],
      exports: 'dd_display'
    },
    'domain.designer.display.validators': {
      deps: ['domain.designer.display'],
      exports: 'dd_display'
    },
    'adhoc.start': {
      deps: ['prototype','components.dialogs','components.dynamicTree','dynamicTree.utils'],
      exports: 'adhocStart'
    },
    fusioncharts: {
      exports: 'FusionCharts'
    },
    'adhoc/table': {
      deps: ['jquery','jquery.ui','underscore','prototype','designer.base','utils.common'],
      exports: 'AdHocTable'
    },
    'adhoc/table.actions': {
      deps: ['adhoc/table'],
      exports: 'AdHocTable'
    },
    'adhoc/table.dnd': {
      deps: ['adhoc/table'],
      exports: 'AdHocTable'
    },
    'adhoc/table.helpers': {
      deps: ['adhoc/table'],
      exports: 'AdHocTable'
    },
    'adhoc/table.observers': {
      deps: ['adhoc/table'],
      exports: 'AdHocTable'
    },
    'adhoc/table.ajax': {
      deps: ['adhoc/table.observers'],
      exports: 'AdHocTable'
    },
    'adhoc/table.init': {
      deps: ['adhoc/table','adhoc/table.ajax','adhoc/table.actions','adhoc/table.helpers','adhoc/table.observers','adhoc/table.dnd'],
      exports: 'AdHocTable'
    },
    'adhoc/crosstab': {
      deps: ['jquery','underscore','prototype','designer.base','utils.common','tools.truncator'],
      exports: 'AdHocCrosstab'
    },
    'adhoc/crosstab.actions': {
      deps: ['adhoc/crosstab'],
      exports: 'AdHocCrosstab'
    },
    'adhoc/crosstab.ajax': {
      deps: ['adhoc/crosstab'],
      exports: 'AdHocCrosstab'
    },
    'adhoc/crosstab.helpers': {
      deps: ['adhoc/crosstab'],
      exports: 'AdHocCrosstab'
    },
    'adhoc/crosstab.observers': {
      deps: ['adhoc/crosstab'],
      exports: 'AdHocCrosstab'
    },
    'adhoc/crosstab.tests': {
      deps: ['adhoc/crosstab','adhoc/crosstab.actions','adhoc/crosstab.ajax','adhoc/crosstab.helpers','adhoc/crosstab.observers'],
      exports: 'AdHocCrosstab'
    },
    'adhoc/chart.init': {
      deps: ['designer.base'],
      exports: 'AdHocChart'
    },
    'adhoc/chart.helpers': {
      deps: ['adhoc/chart.init'],
      exports: 'AdHocChart'
    },
    'adhoc/chart.ajax': {
      deps: ['underscore','adhoc/chart.init'],
      exports: 'AdHocChart'
    },
    'adhoc/chart.actions': {
      deps: ['adhoc/chart.init'],
      exports: 'AdHocChart'
    },
    'adhoc/chart.observers': {
      deps: ['adhoc/chart.init','adhoc/chart.helpers','adhoc/chart.ajax','adhoc/chart.actions'],
      exports: 'AdHocChart'
    },
    'adhoc/designer.calculatedFields': {
      deps: ['adhoc/calculatedFields/CalculatedFieldsService'],
      exports: 'adhocCalculatedFields'
    },
    'adhoc/designer.sort': {
      deps: ['prototype','utils.common'],
      exports: 'adhocSort'
    },
    'adhoc/designer.reentrant': {
      deps: ['domain.components'],
      exports: 'adhocReentrance'
    },
    'adhoc/layout.manager': {
      deps: ['jquery','underscore','prototype'],
      exports: 'LayoutManager'
    },
    'controls.adhoc': {
      deps: ['controls.controller','report.view.base'],
      exports: 'adhocControls'
    },
    'adhoc/crosstab.multiselect': {
      deps: [],
      exports: 'crossTabMultiSelect'
    }
  },
  waitSeconds: 60,
  map: {
    '*': {
      'adhoc/highcharts.api': 'adhoc/chart/adhocToHighchartsAdapter',
      'jquery.timepicker': 'common/jquery/extension/timepickerExt'
    },
    'scheduler/view/editor/parameters': {
      'controls.options': 'controls.options'
    }
  }
}
);