<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>

<script id="adHocConstants" type="text/javascript">
    __jrsConfigs__.adhoc.adhocDesigner = __jrsConfigs__.adhoc.adhocDesigner || {};
    __jrsConfigs__.adhoc.adhocDesigner.ROW_SIZE_TO_TRIGGER_SCROLLBAR = ${viewModel.rowSizeToTriggerScrollbar};
    __jrsConfigs__.adhoc.adhocDesigner.DATE_FORMAT = "${viewModel.dateFormat}";
    __jrsConfigs__.adhoc.adhocDesigner.CALENDAR_DATE_FORMAT = "${viewModel.calendarDateFormat}";
    __jrsConfigs__.adhoc.adhocDesigner.VALIDATION_DATE_PATTERN = new RegExp(${viewModel.validationDatePattern});
    __jrsConfigs__.adhoc.adhocDesigner.CALENDAR_TIME_FORMAT = "${viewModel.calendarTimeFormat}";
    __jrsConfigs__.adhoc.adhocDesigner.VALIDATION_DATETIME_PATTERN = new RegExp(${viewModel.validationDateTimePattern});
</script>
