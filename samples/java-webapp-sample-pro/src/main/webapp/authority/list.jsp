<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<c:choose>
    <c:when test="${viewMode == 'user'}">
    <head>
        <title>User list</title>
    <script type="text/javascript">
        function doAction(username, tenantId, action) {
            document.getElementById('action').value = action;
            document.getElementById('username').value = username;
            document.getElementById('tenantId').value = tenantId;
            document.getElementById('actionForm').submit();
        }
    </script>
    </head>

    <body>
    <form id="actionForm" name="actionForm" action="user" method="POST">
        <input type="hidden" name="action" id="action" value="" />
        <input type="hidden" name="username" id="username" value="" />
        <input type="hidden" name="tenantId" id="tenantId" value="" />
    </form>

    <form name="searchForm" action="user" method="GET">
        <input type="text" name="searchName" value="${searchName}" size="30"/>
        <input type="submit" name="search" value="Search" title="Search"/>
    </form>
    </c:when>
    <c:when test="${viewMode == 'role'}">
    <head>
        <title>Role list</title>
        <script type="text/javascript">
            function doAction(roleName, tenantId, action) {
                document.getElementById('action').value = action;
                document.getElementById('roleName').value = roleName;
                document.getElementById('tenantId').value = tenantId;
                document.getElementById('actionForm').submit();
            }
        </script>
    </head>

    <body>
    <form id="actionForm" name="actionForm" action="role" method="POST">
        <input type="hidden" name="action" id="action" value="" />
        <input type="hidden" name="roleName" id="roleName" value="" />
        <input type="hidden" name="tenantId" id="tenantId" value="" />
    </form>

    <form name="searchForm" action="role" method="GET">
        <input type="text" name="searchName" value="${searchName}" size="30"/>
        <input type="submit" name="search" value="Search" title="Search"/>
    </form>

    </c:when>
</c:choose>

<div>Current organization: <b>${tenant.tenantId}</b></div>
<c:if test="${tenant.tenantUri != '/'}">
    <a href="?action=show&tenantId=${tenant.parentId}">[..]</a><br>
</c:if>

<table cellspacing="2" cellpadding="2" border="1">
    <thead>
        <tr>
            <td>Organizations</td>
        </tr>
    </thead>
    <tbody>
    <c:choose>
        <c:when test="${empty tenants}">
            <tr>
                <td>No nested organizations</td>
            </tr>
        </c:when>
        <c:otherwise>
            <c:forEach var="tenant" items="${tenants}">
                <tr>
                    <td title="${tenant.tenantId}"><a href="?tenantId=${tenant.tenantId}">${tenant.tenantName}</a></td>
                </tr>
            </c:forEach>
        </c:otherwise>
    </c:choose>
    </tbody>
</table>
<br/>

    <c:choose>
        <c:when test="${not empty users}">
            <jsp:include page="users.jsp"/>
        </c:when>
        <c:when test="${not empty roles}">
            <jsp:include page="roles.jsp"/>
        </c:when>
        <c:otherwise>
            <table>
                <tbody>
                    <tr><td><i>No results found.</i></td></tr>
                </tbody>
            </table>
        </c:otherwise>
    </c:choose>
    <c:choose>
        <c:when test="${viewMode == 'user'}">
            <a href="#" onclick="doAction('', '${tenant.tenantId}', 'edit');">[ Add User ]</a>
        </c:when>
        <c:when test="${viewMode == 'role'}">
            <a href="#" onclick="doAction('', '${tenant.tenantId}', 'edit');">[ Add Role ]</a>
        </c:when>
    </c:choose>
</body>
</html>
