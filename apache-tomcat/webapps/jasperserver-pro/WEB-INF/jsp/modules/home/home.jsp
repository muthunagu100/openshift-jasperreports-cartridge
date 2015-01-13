<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>
<%@ page contentType="text/html" %>

<%@ taglib uri="/spring" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="authz"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<authz:authorize ifAllGranted="ROLE_DEMO">
    <%--
        We have special home page for demo user only on PostgreSQL db.
        For other DB's it have same home page as other users.
    --%>
    <c:if test="${demoHomeResourceExists}">
        <jsp:include page="homeForDemo.jsp"/>
    </c:if>
    <c:if test="${not demoHomeResourceExists}">
        <jsp:include page="homeForNonDemo.jsp"/>
    </c:if>
</authz:authorize>
<authz:authorize ifNotGranted="ROLE_DEMO">
    <jsp:include page="homeForNonDemo.jsp"/>
</authz:authorize>

