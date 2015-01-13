/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased  a commercial license agreement from Jaspersoft,
 * the following license terms  apply:
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License  as
 * published by the Free Software Foundation, either version 3 of  the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero  General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public  License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: require.config.js 2676 2014-09-19 11:35:52Z dgorbenko $
 */

// temporary requirejs config taken for JR
requirejs.config({
    paths: {
        "async": "bower_components/async",
        "text": "bower_components/js-sdk/src/common/plugin/text",
        "jasperreports-loader": "bi/report/jasperreports-loader",

        // JIVE i18n
        "jive.i18n": "../reportresource/reportresource?resource=jive.i18n",
        
        // JIVE CSS
        "jive.vm": "../reportresource/reportresource?resource=jive.vm",
        "jive.sort.vm": "../reportresource/reportresource?resource=jive.sort.vm",
        "jive.crosstab.templates.styles": "../reportresource/reportresource?resource=jive.crosstab.templates.styles",
        "jive.highcharts.vm": "../reportresource/reportresource?resource=jive.highcharts.vm",

        // JIVE templates
        "jive.templates": "../reportresource/reportresource?resource=jive.templates",
        "jive.crosstab.templates": "../reportresource/reportresource?resource=net/sf/jasperreports/crosstabs/interactive/jive.crosstab.templates",
        "jive.chartSelector": "../reportresource/reportresource?resource=jive.chartSelector",
        "jive.filterDialog": "../reportresource/reportresource?resource=jive.filterDialog",

        // JR and JIVE JavaScript files
        "jive.table": "bi/report/jive/jr/jive.table",
        "jive": "bi/report/jive/jr/jive",
        "jive.column": "bi/report/jive/jr/jive.column",
        "jasperreports-component-registrar": "bi/report/jive/jr/jasperreports-component-registrar",
        "jasperreports-status-checker": "bi/report/jive/jr/jasperreports-status-checker",
        "jive.crosstab.interactive": "bi/report/jive/jr/jive.crosstab.interactive",
        "jasperreports-viewer": "bi/report/jive/jr/jasperreports-viewer",
        "jasperreports-report-processor": "bi/report/jive/jr/jasperreports-report-processor",
        "jasperreports-utils": "bi/report/jive/jr/jasperreports-utils",
        "jasperreports-map": "bi/report/jive/jr/jasperreports-map",
        "jive.sort": "bi/report/jive/jr/jive.sort",
        "jive.crosstab": "bi/report/jive/jr/jive.crosstab",
        "jive.interactive.column": "bi/report/jive/jr/jive.interactive.column",
        "jasperreports-event-manager": "bi/report/jive/jr/jasperreports-event-manager",
        "jasperreports-ajax": "bi/report/jive/jr/jasperreports-ajax",
        "jasperreports-url-manager": "bi/report/jive/jr/jasperreports-url-manager",
        "jasperreports-report": "bi/report/jive/jr/jasperreports-report",
        "jive.interactive.sort": "bi/report/jive/jr/jive.interactive.sort",
        "jive.fusion": "bi/report/jive/jr/jive.fusion",
        "itemHyperlinkSettingService": "bi/report/jive/jr/item.hyperlink.service",
        "defaultSettingService": "bi/report/jive/jr/default.service",
        "jive.highcharts": "bi/report/jive/jr/jive.highcharts",
        "dualPieSettingService": "bi/report/jive/jr/dual.pie.service",
        "yAxisSettingService": "bi/report/jive/jr/y.axis.service",
        "jive.interactive.highchart": "bi/report/jive/jr/jive.interactive.highchart",
        "adhocHighchartsSettingService": "bi/report/jive/jr/adhocHighchartsSettingService"
    }
});
