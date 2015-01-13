<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>

<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<script type="text/javascript">

    var dashboardViewFrame = {};
    dashboardViewFrame.flowExecutionKey = '${flowExecutionKey}';

    // store values rendered on server side for future usage in module
    __jrsConfigs__.dashboardDesignerFrame = {};
    __jrsConfigs__.dashboardDesignerFrame.reportRequestParams = JSON.parse('<%= StringEscapeUtils.escapeJavaScript( String.valueOf(pageContext.findAttribute("allRequestParameters"))) %>');

    <c:if test="${isAdhocReportUnit == null || isAdhocReportUnit == 'false'}">
    __jrsConfigs__.dashboardDesignerFrame.isAdhocReportUnit = false;
    </c:if>
    <c:if test="${isAdhocReportUnit != null && isAdhocReportUnit == 'true'}">
    __jrsConfigs__.dashboardDesignerFrame.isAdhocReportUnit = true;
    </c:if>

    __jrsConfigs__.dashboardDesignerFrame.fid = '${param.fid}';
</script>
