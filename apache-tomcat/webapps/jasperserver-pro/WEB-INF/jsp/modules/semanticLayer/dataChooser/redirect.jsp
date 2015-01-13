<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<html>
<head>
    <script type="text/javascript">
    <c:choose>
        <c:when test='${ParentFolderUri != null}'>
            window.location.href = "flow.html?_flowId=searchFlow&lastMode=true";
        </c:when>
        <c:otherwise>
            window.location.href = "flow.html?_flowId=queryBuilderFlow&decorate=<c:out value="${param.decorate}"/>&_flowExecutionKey=<c:out value="${flowExecutionKey}"/>&_eventId=finishWizard&selectedReportType=<c:out value="${reportType}"/>&realm=<c:out value="${sessionScope['slReportUri']}"/>";
        </c:otherwise>
    </c:choose>
    </script>
</head>
<body>Redirecting...</body>
</html>