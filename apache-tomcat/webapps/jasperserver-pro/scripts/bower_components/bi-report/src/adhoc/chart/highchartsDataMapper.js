/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id: highchartsDataMapper.js 2780 2014-10-23 06:06:03Z psavushchik $
 */

////////////////////////////////////////////////////////
//
//  HighChartDataMapper
//
//  Works on the dataset that is wrapped in an AdhocDataProcessor
//
//  Set up to recognize 3 styles of AdhocState data:
//
//    Style 0:
//
//       Measure Axis only.  All grouping on the Measure Axis, no groups on the non-Measure Axis.
//
//
//    Style 1:
//
//       Measure on one Axis.  All groups on the non-Measure Axis.
//
//
//    Style 2:
//
//      'Crosstab Style'  Groups on Measure Axis and groups on non-Measure Axis.
//
//
//
//   The chart renderers for various chart types (column, pie, etc), recognize these Styles
//   and handle them each in chart specific manner.
//
//
//
//   2012-08-01  thorick    created:  this thing actually works !
//
//
///////////////////////////////////////////////////////////

/**
 * Maps data to Highcharts options for specified chart type.
 *
 * @type {Object}
 */
//TODO: remove non-Amd wrapper after providing AMD support on server-side (chart export)
(function (factory, globalScope) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        define([
            "underscore",
            "adhoc/chart/adhocDataProcessor",
            "adhoc/chart/palette/defaultPalette",
            "adhoc/chart/enum/dateTimeFormats",
            "adhoc/chart/enum/adhocToHighchartsTypes",
            "highcharts"
        ], factory);
    } else {
        // Browser globals.
        globalScope.highchartsDataMapper = factory(_, AdhocDataProcessor, hcDefaultPalette, hcDateTimeFormats,
            adhocToHighchartsTypes, Highcharts);
    }
}(function (_, adhocDataProcessor, defaultPalette, dateTimeFormats, adhocToHcTypeMap, Highcharts) {
    "use strict";

    var HDM = _.chain({})
        .extend(defaultPalette)
        .extend(dateTimeFormats)
        .value();


    _.extend(HDM, {
        SeriesType: {
            COMMON: 0,
            PIE: 1,
            DUAL_LEVEL_PIE: 2,
            HEAT_MAP: 3,
            HEAT_MAP_TIME_SERIES: 4
        },

        chartType: null,
        fullGroupHierarchyNames: true,
        //containerWidth: 0,

        ////////////////////
        //  pie constants
        //

        defaultPiesPerRow: 8,
        maxPieRows: 4,

        HEATMAP_LEGEND_TICK_INTERVAL: 150,


        categories: [],
        categoryNames: {},
        groupedCategories: false,
        highchartsCategories: [],


        //
        //  track measure boundaries
        //
        measureMin: null,
        measureMax: null,

        getSeriesByType: function(type, rowSlider, columnSlider, extraOptions) {
            var rowAxisLeafArray;
            var columnAxisLeafArray;

            if (extraOptions.metadata.isOLAP) {
                rowAxisLeafArray = adhocDataProcessor.getNodeListForDimLevelRadio(0, rowSlider);
                columnAxisLeafArray = adhocDataProcessor.getNodeListForDimLevelRadio(1, columnSlider);
            } else {
                rowAxisLeafArray = adhocDataProcessor.getNodeListForSliderLevel(0, rowSlider);
                columnAxisLeafArray = adhocDataProcessor.getNodeListForSliderLevel(1, columnSlider);
            }

            var series;

            switch (type) {
                case HDM.SeriesType.COMMON:
                    series = HDM.getCommonSeries(rowAxisLeafArray, columnAxisLeafArray, extraOptions);
                    break;

                case HDM.SeriesType.PIE:
                    series = HDM.getPieSeries(rowAxisLeafArray, columnAxisLeafArray, rowSlider, columnSlider, extraOptions);
                    break;

                case HDM.SeriesType.DUAL_LEVEL_PIE:
                    series = HDM.getDualLevelPieSeries(rowAxisLeafArray, columnAxisLeafArray, rowSlider, columnSlider, extraOptions);
                    break;

                case HDM.SeriesType.HEAT_MAP:
                    series = HDM.getHeatMapOptions(rowAxisLeafArray, columnAxisLeafArray, extraOptions);
                    break;

                case HDM.SeriesType.HEAT_MAP_TIME_SERIES:
                    series = HDM.getHeatMapTimeSeriesOptions(rowAxisLeafArray, columnAxisLeafArray, extraOptions);
                    break;
                default:
                    throw "Unknown series type!";
            }

            return series;
        },

        getColor: function(num) {
            return HDM.colors[num % HDM.colors.length];
        },

        getColorWithAlpha: function(num, alpha) {
            var rgb = HDM.rgbColors[num % HDM.colors.length];

            return "rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", " + alpha + ")";
        },

        generateXAxisLabelsOptions: function(options) {
            var labelsOptions = {
                step: options.step,
                //keep default charts behaviour since 2.3.2
                maxStaggerLines: 1,
                style: {
                    fontSize: "1em"
                }
            };

            if (options.rotation != 0) {
                _.extend(labelsOptions, {
                    rotation: options.rotation
                });

                // add some shift for labels if they are rotated vertically. Fixes bug #35881
                if (options.adjustPosition && options.rotation === 90) {
                    labelsOptions.x = -4;
                } else if (options.rotation === 270) {
                    labelsOptions.x = 4;
                }
            }

            return labelsOptions;
        },

        doAxisSwap: function(chartType) {
            return chartType.indexOf("bar") != -1;
        },

        getLegendOptions: function(extraOptions) {
            var legend = {
                borderWidth: extraOptions.chartState.legendBorder ? 1 : 0,
                itemStyle: {
                    fontWeight: "normal",
                    fontSize: "1em"
                }
            };

            if (extraOptions.chartState.legend === "none") {
                legend.enabled = false;
            } else if (HDM.isScatterOrBubbleChart(extraOptions.chartState.chartType)) {
                legend.enabled = !HDM.isTotalSelectedOnly(extraOptions, 1);
            } else {
                legend.enabled = true;
            }

            switch (extraOptions.chartState.legend) {
                case "top":
                    legend.align = "center";
                    legend.verticalAlign = "top";
                    break;

                case "left":
                case "right":
                    legend.align = extraOptions.chartState.legend;
                    legend.verticalAlign = "middle";
                    legend.layout = "vertical";
                    break;
            }

            return legend;
        },

        getGeneralOptions: function (extraOptions) {
            return {
                chart: {
                    renderTo: 'chartContainer',
                    zoomType: 'xy',
                    type: HDM.adHocToHighchartsChartTypeMap[extraOptions.chartState.chartType],
                    polar: HDM.isSpiderChart(extraOptions.chartState.chartType),
                    style: {
                        fontSize: "1em"
                    }
                },
                credits: {
                    enabled: false
                },
                title: {
                    // Skip internal Highcharts title.
                    text: null
                },
                tooltip: {
                    valueDecimals: 2,
					useHTML: true,
                    style: {
                        fontSize: "1em"
                    }
                }
            };
        },

        getCommonSeriesGeneralOptions: function(extraOptions) {
            var doAxisSwap = HDM.doAxisSwap(extraOptions.chartState.chartType);

            var options = _.extend(HDM.getGeneralOptions(extraOptions), {
                xAxis: HDM.getXAxisOptions(doAxisSwap, extraOptions),
                yAxis: HDM.isDualOrMultiAxisChart(extraOptions.chartState.chartType) ? [] :
                    HDM.getYAxisOptions(doAxisSwap, extraOptions),
                plotOptions: {
                    series: {
                        marker: {
                            enabled: extraOptions.chartState.showDataPoints
                        },

                        tooltip: {
                            dateTimeLabelFormats: extraOptions.isTimeSeries ?
                                HDM.getDateTimeLabelFormats(extraOptions.chartState.timeSeriesCategorizerName) : undefined,
                            xDateFormat: extraOptions.isTimeSeries ?
                                HDM.getDateTimeTooltipFormats(extraOptions.chartState.timeSeriesCategorizerName) : undefined
                        }
                    }
                },
                series: [],
                legend: HDM.getLegendOptions(extraOptions)
            });

            if (HDM._isTooltipFollowPointerEnabled(extraOptions.chartState.chartType)) {
                options.tooltip.followPointer = true;
            }

            if (HDM.isDualOrMultiAxisChart(extraOptions.chartState.chartType) || HDM.isSpiderChart(extraOptions.chartState.chartType)) {
                options.tooltip.shared = true;
            } else {
                options.tooltip.shared = false;
            }

            return options;
        },

        isTotalSelectedOnly: function(extraOptions, axisIndex) {
            var selectedLevels = axisIndex == 0 ? extraOptions.chartState.rowsSelectedLevels :
                extraOptions.chartState.columnsSelectedLevels;

            var totalOnly = true;
            if (extraOptions.metadata.isOLAP) {
                _.each(selectedLevels, function(level) {
                    if (level.name != "(All)") {
                        totalOnly = false;
                    }
                });
            } else {
                totalOnly = selectedLevels.length == 0;
            }

            return totalOnly;
        },

        getXAxisOptions: function(doAxisSwap, extraOptions) {
            var options = {
                categories: [],
                title: {
                    // First measure goes to X axis for Scatter and Bubble.
                    text: HDM.isScatterOrBubbleChart(extraOptions.chartState.chartType) ?
                        extraOptions.metadata.measures[0] : ""
                }
            };
            if (HDM.isSpiderChart(extraOptions.chartState.chartType)) {
                options.tickmarkPlacement = "on";
                options.lineWidth = 0;
            }
            options.labels = HDM.generateXAxisLabelsOptions({
                rotation: doAxisSwap ? extraOptions.chartState.yAxisRotation : extraOptions.chartState.xAxisRotation,
                adjustPosition: !doAxisSwap,
                step: doAxisSwap ? extraOptions.chartState.yAxisStep : extraOptions.chartState.xAxisStep
            });

            // workaround for HC bug #2973, JS HC patch #16. Set y-axis labels align to the left. Because HC lib stops
            // calculating valid size for labels when they rotated for more than 74 degrees for bar chart
            if (doAxisSwap && Math.abs(extraOptions.chartState.xAxisRotation) >= 75) {
                options.labels.align = "right";
            }
		    options.offset = Math.abs(extraOptions.chartState.xAxisRotation) > 60 ? 5 : 0;

            if (extraOptions.isTimeSeries) {
                options.dateTimeLabelFormats = HDM.getDateTimeLabelFormats(extraOptions.chartState.timeSeriesCategorizerName);
                options.type = "datetime";
            }


            return options;
        },

        getYAxisOptions: function(doAxisSwap, extraOptions) {
            var options = {
                title: {
                    text: " "
                },
                labels: {
                    rotation: doAxisSwap ? extraOptions.chartState.xAxisRotation : extraOptions.chartState.yAxisRotation,
                    step: doAxisSwap ? extraOptions.chartState.xAxisStep : extraOptions.chartState.yAxisStep,
                    style: {
                        fontSize: "1em"
                    }
                }
            };

            //workaround to prevent truncating of labels - #35709
            if (HDM.isScatterOrBubbleChart(extraOptions.chartState.chartType)) {
                // Second measure goes to X axis for Scatter and Bubble.
                options.title.text = extraOptions.metadata.measures[1];
            } else if (extraOptions.chartState.showMeasureOnValueAxis && extraOptions.metadata.measures.length == 1) {
                options.title.text = extraOptions.metadata.measures[0];
            }

            if (HDM.isSpiderChart(extraOptions.chartState.chartType)) {
                options.gridLineInterpolation = "polygon";
                options.lineWidth = 0;
                options.min = 0;
                if (options.labels.rotation > 0) {
                    options.labels.x = - (options.labels.rotation / 90 * 10);
                }
            }

            return options;
        },

        getDateTimeLabelFormats: function(categorizerName) {
            return HDM.dateTimeLabelFormatsMap[categorizerName];
        },

        getDateTimeTooltipFormats: function(categorizerName) {
            return HDM.dateTimeTooltipFormatsMap[categorizerName];
        },

        /**
         * Generates Highcharts options for common series charts (no pie charts).
         *
         * Items (measures only) or items combination (groups or measures + groups) from Columns axis go to series.
         * Items (measures only) or items combination (groups or measures + groups) from Rows axis go to categories of
         * X-axis (except bar chart).
         *
         * @param rowAxisLeafArray
         * @param columnAxisLeafArray
         * @param extraOptions
         *
         * @returns highcharts options object.
         */
        getCommonSeries: function(rowAxisLeafArray, columnAxisLeafArray, extraOptions) {
            var isTimeSeries = extraOptions.isTimeSeries,
                chartType = extraOptions.chartState.chartType;

            // Data reset.
            HDM.groupedCategories = false;
            HDM.highchartsCategories = [];
            HDM.measureMin = null;
            HDM.measureMax = null;

            var result = this.getCommonSeriesGeneralOptions(extraOptions);

            HDM.setupOptionsSeries(columnAxisLeafArray, result, chartType, extraOptions);
            HDM.setupOptionsYAxis(columnAxisLeafArray, result, chartType, extraOptions);
            HDM.populateOptionsDataAndCategories(rowAxisLeafArray, columnAxisLeafArray, result, chartType, isTimeSeries,
                extraOptions);

            HDM.setCategories(result, isTimeSeries || HDM.isScatterOrBubbleChart(chartType), chartType);

            return result;
        },

        /**
         * Setups series data of highcharts options for common series charts.
         *
         * @param columnAxisLeafArray
         * @param result
         * @param chartType
         * @param extraOptions
         */
        setupOptionsSeries: function(columnAxisLeafArray, result, chartType, extraOptions) {
            var isScatterOrBubble = HDM.isScatterOrBubbleChart(chartType),
                measuresNumber = extraOptions.metadata.measures.length;
            var seriesNumber = isScatterOrBubble ? columnAxisLeafArray.length / measuresNumber :
                columnAxisLeafArray.length;

            // Column groups are legend items, one legend per series item.
            for (var i = 0; i < seriesNumber; i++) {
                // For Scatter and Bubble charts not all nodes are used as series.
                // Here we take specific node to extract labels from.
                var columnLeafNode = isScatterOrBubble && !HDM._isMeasureFirst(extraOptions.metadata) ?
                    columnAxisLeafArray[i * measuresNumber] : columnAxisLeafArray[i];

                var label = HDM.assembleFullGroupLinearName(1, columnLeafNode, extraOptions);

                var isLastSeries = i == seriesNumber - 1;

                var tooltip;
                if (HDM.isScatterOrBubbleChart(chartType)) {
                    var hasSelectedColumnsGroups = extraOptions.chartState.columnsSelectedLevels.length > 0;
                    var hasSelectedRowsGroups = extraOptions.chartState.rowsSelectedLevels.length > 0;

                    tooltip = {
                        headerFormat: hasSelectedRowsGroups ? '{point.key}<br/>' : "",
                        pointFormat: HDM.constructTooltipPointFormat(chartType, extraOptions),
                        followPointer: true
                    };
                }

                result.series.push({
                    name: label,
                    data: [],
                    color: isScatterOrBubble ? HDM.getColorWithAlpha(i, 0.75) : HDM.getColor(i),
                    type: HDM.isDualOrMultiAxisChart(chartType) ?
                        HDM.getDualOrMultiAxisHighchartsType(chartType, isLastSeries) : undefined,
                    yAxis: HDM.isMultiAxisChart(chartType) ? i : 0,
                    tooltip: tooltip
                });
            }
        },

        constructTooltipPointFormat: function(chartType, extraOptions) {
            var hasSelectedColumnsGroups = extraOptions.chartState.columnsSelectedLevels.length > 0,
                onlyTotalsInColumns = HDM.isTotalSelectedOnly(extraOptions, 1),
                pointFormat = "";

            // do not show additional info in tooltip if we have no column groups
            // or we are in OLAP mode and only (All) levels are selected in column levels
            if (hasSelectedColumnsGroups && !onlyTotalsInColumns) {
                pointFormat += "<span style=\"color:{series.color}\">{series.name}</span> <br/>";
            }

            pointFormat += (extraOptions.metadata.measures[0] + " : <b>{point.x:,.2f}</b><br/>" +
                            extraOptions.metadata.measures[1] + " : <b>{point.y:,.2f}</b>" +
                            (HDM.isBubbleChart(chartType)
                                ? ("<br/>" + extraOptions.metadata.measures[2] + " : <b>{point.z:,.2f}</b> ")
                                : ""));

            return pointFormat;
        },

        /**
         * Setups Y-axis of highcharts options for common series charts.
         *
         * @param columnAxisLeafArray
         * @param result
         * @param chartType
         * @param extraOptions
         */
        setupOptionsYAxis: function(columnAxisLeafArray, result, chartType, extraOptions) {
            // Setup axes.
            if (HDM.isDualAxisChart(chartType)) {
                // Set reference to Y axis for last series.
                result.series[columnAxisLeafArray.length - 1].yAxis = 1;

                // Create 2 axes.
                // Title on the first axis should be first series (measure) name if there are only 2 series (measures).
                var firstAxisTitle = extraOptions.chartState.showMeasureOnValueAxis && result.series.length == 2 ?
                    result.series[0].name : "";

                result.yAxis.push(HDM.getYAxisForDualOrMultiAxisChart(extraOptions, 0, firstAxisTitle));
                result.yAxis.push(HDM.getYAxisForDualOrMultiAxisChart(extraOptions, columnAxisLeafArray.length - 1,
                    result.series[columnAxisLeafArray.length - 1].name));
            } else if (HDM.isMultiAxisChart(chartType)) {
                // Create an axis for each series.
                for (var i = 0; i < columnAxisLeafArray.length; i++) {
                    result.yAxis.push(HDM.getYAxisForDualOrMultiAxisChart(extraOptions, i, result.series[i].name));
                }
            }
        },

        /**
         * Populates series data and X-axis categories of highcharts options for common series charts.
         *
         * @param rowAxisLeafArray
         * @param columnAxisLeafArray
         * @param result
         * @param chartType
         * @param isTimeSeries
         * @param extraOptions
         */
        populateOptionsDataAndCategories: function(rowAxisLeafArray, columnAxisLeafArray, result, chartType, isTimeSeries, extraOptions) {
            var isScatterOrBubble = HDM.isScatterOrBubbleChart(chartType),
                measuresNumber = extraOptions.metadata.measures.length,
                seriesNumber = isScatterOrBubble
                    ? columnAxisLeafArray.length / measuresNumber
                    : columnAxisLeafArray.length;

            // Go through each measure leaf (set on the x axis) and generate the series for each.
            for (var i = 0; i < rowAxisLeafArray.length; i++) {
                var rowAxisLeafNode = rowAxisLeafArray[i];

                for (var j = 0; j < seriesNumber; j++) {
                    var currSeries = result.series[j];

                    // Value extraction and population of series data array.
                    // Scatter and Bubble charts.
                    if (isScatterOrBubble) {
                        // For Scatter and Bubble charts we should extract measure values for each group (group combination)
                        // and put them into one array.
                        var values = [];

                        // There are two cases of measure values extraction.
                        if (HDM._isMeasureFirst(extraOptions.metadata)) {
                            // 1: Measures first.
                            for (var mIdx = 0; mIdx < measuresNumber; mIdx++) {
                                var val = HDM.getDataValue(rowAxisLeafNode, columnAxisLeafArray[j + mIdx * seriesNumber],
                                    true);
                                values.push(val);
                            }
                        } else {
                            // 2: Measures last.
                            for (var groupIdx = 0; groupIdx < measuresNumber; groupIdx++) {
                                values.push(HDM.getDataValue(rowAxisLeafNode,
                                    columnAxisLeafArray[j * measuresNumber + groupIdx], true));
                            }
                        }

                        var hasNullValuesOnly = _.every(values, function(value) {
                            return value == null;
                        });

                        // Skip null value arrays.
                        if (!hasNullValuesOnly) {
                            // Replace null value to 0. Sometimes (when x is null) Highcharts may not render null values.
                            values = _.map(values, function(num) {
                                return num == null ? 0 : num;
                            });

                            HDM.measureMinMax(values[0]);
                            HDM.measureMinMax(values[1]);

                            var objectValue;
                            if (HDM.isScatterChart(chartType)) {
                                objectValue = {
                                    x: values[0],
                                    y: values[1],
                                    name: HDM.assembleFullGroupHierarchyName(0, rowAxisLeafNode, extraOptions)
                                };
                            } else if (HDM.isBubbleChart(chartType)) {
                                objectValue = {
                                    x: values[0],
                                    y: values[1],
                                    z: values[2],
                                    name: HDM.assembleFullGroupHierarchyName(0, rowAxisLeafNode, extraOptions)
                                };
                            } else {
                                throw "Unexpected chart type";
                            }

                            currSeries.data.push(objectValue);
                        }
                    } else {
                        var value = HDM.getDataValue(rowAxisLeafNode, columnAxisLeafArray[j], isTimeSeries);

                        // Time series charts.
                        if (isTimeSeries) {
                            if (value.value != null && value.timestamp != null) {
                                HDM.measureMinMax(value.value);

                                currSeries.data.push([value.timestamp, value.value]);
                            }
                        } else {
                            // Other series charts.
                            HDM.measureMinMax(value);

                            // Highcharts handles NULL data in series data. So set whatever we get back.
                            currSeries.data.push(value);
                        }
                    }
                }

                if (!isTimeSeries && !isScatterOrBubble) {
                    // Row groups are categories across the x-axis.
                    var label = HDM.assembleFullGroupHierarchyName(0, rowAxisLeafNode, extraOptions);

                    result.xAxis.categories.push(label);
                }
            }

            if (HDM.isScatterOrBubbleChart(chartType)) {
                var turboThreshold = 1000;
                _.each(result.series, function(seriesObject) {
                    turboThreshold = Math.max(turboThreshold, seriesObject.data.length);
                });

                result.plotOptions.series.turboThreshold = turboThreshold;
            }

            // if there is only one "bubble" in bubble chart it may be displayed incorrectly if x value has some decimal digits
            // to fix bug #35757 we force xAxis to start on ticks
            if (HDM.isBubbleChart(chartType) && seriesNumber === 1) {
                result.xAxis.startOnTick = true;
                result.xAxis.endOnTick = true;
            }
        },

        /**
         * Generates Y-axis for dual axis or multi-axis charts.
         *
         * @param extraOptions
         * @param axisNumber
         * @param titleText
         * @returns {*}
         */
        getYAxisForDualOrMultiAxisChart: function(extraOptions, axisNumber, titleText) {
            var yAxis = HDM.getYAxisOptions(HDM.doAxisSwap(extraOptions.chartState.chartType), extraOptions);

            yAxis.opposite = (axisNumber != 0);
            yAxis.labels.style = {
                color: HDM.getColor(axisNumber),
                fontSize: "1em"
            };
            yAxis.title = {
                text: titleText,
                style: {
                    color: HDM.getColor(axisNumber)
                }
            };

            if (yAxis.opposite === false) {
                yAxis.offset = Math.abs(extraOptions.chartState.yAxisRotation) > 60 ? 5 : 0;
            }

            return yAxis;
        },

        /**
         * Sets categories for X-axis.
         *
         * @param result
         * @param eraseCategories
         */
        setCategories: function(result, eraseCategories, chartType) {
            // 'categories' property should be undefined for some chart types. Otherwise chart will hang.
            if (eraseCategories) {
                result.xAxis.categories = undefined;
            } else  if (HDM.groupedCategories) {
                if (this.areCategoriesSupported(chartType)) {
                    result.xAxis.categories = HDM.highchartsCategories;
                }
            }
        },

        /**
         * Checks if categories are supported for current chart type.
         *
         * @returns {boolean} true if categories are supported, false otherwise.
         */
        areCategoriesSupported: function(chartType) {
            return chartType.indexOf("spider") == -1 && (
                chartType.indexOf('column') >= 0 ||
                chartType.indexOf('area') >= 0 ||
                chartType.indexOf('line') >= 0 ||
                chartType.indexOf('spline') >= 0);
        },

        //
        //  The Pie chart is completely axis based
        //
        //  The general principle is that there is 1 pie per Column Axis group
        //  and an individual pie's slices correspond to the Row Axis groups
        //
        //
        getPieSeries: function(rowAxisLeafArray, columnAxisLeafArray, rowSlider, columnSlider, extraOptions) {
            HDM.measureMin = null;
            HDM.measureMax = null;

            var titleLines = (_.isArray(columnSlider) ? columnSlider.length : columnSlider) + extraOptions.metadata.measureAxis;
            var titleTextLineHeight = 15;
            var textTopBottomPadding = 10;
            var titleHeight = titleTextLineHeight * titleLines + textTopBottomPadding;
            var containerWidth = extraOptions.width;
            var containerHeight = extraOptions.height;

            var dataStyle = adhocDataProcessor.getDataStyle();
            var label;

            var result = _.extend(HDM.getGeneralOptions(extraOptions), {
                xAxis: {
                    categories: []
                },
                plotOptions: {
                    pie: {
                        slicedOffset: 0,
                        point: {
                            events: {
                                legendItemClick: HDM._getLegendItemClickHandler
                            }
                        }
                    }
                },
                series: [],
                labels: {
                    items: []
                },
                legend: HDM.getLegendOptions(extraOptions)
            });

            //
            // single axis ONLY.
            //
            //  1 cases:
            //      0.  data on rows only
            //      1.  data on columns only
            //
            //
            //
            //
            if (dataStyle == 0)  {
                //
                //  data on rows only
                //
                //  in all cases there is a single pie with slices = row groups
                //
                if (extraOptions.metadata.axes[0].length > 0)  {

                    // since there's only 1 'live' axis the non-live axis should have only one node and this is it
                    var columnNode = columnAxisLeafArray[0];
                    var pieSetSize = 1;
                    var pieMaxPositionCount = pieSetSize + 1;
                    var xAxisPositionIncrement = 100 / pieMaxPositionCount;
                    var xAxisPosition = xAxisPositionIncrement;
                    var yAxisPosition = 50;

                    //  nonMeasure groups contain measure subgroups.
                    //  the label is for nonMeasure groups so it spans all of its measure pies
                    var labelMaxPositionCount = pieSetSize + 1;
                    var labelAbsolutePositionIncrement = containerWidth / labelMaxPositionCount;
                    var labelAbsolutePosition = labelAbsolutePositionIncrement - (labelAbsolutePositionIncrement/pieMaxPositionCount);

                    var centerArray = [];
                    var xAxis = xAxisPosition + "%";
                    var yAxis = yAxisPosition + "%";
                    centerArray.push(xAxis);
                    centerArray.push(yAxis);

                    var name = adhocDataProcessor.getMessage("totalsLabelForChart");
                    if (extraOptions.metadata.measures[0].name) {
                        name = extraOptions.metadata.measures[0].name;
                    }
                    result.series.push({
                        type: 'pie',
                        name: name,
                        data: [],
                        center: centerArray,
                        size: (xAxisPositionIncrement *2) + "%",
                        showInLegend: true,
                        dataLabels: { enabled: false }
                    });

                    for (var i=0; i < rowAxisLeafArray.length; i++) {
                        var rowAxisLeafNode = rowAxisLeafArray[i];
                        var value = HDM.getDataValue(rowAxisLeafNode, columnNode);
                        HDM.measureMinMax(value);

                        label = HDM.assembleFullGroupLinearName(0, rowAxisLeafNode, extraOptions);

                        result.series[0].data.push([label, value]);
                    }
                }

                //
                // data on columns only
                //
                //  if it's measures only , then there is 1 pie with measure slices
                //
                //  for groups it's 1 pie per group with measure slices
                //
                //  we distinguish 2 cases:
                //      0.  measures in axis leaves:
                //              In this case the number of pies is the (number of axis leaves) / (number of measures)
                //              The slices are the measures
                //
                //
                //      1.  measures NOT in axis leaves:
                //              In this case tne number of pies is the number of axis leaves
                //
                //
                else {
                    var rowAxisNode      = rowAxisLeafArray[0];
                    var isMeasureOnly    = (extraOptions.metadata.axes[1].length <= 1 ? true : false);
                    var measureIsLast    = adhocDataProcessor.isMeasuresLastOnAxis(1);
                    var numberOfMeasures = extraOptions.metadata.measures.length;

                    // determine how many pies there are
                    var pieSetSize = 1;     // measure only case
                    if (!isMeasureOnly)  {
                        if (measureIsLast) {
                            pieSetSize = columnAxisLeafArray.length / numberOfMeasures;
                        }
                        else {
                            // for measures not at the leaf level
                            // the number of pies is the number of leaf level members
                            pieSetSize = columnAxisLeafArray.length;

                        }
                    }

                    var squareSideLength = HDM.getSquareSideLength(pieSetSize, containerWidth, containerHeight);
                    for (var m=0; m < pieSetSize; m++) {
                        var pieInfo = HDM.computePieParams(m+1, squareSideLength, containerWidth, containerHeight,
                            titleHeight, pieSetSize);
                        var index = m;

                        label = adhocDataProcessor.getMessage("allLabelForChart");
                        if (!isMeasureOnly) {
                            if (measureIsLast) {
                                index = m * numberOfMeasures;             // 1 pie per group of measures
                                var node = columnAxisLeafArray[index];    // this label is measure name
                                label = node.parent.label;                // parent of measure
                            }
                            else {
                                label = columnAxisLeafArray[m].label;
                            }
                        }

                        var centerArray = [];
                        var xAxis = pieInfo.xAxisPositionPercent + "%";
                        var yAxis = pieInfo.yAxisPositionPercent + "%";
                        centerArray.push(xAxis);
                        centerArray.push(yAxis);
                        var index = m;
                        if (measureIsLast)  {
                            if (!isMeasureOnly) {
                                index = m * numberOfMeasures;
                            }
                        }
                        // only show the legend once
                        var showInLegendValue = m > 0 ? false : true;
                        result.series.push({
                            type: 'pie',
                            name: columnAxisLeafArray[index].label,
                            data: [],
                            center: centerArray,
                            size: pieInfo.pieSizePercent + "%",
                            showInLegend: showInLegendValue,
                            dataLabels: { enabled: false },
                            title: {
                                text: label,
                                verticalAlign: 'top',
                                y: -titleHeight
                            }
                        });
                    }


                    //
                    //  case:  measures only (no groups)
                    //      single pie with measures as slices
                    //
                    //  case:  measures are leaves:
                    //      all leaves are grouped by common lowest non-measure group
                    //      we have to cycle through the labels
                    //      e.g.  Canada-Sales, Canada-Cost, Mexico-Sales, Mexico-Cost, etc..
                    //
                    //      so we take advantage of this ordering to know when to switch pies
                    //      switch on a change in the non-measure group  'Country'
                    //
                    //  case:  measures are NOT leaves:
                    //      one pie per column leaf group
                    //
                    if (isMeasureOnly) {     // single pie only
                        for (var i=0; i < columnAxisLeafArray.length; i++) {
                            var columnAxisLeafNode = columnAxisLeafArray[i];

                            var value = HDM.getDataValue(rowAxisNode, columnAxisLeafNode);
                            HDM.measureMinMax(value);

                            label = HDM.assembleFullGroupLinearName(1, columnAxisLeafNode, extraOptions);

                            result.series[0].data.push([label, value]);
                        }
                    }
                    else if (measureIsLast) {   // pie per non-measure group
                        var currLeafLabel = columnAxisLeafArray[0].label;
                        var pieIndex = 0;
                        var measureCounter = 0;
                        for (var i=0; i < columnAxisLeafArray.length; i++) {
                            var columnAxisLeafNode = columnAxisLeafArray[i];
                            measureCounter++;

                            if (measureCounter > numberOfMeasures) {
                                pieIndex++;
                                if (pieIndex >= pieSetSize)  throw "highchart.datamapper getPieSeries: exceeded numberOfPies="+numberOfPies;
                                measureCounter = 1;
                            }
                            var value = HDM.getDataValue(rowAxisNode, columnAxisLeafNode);
                            HDM.measureMinMax(value);

                            label = columnAxisLeafNode.label;    // measure name only

                            result.series[pieIndex].data.push([label, value]);
                        }
                    }
                    else {           // pie per leaf node
                        for (var i=0; i < columnAxisLeafArray.length; i++) {
                            var columnAxisLeafNode = columnAxisLeafArray[i];
                            var value = HDM.getDataValue(rowAxisNode, columnAxisLeafNode);
                            HDM.measureMinMax(value);

                            label = HDM.assembleFullGroupHierarchyName(1, columnAxisLeafNode, extraOptions);

                            result.series[i].data.push([label, value]);
                        }
                    }
                }
            }
            //
            // full on crosstab
            //
            // one pie per column group
            //
            // 1 slice per row group
            //
            //
            if (dataStyle == 2 || dataStyle == 1)  {

                // setup each individual pie  in the highcharts  series
                //
                // There is a single pie for each column group
                //   so we iterate on the column axis
                //
                var squareSideLength = HDM.getSquareSideLength(columnAxisLeafArray.length, containerWidth, containerHeight);
                for (var m=0; m < columnAxisLeafArray.length; m++) {
                    var pieInfo = HDM.computePieParams(m+1, squareSideLength, containerWidth, containerHeight,
                        titleHeight, columnAxisLeafArray.length);

                    var columnGroupName = columnAxisLeafArray[m].label;
                    //
                    // column axis is the measure axis so we want the label to
                    //  be  previous-level-label + measure name
                    //
                    var label = HDM.assembleFullGroupHierarchyName(1, columnAxisLeafArray[m], extraOptions);
                    var pieName = columnGroupName;
                    var centerArray = [];
                    var xAxis = pieInfo.xAxisPositionPercent + "%";
                    var yAxis = pieInfo.yAxisPositionPercent + "%";
                    centerArray.push(xAxis);
                    centerArray.push(yAxis);

                    // only show the legend once
                    var showInLegendValue = m > 0 ? false : true;
                    result.series.push({
                        type: 'pie',
                        name: pieName,
                        data: [],
                        center: centerArray,
                        size: pieInfo.pieSizePercent + "%",
                        showInLegend: showInLegendValue,
                        dataLabels: { enabled: false },
                        title: {
                            text: label,
                            verticalAlign: 'top',
                            y: -titleHeight
                        }
                    });
                }


                // for each columnGroup's pie:
                //  go through the row groups to fill in the slices

                var pieSeriesIndex = 0;      // be really careful with the use of this.  It MUST match the series initialization above !
                for (var i=0; i < columnAxisLeafArray.length; i++) {
                    var columnAxisLeafNode = columnAxisLeafArray[i];      // for this nonMeasure axis group a set of pies for each measure

                    for (var j=0; j < rowAxisLeafArray.length; j++) {
                        var rowAxisLeafNode = rowAxisLeafArray[j];
                        var value = HDM.getDataValue(rowAxisLeafNode, columnAxisLeafNode);
                        HDM.measureMinMax(value);

                        label = HDM.assembleFullGroupLinearName(0, rowAxisLeafNode, extraOptions);

                        result.series[i].data.push([label, value]);
                    }
                }
            }
            return result;
        },

        //
        //  The Dual-Level Pie chart
        //
        //
        //
        //
        getDualLevelPieSeries: function(rowAxisLeafArray, columnAxisLeafArray, rowSlider, columnSlider, extraOptions) {
            HDM.measureMin = null;
            HDM.measureMax = null;

            var rowAxisLeafArrayInner = [],
                columnNode = columnAxisLeafArray[0],
                columnName = columnNode.label === "(empty axis)" ? "Value" : columnNode.label,
                label, value,
                rowAxisLeafNode, rowAxisLeafNodeInner,
                colors = HDM.colors,
                colorsCount = colors.length,
                brightness,
                outerPiecesCounter = 0,
                innerPiecesCounter = -1,
                turboThreshold = 1000;

            if (extraOptions.metadata.isOLAP) {
                // skip if only "All" field selected
                if (extraOptions.metadata.axes[0][0].name !== "(All)") {
                    rowSlider[0].level -= 1;
                    rowAxisLeafArrayInner = adhocDataProcessor.getNodeListForDimLevelRadio(0, rowSlider);
                }
            } else {
                if (HDM._isMeasureFirst(extraOptions.metadata)) {
                    rowAxisLeafArrayInner = adhocDataProcessor.getNodeListForSliderLevel(0, rowSlider-1);
                }
            }

            var result = _.extend(HDM.getGeneralOptions(extraOptions), {
                xAxis: {
                    categories: []
                },
                plotOptions: {
                    pie: {
                        slicedOffset: 0,
                        point: {
                            events: {
                                legendItemClick: HDM._getLegendItemClickHandlerDisabled
                            }
                        }
                    }
                },
                series: [],
                labels: {
                    items: []
                },
                legend: HDM.getLegendOptions(extraOptions)
            });


            // fill innermost pie
            result.series.push({
                name: columnName,
                data: [],
                center: ["50%", "50%"],
                size: "60%",
                showInLegend: false,
                dataLabels: {
                    color: 'white',
                    distance: -30,
                    style: {
                        fontSize: "1em"
                    }

                }
            });

            for (var i = 0; i < rowAxisLeafArrayInner.length; i++) {
                rowAxisLeafNodeInner = rowAxisLeafArrayInner[i];

                value = HDM.getDataValue(rowAxisLeafNodeInner, columnAxisLeafArray[0]);
                label = HDM.assembleFullGroupLinearName(0, rowAxisLeafNodeInner, extraOptions);
                rowAxisLeafNodeInner.parent.color = colors[i%colorsCount];

                result.series[0].data.push({
                    name: label,
                    y: value,
                    color: colors[i%colorsCount]
                });

            }

            // if innermost pie data did not filled, do it from outermost data
            if (result.series[0].data.length === 0) {
                var calcInnerPie = true;
            }

            // fill outermost pie
            result.series.push({
                name: columnName,
                data: [],
                center: ["50%", "50%"],
                size: "90%",
                innerSize: "60%",
                showInLegend: true,
                dataLabels: {
                    enabled: false,
                    style: {
                        fontSize: "1em"
                    }
                }
            });

            for (var i = 0; i < rowAxisLeafArray.length; i++) {
                rowAxisLeafNode = rowAxisLeafArray[i];

                if (rowAxisLeafNode === rowAxisLeafNode.parent.children[0] ||
                    (extraOptions.metadata.isOLAP && rowAxisLeafNode === rowAxisLeafNode.parent.children[0].children[0])) {
                    outerPiecesCounter = 0;
                    innerPiecesCounter++;
                    if (calcInnerPie) {
                        result.series[0].data.push({
                            name: HDM.assembleFullGroupLinearName(0, rowAxisLeafNode.parent, extraOptions),
                            y: 0,
                            color: colors[innerPiecesCounter%colorsCount]
                        });
                        rowAxisLeafNode.parent.color = colors[innerPiecesCounter%colorsCount];
                    }
                } else {
                    outerPiecesCounter++;
                }

                value = HDM.getDataValue(rowAxisLeafNode, columnNode);
                label = HDM.assembleFullGroupLinearName(0, rowAxisLeafNode, extraOptions);

                brightness = 0.2 - (outerPiecesCounter / rowAxisLeafNode.parent.children.length) / 5;

                result.series[1].data.push({
                    name: label,
                    y: value,
                    color: Highcharts.Color(rowAxisLeafNode.parent.color || colors[0]).brighten(brightness).get()
                });

                if (calcInnerPie) {
                    result.series[0].data[innerPiecesCounter].y += value;
                }
            }

            if (!rowAxisLeafArray.length) {
                result.series[0].data = [];
            }


            _.each(result.series, function(seriesObject) {
                turboThreshold = Math.max(turboThreshold, seriesObject.data.length);
            });
            result.plotOptions.pie.turboThreshold = turboThreshold;

            return result;
        },

        getCommonHeatMapOptions: function(rowAxisLeafArray, columnAxisLeafArray, extraOptions, showNull) {
            var result = HDM.getCommonSeriesGeneralOptions(extraOptions);
            var legendHorizontal = _.include(["bottom", "top"], extraOptions.chartState.legend);

            result = _.extend(result, {
                colorAxis: _.extend(_.clone(HDM.colorAxis), {
                    labels: {
                        style: {
                            fontSize: "1em"
                        }
                    },
                    // Workaround for heat map legend ticks positioning. Provide the same settings for horizontal
                    // and vertical legend for render the same number of ticks
                    tickPixelInterval: HDM.HEATMAP_LEGEND_TICK_INTERVAL
                }),
                series: [{
                    borderWidth: 1,
                    data: [],
                    dataLabels: {
                        enabled: false
                    }
                }],
                tooltip: {
                    "valueDecimals": 2,
                    formatter: function () {
                        return this.series.yAxis.categories[this.point.y] + ", " + this.series.xAxis.categories[this.point.x] +
                            "<br/>" + columnAxisLeafArray[0].label + ": <b>" +
                            (showNull && this.point.value === null ? null : Highcharts.numberFormat(this.point.value, 2)) +
                            "</b>";
                    },
                    useHTML: true,
                    style: {
                        fontSize: "1em"
                    }
                }
            });
            result.yAxis.title = null;
            result.xAxis.gridLineWidth = result.yAxis.gridLineWidth = showNull ? 0 : 1;

            return result;
        },
        getHeatMapOptions: function(rowAxisLeafArray, columnAxisLeafArray, extraOptions) {
            // showNull - allow rendering empty cells with null values
            var showNull = true;

            HDM.measureMin = null;
            HDM.measureMax = null;

            var result = HDM.getCommonHeatMapOptions(rowAxisLeafArray, columnAxisLeafArray, extraOptions, showNull);

            var matrixData = HDM.computeHeatMapMatrixData(rowAxisLeafArray, columnAxisLeafArray, showNull);
            result.series[0].data = matrixData.data;
            result.xAxis.categories = matrixData.xCategories;
            result.yAxis.categories = matrixData.yCategories;

            if (matrixData.xCategories.length !== 1) {
                result.xAxis.minRange = 1;
            }
            if (matrixData.yCategories.length !== 1) {
                result.yAxis.minRange = 1;
            }

            result.colorAxis.min = HDM.measureMin;
            result.colorAxis.max = HDM.measureMax;

            result.plotOptions.series.turboThreshold = Math.max(result.series[0].data.length, 1000);

            return result;

        },
        computeHeatMapMatrixData: function(rowAxisLeafArray, columnAxisLeafArray, showNull) {
            var value, col, yCategoriesFilled = false,
                result = {
                    data: [],
                    xCategories: [],
                    yCategories: []
                };

            _.each(columnAxisLeafArray, function(measure, x) {
                col = measure.parent;

                result.xCategories.push(col.label);

                _.each(rowAxisLeafArray, function(row, y) {
                    if (!yCategoriesFilled) {
                        result.yCategories.push(row.label);
                    }
                    value = HDM.getDataValue(row, col.children[0], true);
                    if (value !== null || showNull) {
                        HDM.measureMinMax(value);
                        result.data.push([x, y, value]);
                    }
                });

                yCategoriesFilled = true;
            });

            return result;
        },

        getHeatMapTimeSeriesOptions: function(rowAxisLeafArray, columnAxisLeafArray, extraOptions) {
            // showNull - allow rendering empty cells with null values
            var showNull = true;
            var result = HDM.getCommonHeatMapOptions(rowAxisLeafArray, columnAxisLeafArray, extraOptions, showNull);
            if (!rowAxisLeafArray.length) return result;

            var hashedData = {},
                tmpTime = new Date(),
                xMin, xMax,
                zValue,
                yValue, yLabels = {},
                colSize = 24 * 36e5,
                firstItem = HDM.getDataValue(rowAxisLeafArray[0], columnAxisLeafArray[0]);

            HDM.measureMin = HDM.measureMax = firstItem.value;
            xMin = xMax = firstItem.timestamp;


            // create hash 'timestamp'=value
            // find min/max for X and Z
            _.each(rowAxisLeafArray, function(item) {
                var itemData = HDM.getDataValue(item, columnAxisLeafArray[0], true);
                var zValue = itemData.value;

                hashedData[itemData.timestamp] = zValue;
                xMin = Math.min(xMin, itemData.timestamp);
                xMax = Math.max(xMax, itemData.timestamp);

                HDM.measureMinMax(zValue);
            });

            // create series data array for each hour
            var timeEndDate = new Date(xMax);
            tmpTime.setTime(xMin);
            do {
                if (hashedData.hasOwnProperty(tmpTime.getTime())) {
                    zValue = hashedData[tmpTime.getTime()];
                } else if (showNull) {
                    zValue = null;
                } else {
                    tmpTime.setUTCHours(tmpTime.getUTCHours()+1);
                    continue;
                }

                yValue = tmpTime.getUTCHours();
                yLabels[yValue] = true;

                tmpTime.setUTCHours(0);
                result.series[0].data.push([tmpTime.getTime(), yValue, zValue]);

                tmpTime.setUTCHours(yValue+1);
            } while (tmpTime <= timeEndDate);

            // values settings
            result.colorAxis.min = HDM.measureMin;
            result.colorAxis.max = HDM.measureMax;

            // Y axis settings
            yLabels = _.map(yLabels, function(item, key) {
                return parseInt(key, 10);
            });
            result.yAxis = _.extend(result.yAxis, {
                startOnTick: false,
                endOnTick: false,
                reversed: true,
                tickPositioner: function(min, max) {
                    return yLabels.slice(Math.round(min), Math.round(max)+1);
                },
                minRange: 8,
                labels: _.extend(result.yAxis.labels, {
                    format: "{value}:00"
                })
            });

            // X axis settings
            result.series[0].name = columnAxisLeafArray[0].label;
            result.series[0].colsize = colSize;
            result.series[0].borderWidth = 0;

            tmpTime.setTime(xMin);
            tmpTime.setUTCHours(0);
            result.xAxis.min = tmpTime.getTime();
            tmpTime.setTime(xMax);
            tmpTime.setUTCHours(0);
            result.xAxis.max = tmpTime.getTime();
            result.xAxis.minRange = 30 * colSize;
            result.xAxis.type = "datetime";
            result.xAxis.categories = null;
            result.xAxis.endOnTick = false;
            result.xAxis.labels = _.extend(result.xAxis.labels, {
                format: '{value:%B}' // long month
            });

            // calc tick positions for x axis
            result.xAxis.tickPositions = [];
            tmpTime.setTime(xMin);
            do {
                result.xAxis.tickPositions.push(tmpTime.getTime());
                if (tmpTime.getUTCDate() !== 1) {
                    tmpTime.setUTCDate(1);
                }
                tmpTime.setUTCMonth(tmpTime.getUTCMonth()+1);
            } while(tmpTime.getTime() <= xMax);

            result.tooltip = _.extend(result.tooltip, {
                backgroundColor: null,
                borderWidth: 0,
                shadow: false,
                useHTML: true,
                style: {
                    padding: 0,
                    color: 'black',
                    fontSize: "1em"
                },
                formatter: function() {
                    return '<span style="color:{series.color}">\u25CF</span> ' + columnAxisLeafArray[0].label +
                        "<br/>" + Highcharts.dateFormat("%e %b %Y", this.point.x) + " " + this.point.y + ":00 <b>" +
                        (showNull && this.point.value === null ? null : Highcharts.numberFormat(this.point.value, 2)) +
                        "</b>";
                }
            });


            result.plotOptions.series.turboThreshold = Math.max(result.series[0].data.length, 1000);

            // provide indicator for time series heat map for rendering by canvas
            result.chart.isHeatMapTimeSeriesChart = true;
            return result;
        },

        _getLegendItemClickHandler: function(event) {
            event.preventDefault();
            var dataArray = _.flatten(_.pluck(this.series.chart.series, "data"));
            var self = this;
            _.each(dataArray, function(data) {
                if (data.name == self.name) {
                    data.setVisible(!data.visible);
                }
            });
        },

        _getLegendItemClickHandlerDisabled: function(event) {
            event.preventDefault();
        },

        getSquareSideLength: function(squaresCount, width, height) {
            // Test for invalid input.
            if (width * height < squaresCount) {
                return 0;
            }

            // Initial guess.
            var aspect = height / width;
            var xf = Math.sqrt(squaresCount / aspect);
            var yf = xf * aspect;
            var x = Math.max(1.0, Math.floor(xf));
            var y = Math.max(1.0, Math.floor(yf));
            var x_size = Math.floor(width / x);
            var y_size = Math.floor(height / y);
            var squareSideLength = Math.min(x_size, y_size);

            // Test our guess:
            x = Math.floor(width / squareSideLength);
            y = Math.floor(height / squareSideLength);
            // We guessed too high.
            if (x * y < squaresCount) {
                if (((x + 1) * y < squaresCount) && (x * (y + 1) < squaresCount)) {
                    // Case 2: the upper bound is correct compute the squareSideLength that will result in (x+1)*(y+1) tiles.
                    x_size = Math.floor(width / (x + 1));
                    y_size = Math.floor(height / (y + 1));

                    squareSideLength = Math.min(x_size, y_size);
                } else {
                    // Case 3: solve an equation to determine the final x and y dimensions and then compute
                    // the squareSideLength that results in those dimensions.
                    var test_x = Math.ceil(squaresCount / y);
                    var test_y = Math.ceil(squaresCount / x);
                    x_size = Math.min(Math.floor(width / test_x), Math.floor(height / y));
                    y_size = Math.min(Math.floor(width / x), Math.floor(height / test_y));

                    squareSideLength = Math.max(x_size, y_size);
                }
            }

            return squareSideLength;
        },

        computePieParams: function(pieNumber, squareSideLength, width, height, titleHeight, totalPiesNumber) {
            var paddingTop = 10;
            var globalPaddingTop = 5;

            var piesInRow = Math.min(Math.floor(width / squareSideLength), totalPiesNumber);
            var piesInColumn = Math.min(Math.floor(height / squareSideLength), totalPiesNumber);
            var widthGap = (width - squareSideLength * piesInRow) / piesInRow;
            var heightGap = (height - squareSideLength * piesInColumn) / piesInColumn;

            var xAxisPositionNumber = pieNumber % piesInRow == 0 ? piesInRow : pieNumber % piesInRow;
            var yAxisPositionNumber = Math.floor(pieNumber / piesInRow) + (pieNumber % piesInRow == 0 ? 0 : 1);

            var xAxisPosition = squareSideLength * xAxisPositionNumber - squareSideLength / 2 +
                widthGap * xAxisPositionNumber / 2;
            var yAxisPosition = squareSideLength * yAxisPositionNumber - squareSideLength / 2 +
                heightGap * yAxisPositionNumber / 2;

            var additionalSpaceCutFromPieSize = titleHeight + paddingTop;

            return {
                xAxisPositionPercent: 100 * (xAxisPosition - additionalSpaceCutFromPieSize / 2) / width,
                yAxisPositionPercent: 100 * (yAxisPosition + additionalSpaceCutFromPieSize / 2 + globalPaddingTop) / height,
                pieSizePercent: 100 * (squareSideLength - additionalSpaceCutFromPieSize) / width
            };
        },

        //
        //  keep track of the min and max measure values that we charted
        //
        measureMinMax: function(currVal) {
            if (currVal === null) {
                return;
            }

            if (HDM.measureMin === null) {
                HDM.measureMin = currVal;
                HDM.measureMax = currVal;
            } else {
                HDM.measureMin = Math.min(currVal, HDM.measureMin);
                HDM.measureMax = Math.max(currVal, HDM.measureMax);
            }
        },

        /**
         * Post Processing of the generated yAxis.
         *
         * For line or spline charts, highcharts can default to showing a negative y-axis tick even when all the
         * charted measures are greater than zero. We get around this by setting the y-axis 'min' property
         * if there are no negative measures.
         *
         * @param result
         */
        yAxisTickAdjust: function(result) {
            if (HDM.measureMin < 0)   return;
            if (result.yAxis) {
                var yAxes = _.isArray(result.yAxis) ? result.yAxis : [result.yAxis];

                if (HDM.measureMin != 0) {
                    // In case all measures have the same values chart's bars/lines may not be rendered.
                    // Because of that we should make minimal Y-axis value less then minimal data value.
                    HDM.measureMin--;
                }
                _.each(yAxes, function(yAxis) {
                    // do NOT overwrite any pre-existing 'min' value
                    if (!yAxis.min) {
                        yAxis.min = HDM.measureMin;
                        yAxis.startOnTick = true;
                    }
                });
            }
        },

        assembleFullGroupName: function(axisIndex, leafNode, groupLineBreaks, extraOptions)  {
            var chartType = extraOptions.chartState.chartType;
            var label = '';
            var nameArray = adhocDataProcessor.getLabelNameArray(axisIndex, leafNode);

            if (axisIndex == 1 && HDM.isScatterOrBubbleChart(chartType)) {
                // For Scatter and Bubble charts we should remove measure label.
                HDM._isMeasureFirst(extraOptions.metadata) ? nameArray.pop() : nameArray.shift();
            }

            // exclude single measure labels from array
            if (
                    !extraOptions.chartState.showSingleMeasuresLabels &&
                    extraOptions.metadata.measures.length === 1 &&
                    extraOptions.metadata.measureAxis === axisIndex
                ) {
                nameArray = nameArray.reverse();
                for (var i = 0, l = extraOptions.metadata.axes[extraOptions.metadata.measureAxis].length; i < l; i++) {
                    if (extraOptions.metadata.axes[extraOptions.metadata.measureAxis][i].dimension === "Measures") {
                        i < nameArray.length ? nameArray.splice(i, 1) : nameArray.pop();
                    }
                }
                nameArray = nameArray.reverse();
                if (!nameArray.length) {
                    nameArray.push(" ");
                }
            }

            var lineBreaker = '<br>';
            if (HDM.isBarChart(chartType)) {
                nameArray = nameArray.reverse();
                lineBreaker = ", ";
            } else if (HDM.isScatterOrBubbleChart(chartType)) {
                lineBreaker = ", ";
            }
            var len = nameArray.length;

            for (var j=0; j < len; j++) {
                label = label + nameArray[j];
                if (j < (len - 1))  {
                    if (groupLineBreaks) {
                        label = label + lineBreaker;
                    }
                    else {
                        label = label + ', ';
                    }
                }
            }

            //  grouped hierarchy labels are for x axis only
            if(axisIndex == 0 && len > 1) {
                HDM.groupedCategories = true;
                HDM.addLeaf2HighchartsCategory(nameArray);
            }

            return label;
        },

        assembleFullGroupHierarchyName: function(axisIndex, leafNode, extraOptions)  {
            return HDM.assembleFullGroupName(axisIndex, leafNode, true, extraOptions);
        },

        assembleFullGroupLinearName: function(axisIndex, leafNode, extraOptions)  {
            return HDM.assembleFullGroupName(axisIndex, leafNode, false, extraOptions);
        },

        addLeaf2HighchartsCategory: function(nameArray) {
            if (HDM.highchartsCategories == null ) HDM.highchartsCategories = [];

            if (nameArray.length <= 1) {
                HDM.highchartsCategories.push(nameArray[0]);
                return;
            }
            var currCategory = HDM.highchartsCategories;

            for (var i=(nameArray.length-1); i>=0; i--) {
                var name = nameArray[i];
                if (i==0) {
                    currCategory.push(name);
                    return;
                }
                var theCategory = null;

                for (var j=0; j<currCategory.length; j++) {
                    if (currCategory[j].name === nameArray[i]) {
                        theCategory = currCategory[j];
                    }
                }
                if (theCategory == null) {
                    theCategory =
                    {
                        name: nameArray[i],
                        categories: []
                    };
                    currCategory.push(theCategory);
                }
                currCategory = theCategory.categories;
            }
        },

        getDataValue: function(rowLeaf, columnLeaf, returnNullValues) {
            var value = adhocDataProcessor.getDataFromRowColumn(rowLeaf, columnLeaf);

            if (returnNullValues) {
                return value;
            } else {
                return value == null ? 0 : value;
            }
        }
    });

    /**
     * Private utility methods.
     */
    _.extend(HDM, {
        _isTooltipFollowPointerEnabled: function(chartType) {
            return !_.contains([
                "line",
                "spline",
                "area",
                "stacked_area",
                "percent_area",
                "spline_area",
                "line_time_series",
                "spline_time_series",
                "area_time_series",
                "spline_area_time_series",
                "pie",
                "dual_level_pie",
                "heat_map",
                "heat_map_time_series"
            ], chartType);
        },
        _isMeasureFirst: function(metadata) {
            var measureAxisArray = metadata.axes[metadata.measureAxis];

            return measureAxisArray.length > 0 && measureAxisArray[0].dimension == "Measures";
        }
    });

    /**
     * Public utility methods. Should be exported when converted to AMD.
     */
    _.extend(HDM, {
        isDualOrMultiAxisChart: function(chartType) {
            return HDM.isDualAxisChart(chartType) || HDM.isMultiAxisChart(chartType);
        },

        isDualLevelPieChart: function(chartType) {
            return chartType === "dual_level_pie";
        },

        isSpiderChart: function(chartType) {
            return _.contains([
                "spider_column",
                "spider_line",
                "spider_area"
            ], chartType);
        },

        isDualAxisChart: function(chartType) {
            return _.contains([
                "column_line",
                "column_spline",
                "stacked_column_line",
                "stacked_column_spline"
            ], chartType);
        },

        isMultiAxisChart: function(chartType) {
            return _.contains([
                "multi_axis_line",
                "multi_axis_spline",
                "multi_axis_column"
            ], chartType);
        },

        isScatterChart: function(chartType) {
            return _.contains([
                "scatter"
            ], chartType);
        },

        isBubbleChart: function(chartType) {
            return _.contains([
                "bubble"
            ], chartType);
        },

        isScatterOrBubbleChart: function(chartType) {
            return HDM.isScatterChart(chartType) || HDM.isBubbleChart(chartType);
        },

        isBarChart: function(chartType) {
            return chartType.indexOf("bar") != -1;
        },

        isHeatMapChart: function(chartType) {
            return chartType === "heat_map";
        },

        isHeatMapTimeSeriesChart: function(chartType) {
            return chartType === "heat_map_time_series";
        }
/*
        isSpeedometerChart: function(chartType) {
            return chartType === "speedometer";
        },

        isArcGaugeChart: function(chartType) {
            return chartType === "arc_gauge";
        }*/
    });

    /**
     * Type routing and highcharts options generation entry point.
     */
    _.extend(HDM, {
        /**
         * Generates highcharts options.
         *
         * @param type JRS chart type.
         * @param dataProcessorRow data processor row.
         * @param dataProcessorCol data processor column.
         * @param extraOptions extra options.
         * @returns {*}
         */
        getHighchartsOptions: function(type, dataProcessorRow, dataProcessorCol, extraOptions) {
            var highchartsOptions =  HDM.typeToOptionsMap[type](dataProcessorRow, dataProcessorCol, extraOptions);

            HDM.defaultPlotShadow(highchartsOptions, !HDM.isDualLevelPieChart(type) && !HDM.isHeatMapChart(type) && !HDM.isBubbleChart(type));

            var truncateCategories = function(categories) {
                var categoryLength = HDM.isSpiderChart(type) || HDM.isBarChart(type) ? 150 : 29;

                if (categories.length > 0 ) {
                    if (_.isObject(categories[0])) {
                        _.each(categories, function(category) {
                            category.name = category.name.substring(0, categoryLength);

                            if (category.categories) {
                                truncateCategories(category.categories);
                            }
                        });
                    } else {
                        for (var i = 0; i < categories.length; i++) {
                            categories[i] = categories[i].substring(0, categoryLength);
                        }
                    }
                }
            };

            _.each(["xAxis", "yAxis"], function(axisName) {
                var axes = _.isArray(highchartsOptions[axisName]) ? highchartsOptions[axisName] :
                    [highchartsOptions[axisName]];

                _.each(axes, function(axis) {
                    if (axis && axis.categories) {
                        truncateCategories(axis.categories);
                    }
                });
            });

            // setup top padding for rotated labels #36936
            if (HDM.isSpiderChart(type)) {
                highchartsOptions.chart.spacingTop = (highchartsOptions.xAxis.categories[0].split("<br>").length - 1) * 1.8;
                highchartsOptions.chart.spacingTop *= 8 * (1 + Math.abs(Math.sin((highchartsOptions.xAxis.labels.rotation || 0 )* Math.PI / 180)));
            }

            highchartsOptions.colors = HDM.colors;
            return highchartsOptions;
        },

        //setup default shadows for plotting
        defaultPlotShadow : function(highchartsOptions, shadowOptions){

            var plotOptions = highchartsOptions.plotOptions,
                chartType = highchartsOptions.chart ?  highchartsOptions.chart.type : undefined,
                chartTypes = !chartType ? [] : [chartType];

            if (chartTypes.length == 0){
                chartTypes = _.pluck(highchartsOptions.series, "type");
            }

            if (!plotOptions){
                plotOptions = {};
            }

            _.each(chartTypes, function(type){
                if (!plotOptions[type]){
                    plotOptions[type] = {};
                }
                plotOptions[type].shadow = shadowOptions;
            });

        },

        // Chart type routing.
        typeToOptionsMap: {
            column: function(rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
            },

            stacked_column: function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.stacking = "normal";

                return result;
            },

            percent_column:  function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.stacking = "percent";

                return result;
            },

            bar:  function(rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
            },

            stacked_bar:  function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.stacking = "normal";

                return result;
            },

            percent_bar:   function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.stacking = "percent";

                return result;
            },

            spider_column: function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.pointPlacement = "on";

                return result;
            },

            line:   function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },

            area: function(rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
            },

            spline_area: function(rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
            },

            stacked_area:  function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.stacking = "normal";

                return result;
            },

            percent_area:  function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.stacking = "percent";

                return result;
            },

            spider_line: function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.pointPlacement = "on";

                return result;
            },

            spider_area: function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.pointPlacement = "on";

                return result;
            },

            pie: function(rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.PIE, rowIndex, columnIndex, extraOptions);
            },

            dual_level_pie: function(rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.DUAL_LEVEL_PIE, rowIndex, columnIndex, extraOptions);
            },

            spline:   function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },

            // Time series types mappers.
            line_time_series: function(rowIndex, columnIndex, extraOptions) {
                extraOptions.isTimeSeries = true;

                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },
            spline_time_series: function(rowIndex, columnIndex, extraOptions) {
                extraOptions.isTimeSeries = true;

                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },
            area_time_series: function(rowIndex, columnIndex, extraOptions) {
                extraOptions.isTimeSeries = true;

                return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
            },
            spline_area_time_series: function(rowIndex, columnIndex, extraOptions) {
                extraOptions.isTimeSeries = true;

                return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
            },

            column_line: function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },

            column_spline: function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },

            stacked_column_line: function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.stacking = "normal";
                HDM.yAxisTickAdjust(result);

                return result;
            },

            stacked_column_spline: function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.stacking = "normal";
                HDM.yAxisTickAdjust(result);

                return result;
            },

            multi_axis_line: function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },

            multi_axis_spline: function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },

            multi_axis_column: function(rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
            },

            scatter: function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },

            bubble: function(rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
            },
