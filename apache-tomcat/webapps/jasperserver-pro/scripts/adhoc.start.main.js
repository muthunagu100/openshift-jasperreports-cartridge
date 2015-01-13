/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
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
 * @version: $Id: adhoc.start.main.js 21 2014-07-25 09:57:36Z inesterenko $
 */


define(function (require) {
    "use strict";

    var $ = require("jquery"),
        DatachooserDialog = require("adhoc/datachooser/view/DatachooserDialogView");

    // temporary fix to make sure that overrides_custom.css is loaded after all other CSS files
    $("link[href*='overrides_custom.css']").remove();

    require(["!domReady", "css!overrides_custom.css"], function(){
        var datachooserDialog = new DatachooserDialog();

        datachooserDialog.open();
    });
});