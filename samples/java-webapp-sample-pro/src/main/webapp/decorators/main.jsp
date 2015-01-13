<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>

<%@ taglib uri="http://www.opensymphony.com/sitemesh/decorator" prefix="decorator" %>
<html>
<head>
    <title><decorator:title/></title>
    <decorator:head/>
</head>
<body>
    <h1>
        <center>JasperServer Web Services Sample</center>
    </h1>
    <hr>
    <div>
        <center>
            <a href="${pageContext.request.contextPath}/listReports.jsp">Home</a> |
            <a href="${pageContext.request.contextPath}/authority/user">Users</a> |
            <a href="${pageContext.request.contextPath}/authority/role">Roles</a> |
            <a href="${pageContext.request.contextPath}/mt/tenants">Organizations</a> |
            <a href="${pageContext.request.contextPath}/index.jsp">Log out</a>
        </center>
    </div>
    <br>
    <div>
        <br>
        <center>
            <decorator:body/>
        </center>
    </div>
    <br>
    <%--<hr>--%>
    <%--<a href="index.jsp">Exit</a>--%>
</body>
</html>