/*
            scatter_line: function(rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },
*/
            heat_map: function(rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.HEAT_MAP, rowIndex, columnIndex, extraOptions);
            },

            heat_map_time_series: function(rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.HEAT_MAP_TIME_SERIES, rowIndex, columnIndex, extraOptions);
            }
/*
            speedometer: function(rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
            },

            arc_gauge: function(rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
            }
*/
        },

        adHocToHighchartsChartTypeMap: adhocToHcTypeMap,

        getDualOrMultiAxisHighchartsType: function(chartType, isLastSeries) {
            var highchartsType;

            var dualAxisType = {
                column_line: 'column',
                column_spline: 'column',
                stacked_column_line: 'column',
                stacked_column_spline: 'column'
            };
            var dualAxisLastSeriesType = {
                column_line: 'line',
                column_spline: 'spline',
                stacked_column_line: 'line',
                stacked_column_spline: 'spline'
            };
            var multiAxisType = {
                multi_axis_line: 'line',
                multi_axis_spline: 'spline',
                multi_axis_column: 'column'
            };

            if (HDM.isDualAxisChart(chartType)) {
                highchartsType = isLastSeries ? dualAxisLastSeriesType[chartType] : dualAxisType[chartType];
            } else if (HDM.isMultiAxisChart(chartType)) {
                highchartsType = multiAxisType[chartType];
            } else {
                throw "Unsupported chart type [chartType=" + chartType + "]";
            }

            return highchartsType;
        }
    });

    return {
        getHighchartsOptions: HDM.getHighchartsOptions,

        // Utility methods.
        isDualOrMultiAxisChart: HDM.isDualOrMultiAxisChart,
        isDualAxisChart: HDM.isDualAxisChart,
        isMultiAxisChart: HDM.isMultiAxisChart,
        isScatterChart: HDM.isScatterChart,
        isBubbleChart: HDM.isBubbleChart,
        isScatterOrBubbleChart: HDM.isScatterOrBubbleChart,
        isBarChart: HDM.isBarChart,
        isSpiderChart: HDM.isSpiderChart,
        isDualLevelPieChart: HDM.isDualLevelPieChart,
        isHeatMapChart: HDM.isHeatMapChart,
        isHeatMapTimeSeriesChart: HDM.isHeatMapTimeSeriesChart,
        //isSpeedometerChart: HDM.isSpeedometerChart,
        //isArcGaugeChart: HDM.isArcGaugeChart,

        // Protected methods.
        _getLegendItemClickHandler: HDM._getLegendItemClickHandler,
        _getLegendItemClickHandlerDisabled: HDM._getLegendItemClickHandlerDisabled,

        // TODO refactoring
        _HDM: HDM
    };
}, this));

