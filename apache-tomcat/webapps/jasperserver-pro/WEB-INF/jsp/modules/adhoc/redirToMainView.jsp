<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<%@ page contentType="text/html" %>

<!-- purpose of this jsp is simply to redirect to the Ad Hoc main editor page if you start the adhocFlow from repository
     this is so that refresh (or change mode) doesn't wipe out data -->
<script>
// todo: integrate this w/ renamed stuff in flow


window.onload = function() {
    this.location.href = '${pageContext.request.contextPath}/flow.html' +
        '?_flowId=adhocFlow' +
        '&_eventId=initForExistingReport' +
        '&_flowExecutionKey=${flowExecutionKey}' +
        <c:if test="${param.decorate == 'no'}">'&decorate=no' + </c:if>
        '&viewReport=${viewReport}';
}
</script>
