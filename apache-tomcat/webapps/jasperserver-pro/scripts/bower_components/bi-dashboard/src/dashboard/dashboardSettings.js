/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id: dashboardSettings.js 1025 2014-11-13 20:12:23Z obobruyko $
 */

define({
    VISUALIZE_MODE: false,

    GRID_WIDTH: 40,
    GRID_HEIGHT: 30,
    COMPONENT_ID_ATTRIBUTE: "data-componentId",
    DASHLET_TEMPLATE: "<div data-componentId='([\\w\\d]+)' data-x='(\\d+)' data-y='(\\d+)' data-width='(\\d+)' data-height='(\\d+)'></div>",
    DEFAULT_FOUNDATION_ID: "default",
    DEFAULT_FOUNDATION_COMPONENTS_ID: "components",
    DEFAULT_FOUNDATION_LAYOUT_ID: "layout",
    DEFAULT_FOUNDATION_WIRING_ID: "wiring",
    DEFAULT_FOUNDATION_PROPERTIES_ID: "properties",
    DASHBOARD_PROPERTIES_COMPONENT_ID: "DashboardProperties",

    // default dashboard settings
    DASHBOARD_DIMMER_Z_INDEX: 9999,
    DASHBOARD_PARAMETER_MAX_NAME_LENGTH: 256,
    DASHLET_MARGIN: 5,
    DASHLET_PADDING: 5,
    DASHLET_BORDER: true,
    DASHLET_MAX_MARGIN: 20,
    DASHLET_MIN_MARGIN: 0,
    DASHLET_MAX_PADDING: 20,
    DASHLET_MIN_PADDING: 0,
    DASHBOARD_AUTO_REFRESH: false,
    DASHBOARD_REFRESH_INTERVAL_TIME_UNIT_MINUTES: 1,
    DASHBOARD_REFRESH_INTERVAL_TIME_UNIT_DEFAULT_MINUTES: 5,
    DASHBOARD_REFRESH_INTERVAL_TIME_UNIT_SECONDS: 15,
    DASHBOARD_REFRESH_INTERVAL_UNIT: "minute",
    DASHBOARD_CONTAINER_HEIGHT: 400,

    //properties dialog settings
    DASHLET_SCROLL: true,
    DASHLET_PROPERTIES_DIALOG_CLASS: "dashboardLevelPropertiesDialog",
    DASHLET_SHOW_TITLE_BAR: true,
    DASHLET_SCALE_TO_FIT: "width",
    DASHLET_AUTO_REFRESH: false,
    DASHLET_REFRESH_INTERVAL_TIME_UNIT_MINUTES: 1,
    DASHLET_REFRESH_INTERVAL_TIME_UNIT_DEFAULT_MINUTES: 5,
    DASHLET_REFRESH_INTERVAL_TIME_UNIT_SECONDS: 15,
    DASHLET_SHOW_REFRESH_BUTTON: false,
    DASHLET_SHOW_MAXIMIZE_BUTTON: true,
    DASHLET_TEXT_ALIGNMENT: 'left',
    DASHLET_TEXT_BOLD: false,
    DASHLET_TEXT_ITALIC: false,
    DASHLET_TEXT_SIZE: 12,
    DASHLET_MIN_FONT_SIZE: 8,
    DASHLET_TEXT_FONT: "Arial",
    DASHLET_TEXT_COLOR: "rgb(102, 102, 102)",
    DASHLET_TEXT_BACKGROUND_COLOR: "rgba(0, 0, 0, 0)",
    DASHLET_FILTERS_PER_ROW: 1,
    DASHLET_BUTTONS_POSITION: "bottom",
    DASHLET_FILTER_APPLY_BUTTON: true,
    DASHLET_FILTER_RESET_BUTTON: false,
    DASHLET_FILTERS_PER_ROW_MIN: 1,
    DASHLET_FILTERS_PER_ROW_MAX: 16,
    DASHLET_WEBPAGE_VIEW_DEFAULT_URL: "http://",
    DASHLET_ID_VALID_WORD_PATTERN: "\\w",
    DASHLET_ID_BLACK_LIST_CHARS_PATTERN: "[^_\\w]",
    //context menu settings
    CONTEXT_MENU_CLASS: "menu",

    //dashlet toolbar settings
    DASHLET_TOOLBAR_MINIMIZE_BUTTON_CLASS: "minimizeDashlet",


    //save as dialog settings
    SAVE_AS_DIALOG_CLASS: "saveAs",
    SAVE_AS_DIALOG_MIN_WIDTH: 440,
    SAVE_AS_DIALOG_MIN_HEIGHT: 520,

    // Iframe
    DASHBOARD_ADHOC_IFRAME_MARGIN: 15,
    DASHBOARD_ADHOC_IFRAME_Z_INDEX: 9999,

    //sidebar settings
    SIDEBAR_MIN_WIDTH: 200,
    SIDEBAR_MAX_WIDTH: 1300,

    //dashboard overlay
    DASHBOARD_OVERLAY_TIMEOUT: 800,

    //AdHoc view
    EMBEDDED_ADHOC_VIEW_TEMP_LOCATION: "/temp",

    // seconds before session expiration warning displays
    TIMEOUT_WARNING_DELAY: 120
});