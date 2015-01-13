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
 * @version $Id: jive.crosstab.interactive.js 2803 2014-10-28 20:05:30Z inesterenko $
 */

define(["jquery.ui", "text!jr.jive.crosstab.templates.tmpl", "text!jr.jive.i18n.tmpl"], function($, templates, jivei18nText) {
    var jivei18n = JSON.parse(jivei18nText),
        i18nfn = function (key) {
            if (jivei18n.hasOwnProperty(key)) {
                return jivei18n[key];
            } else {
                return key;
            }
        };

    var ixt = {
        initialized: false,
        selected: null,
        init: function(report) {
            var ic = this;
            this.reportId = report.id;
            this.scaleFactor = 1;

            $.each(report.components.crosstab, function() {
                ic.initCrosstab(this, report);
            });
        },
        scale: function(scaleFactor){
            this.scaleFactor = scaleFactor;
            if(this.selected){
                if(this.selected.header.hasClass("jrxtcolheader")){
                    this.selectDataColumn(this.selected.crosstab, this.selected.cell);
                } else {
                    this.selectRowGroup(this.selected.crosstab, this.selected.cell);
                }
            }
        },
        createComponents: function() {
            var ic = this;

            this.$jiveComponents = $("<div/>", { id: "jivext_components" });

            $('body').append(this.$jiveComponents);
            this.$jiveComponents.empty();
            this.$jiveComponents.append(templates);

            ic.getReportContainer(this.reportId).on('click touchend', function(){
                ic.hide();
                //TODO lucianc
                //$('body').trigger('jive.inactive');
            });
        },
        actions: {
            sortAscending: {icon: 'sortAscIcon', title: i18nfn('column.sortasc.title'), fn:'sort', arg: 'ASCENDING'},
            sortDescnding: {icon: 'sortDescIcon', title: i18nfn('column.sortdesc.title'), fn: 'sort', arg: 'DESCENDING'}
        },
        initCrosstab: function(crosstab) {
            this.crosstabElement = ixt.getReportContainer(ixt.reportId);
            this.crosstab = crosstab;
            this.crosstabElement.on('click touchend', 'td.jrxtcolheader[data-jrxtid=\'' + crosstab.getFragmentId() + '\']', this._onClick);
            this.crosstabElement.on('click touchend', 'td.jrxtdatacell[data-jrxtid=\'' + crosstab.getFragmentId() + '\']', this._onClick);
            this.crosstabElement.on('click touchend', 'td.jrxtrowheader[data-jrxtid=\'' + crosstab.getFragmentId() + '\']', this._onClick);
        },

        _onClick: function(e){
            if(!$(e.target).parent().is('a')) {
                var axis = $(e.currentTarget).hasClass("jrxtrowheader") ? "RowGroup" : "DataColumn";
                ixt.reportId = $(e.delegateTarget).closest(".visualizejs._jr_report_container_").attr("data-reportId");
                !ixt.$jiveComponents && ixt.createComponents();
                ixt["select" + axis](ixt.crosstab, $(this));
                return false;
            }
        },

        selectDataColumn: function(crosstab, cell) {
            var columnIdx = cell.data('jrxtcolidx');
            var fragmentId = cell.data('jrxtid');
            var parentTable = cell.parents("table:first");
            var firstHeader = $('td.jrxtcolheader[data-jrxtid=\'' + fragmentId + '\'][data-jrxtcolidx=\'' + columnIdx + '\']:first', parentTable);
            var lastCell = $('td.jrxtdatacell[data-jrxtid=\'' + fragmentId + '\'][data-jrxtcolidx=\'' + columnIdx + '\']:last', parentTable);

            var width = lastCell.offset().left + lastCell.outerWidth() - firstHeader.offset().left;
            var height = lastCell.offset().top + lastCell.outerHeight() - firstHeader.offset().top;

            ixt.selected = {crosstab: crosstab, header: firstHeader, cell:cell};
            ixt.overlay.show({w: width, h: height, zoom:this.scaleFactor});

            var columnIdx = firstHeader.data('jrxtcolidx');
            var sortingEnabled = crosstab.isDataColumnSortable(columnIdx);
            ixt.foobar.show(sortingEnabled);
        },
        selectRowGroup: function(crosstab, cell) {
            var columnIdx = cell.data('jrxtcolidx');
            var fragmentId = cell.data('jrxtid');
            var headers = $('td.jrxtrowheader[data-jrxtid=\'' + fragmentId + '\'][data-jrxtcolidx=\'' + columnIdx + '\']', cell.parents("table:first"));
            var firstHeader = $(headers[0]);
            var lastHeader = $(headers[headers.length - 1]);

            var width = lastHeader.offset().left + lastHeader.outerWidth() - firstHeader.offset().left;
            var height = lastHeader.offset().top + lastHeader.outerHeight() - firstHeader.offset().top;

            ixt.selected = {crosstab: crosstab, header: firstHeader, cell: cell};
            ixt.overlay.show({w: width, h: height, zoom:this.scaleFactor});
            ixt.foobar.show(true);
        },
        overlay: {
            jo: null,
            show: function(dim) {
                var isFirstTimeSelection = !this.jo || !this.jo.length;
                isFirstTimeSelection && (this.jo = $('#jivext_overlay'));

                this.jo.css({
                    width: dim.w * (dim.zoom ? dim.zoom : 1),
                    height: dim.h
                });
                this.jo.appendTo(ixt.getReportContainer(ixt.reportId)).show();
                this.jo.position({of:ixt.selected.header, my: 'left top', at:'left top',collision:'none'});

                isFirstTimeSelection && this.jo.position({of:ixt.selected.header, my: 'left top', at:'left top',collision:'none'});
            },
            remove: function() {
                this.jo.remove();
                this.jo = null;
            }
        },
        foobar: {
            jo: null,
            initialWidth: 0,
            cache: null,
            setElement: function() {
                this.jo = $('#jivext_foobar');
                this.jo.on('mousedown touchstart','button',function(evt){
                    var jo = $(this);
                    !jo.hasClass('disabled') && jo.addClass('pressed');
                    return false;
                });
                this.jo.on('mouseup touchend','button',function(evt){
                    var jo = $(this);
                    jo.removeClass('pressed');
                    var fn = jo.attr('fn');

                    if(fn && !jo.hasClass('disabled')){
                        ixt[fn](ixt.actions[jo.attr('actionkey')].arg);
                    }
                    return false;
                });
                this.jo.on('mouseover','button',function(){
                    var jo = $(this);
                    !jo.hasClass('disabled') && jo.addClass('over');
                });
                this.jo.on('mouseout','button',function(){
                    $(this).removeClass('over pressed');
                });
                this.cache = null;
                this.menus = {};
            },
            show:function(enabled){
                var isFirstTimeSelection = !this.jo || !this.jo.length;
                isFirstTimeSelection && this.setElement();
                this.render(ixt.actions);
                this.jo.find('button').removeClass('over pressed disabled');
                enabled || this.jo.find('button').addClass('disabled');
                this.jo.appendTo(ixt.getReportContainer(ixt.reportId)).show();
                isFirstTimeSelection && (this.initialWidth = this.jo.width());
                var top = this.jo.outerHeight() - 1;
                this.jo.position({of:ixt.selected.header, my: 'left top-' + top, at:'left top'});
                isFirstTimeSelection && this.jo.position({of:ixt.selected.header, my: 'left top-' + top, at:'left top'});
                this.jo.width() >= this.initialWidth || this.jo.width(this.initialWidth);
            },
            render: function(actionMap){
                var it = this;
                var tmpl = [
                    '<button class="jivext_foobar_button" title="',,'" actionkey="',,'" ',
                    ,'><span class="wrap"><span class="icon ',,'"></span></span></button>'];
                if(!it.cache) {
                    it.cache = '';
                    var htm;
                    $.each(actionMap,function(k,v){
                        tmpl[1] = v.title;
                        tmpl[3] = k;
                        tmpl[5] = v.fn ? 'fn="'+v.fn+'"' : v.actions ? 'menu="'+k+'"' : '';
                        tmpl[7] = v.icon;
                        it.cache += tmpl.join('');
                    });

                    it.jo.empty();
                    it.jo.html(it.cache);
                }
            },
            reset: function() {
                this.cache = null;
                this.menus = {};
            },
            remove: function() {
                this.reset();
                this.jo.off().remove();
                this.jo = null;
            }
        },
        getReportContainer: function() {
            return $('table.jrPage').closest('div.body');
        },
        hide: function() {
            ixt.overlay.jo && ixt.overlay.jo.appendTo(this.$jiveComponents).hide();
            ixt.foobar.jo && ixt.foobar.jo.appendTo(this.$jiveComponents).hide();
        },
        sort: function(order) {
            this.hide();
            if (this.selected.header.hasClass('jrxtcolheader')) {
                var columnIdx = this.selected.header.data('jrxtcolidx');
                var sortOrder = order;
                if (sortOrder == this.selected.crosstab.getColumnOrder(columnIdx)) {
                    sortOrder = 'NONE';
                }
                this.selected.crosstab.sortByDataColumn(columnIdx, sortOrder);
            } else if (this.selected.header.hasClass('jrxtrowheader')) {
                var rowGroupIdx = this.selected.header.data('jrxtcolidx');
                var sortOrder = order;
                if (sortOrder == this.selected.crosstab.config.rowGroups[rowGroupIdx].order) {
                    sortOrder = 'NONE';
                }
                this.selected.crosstab.sortRowGroup(rowGroupIdx, sortOrder);
            }
        },
        remove: function(report) {
            var $jiveExtContainer = $("[data-reportId = '" + report.id + "']");
            this.$jiveComponents = this.$jiveComponents || $("<div/>");

            if ($jiveExtContainer.find(this.overlay.jo).length || this.$jiveComponents.find(this.overlay.jo).length) {
                this.overlay.remove();
                this.foobar.remove();
            }

            $jiveExtContainer.off('click touchend').find('table.jrPage').off('click touchend');
            this.$jiveComponents.remove();
            this.$jiveComponents = null;
        }
    };

    return ixt;
});