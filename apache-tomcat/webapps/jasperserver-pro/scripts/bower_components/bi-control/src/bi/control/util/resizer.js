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
 * @author: Pavel Savushchik
 * @version: $Id: resizer.js 84 2014-10-28 19:22:16Z inesterenko $
 */

define(function(require) {

	var $ui = require("jquery.ui");

    return {
        createSizer: function($el, $sizer, options) {
            $sizer.removeClass('hidden')
                .addClass("ui-resizable-" + options.axis)
                .css("cursor", "row-resize");

            var settings = {
                handles: {}
            };
            settings.handles[options.axis] = $sizer;

            switch (options.axis) {
                case "s": settings["min-height"] = $el.height(); break;
                case "e": settings["min-width"] = $el.height(); break;
            }
            settings["max-height"] = options["max-height"];

	        $ui($el[0]).resizable(settings);
        }
    };
});
